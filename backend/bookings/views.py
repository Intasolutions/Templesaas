from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.http import FileResponse
from core.permissions import ModulePermission
from core.utils import TenantMixin
from .models import Booking
from .serializers import BookingSerializer
from .pdf_utils import generate_booking_receipt_pdf

class BookingListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = Booking
    queryset = Booking.objects.select_related("devotee", "pooja", "slot").all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "devotee__full_name",
        "devotee__phone",
        "pooja__name",
        "receipt_no",
        "gateway_order_id",
        "gateway_payment_id",
    ]

    def get_queryset(self):
        qs = super().get_queryset().select_related(
            "devotee", "pooja", "slot", "devotee__gothra", "devotee__nakshatra"
        ).order_by("-id")

        booking_date = self.request.query_params.get("date")
        pooja_id = self.request.query_params.get("pooja")
        status_val = self.request.query_params.get("status")
        payment_status = self.request.query_params.get("payment_status")
        source = self.request.query_params.get("source")
        phone = self.request.query_params.get("phone")

        if booking_date:
            qs = qs.filter(booking_date=booking_date)
        if pooja_id:
            qs = qs.filter(pooja_id=pooja_id)
        if status_val:
            qs = qs.filter(status=status_val)
        if payment_status:
            qs = qs.filter(payment_status=payment_status)
        if source:
            qs = qs.filter(source=source)
        if phone:
            qs = qs.filter(devotee__phone=phone)

        return qs


class BookingDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Booking
    queryset = Booking.objects.select_related(
        "devotee", "pooja", "slot", "devotee__gothra", "devotee__nakshatra"
    ).all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ----------------------------
# Receipt PDF (Plain Django View for binary safety)
# ----------------------------
def booking_receipt_pdf(request, pk):
    try:
        booking = Booking.objects.select_related("devotee", "pooja", "organization").get(pk=pk)
    except Booking.DoesNotExist:
        return HttpResponse("Booking not found", status=404)

    # Auto-fix: generate receipt if it's missing but paid
    if booking.payment_status == Booking.PAY_SUCCESS and not booking.receipt_no:
        booking.mark_paid_success()
        booking.refresh_from_db()

    buffer = generate_booking_receipt_pdf(booking)
    return FileResponse(buffer, as_attachment=True, filename=f"Receipt_{booking.receipt_no or booking.id}.pdf")


@api_view(["POST"])
@permission_classes([IsAuthenticated, ModulePermission])
def create_order(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    gateway = request.data.get("gateway", "razorpay")
    fake_order_id = f"{gateway}_order_{booking.id}"

    booking.gateway = gateway
    booking.gateway_order_id = fake_order_id
    booking.payment_status = Booking.PAY_PENDING
    booking.source = Booking.SOURCE_ONLINE
    booking.save()

    return Response({
        "booking_id": booking.id,
        "gateway": gateway,
        "gateway_order_id": booking.gateway_order_id,
        "amount": str(booking.amount),
        "currency": "INR",
        "status": booking.payment_status,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated, ModulePermission])
def confirm_payment(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    gateway = request.data.get("gateway", "")
    gateway_order_id = request.data.get("gateway_order_id", "")
    gateway_payment_id = request.data.get("gateway_payment_id", "")

    booking.mark_paid_success(
        gateway=gateway,
        gateway_order_id=gateway_order_id,
        gateway_payment_id=gateway_payment_id,
    )

    return Response(BookingSerializer(booking, context={"request": request}).data)


@api_view(["POST"])
def payment_webhook(request, gateway):
    if gateway == "razorpay":
        event = request.data.get("event")
        if event == "order.paid":
            order_id = request.data.get("payload", {}).get("order", {}).get("entity", {}).get("id")
            payment_id = request.data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
            
            try:
                booking = Booking.objects.get(gateway_order_id=order_id)
                booking.mark_paid_success(
                    gateway="razorpay",
                    gateway_order_id=order_id,
                    gateway_payment_id=payment_id
                )
                return Response({"status": "success"})
            except Booking.DoesNotExist:
                return Response({"error": "Booking not found"}, status=404)

    return Response({"status": "received", "gateway": gateway})


@api_view(["POST"])
@permission_classes([IsAdminUser])
def refund_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    refund_amount = request.data.get("refund_amount")
    refund_reason = request.data.get("refund_reason", "")

    booking.refund_amount = refund_amount
    booking.refund_reason = refund_reason

    booking.payment_status = Booking.PAY_REFUNDED
    booking.status = Booking.STATUS_REFUNDED
    booking.save()

    return Response(BookingSerializer(booking, context={"request": request}).data)
