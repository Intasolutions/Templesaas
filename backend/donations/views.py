import csv
from django.http import HttpResponse, FileResponse
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes as api_permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils import TenantMixin
from core.permissions import ModulePermission
from .models import Donation, DonationCategory
from .serializers import DonationSerializer, DonationCategorySerializer
from .pdf_utils import generate_donation_receipt_pdf

# ----------------------------
# 1) Donation Category CRUD
# ----------------------------
class DonationCategoryListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = DonationCategory
    serializer_class = DonationCategorySerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "is_active"]
    ordering = ["name"]


class DonationCategoryDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = DonationCategory
    queryset = DonationCategory.objects.all()
    serializer_class = DonationCategorySerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ----------------------------
# 2) Donation CRUD + filters
# ----------------------------
class DonationListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = Donation
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = [
        "display_name",
        "devotee__full_name",
        "receipt_no",
        "gateway_order_id",
    ]
    ordering_fields = ["donated_at", "amount"]
    ordering = ["-donated_at"]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if not tenant:
            return Donation.objects.none()

        qs = Donation.objects.filter(organization=tenant).select_related("devotee", "category").order_by("-id")

        donation_date = self.request.query_params.get("date")          # YYYY-MM-DD
        month = self.request.query_params.get("month")                # 1-12
        year = self.request.query_params.get("year")                  # YYYY
        category_id = self.request.query_params.get("category")       # category id
        payment_mode = self.request.query_params.get("payment_mode")  # cash/upi/card/wallet/bank
        payment_status = self.request.query_params.get("payment_status")

        if donation_date:
            qs = qs.filter(donated_at__date=donation_date)
        if month and year:
            qs = qs.filter(donated_at__year=int(year), donated_at__month=int(month))
        if year and not month:
            qs = qs.filter(donated_at__year=int(year))
        if category_id:
            qs = qs.filter(category_id=category_id)
        if payment_mode:
            qs = qs.filter(payment_mode=payment_mode)
        if payment_status:
            qs = qs.filter(payment_status=payment_status)

        return qs

    def perform_create(self, serializer):
        tenant = getattr(self.request, "tenant", None)
        instance = serializer.save(organization=tenant)
        
        # If cash or explicitly marked success, trigger receipt generation and finance logging
        if instance.payment_mode == Donation.PAYMENT_CASH or instance.payment_status == Donation.PAY_SUCCESS:
            instance.mark_paid_success()


class DonationDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Donation
    queryset = Donation.objects.select_related("devotee", "category").all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ----------------------------
# 3) Create payment order
# ----------------------------
@api_view(["POST"])
@api_permission_classes([IsAuthenticated, ModulePermission])
def create_donation_order(request, pk):
    try:
        donation = Donation.objects.get(pk=pk)
    except Donation.DoesNotExist:
        return Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)

    gateway = request.data.get("gateway", "razorpay")
    fake_order_id = f"{gateway}_donation_order_{donation.id}"

    donation.gateway = gateway
    donation.gateway_order_id = fake_order_id
    donation.payment_status = Donation.PAY_PENDING
    donation.save()

    return Response({
        "donation_id": donation.id,
        "gateway": gateway,
        "gateway_order_id": donation.gateway_order_id,
        "amount": str(donation.amount),
        "currency": "INR",
        "status": donation.payment_status,
    })


# ----------------------------
# 4) Confirm payment
# ----------------------------
@api_view(["POST"])
def confirm_donation_payment(request, pk):
    try:
        donation = Donation.objects.get(pk=pk)
    except Donation.DoesNotExist:
        return Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)

    gateway = request.data.get("gateway", "")
    gateway_order_id = request.data.get("gateway_order_id", "")
    gateway_payment_id = request.data.get("gateway_payment_id", "")

    donation.mark_paid_success(
        gateway=gateway,
        gateway_order_id=gateway_order_id,
        gateway_payment_id=gateway_payment_id,
    )

    return Response(DonationSerializer(donation, context={"request": request}).data)


# ----------------------------
# 4) Donation Receipt PDF (Plain Django View for binary safety)
# ----------------------------
def donation_receipt_pdf(request, pk):
    # If using authentication, check request.user.is_authenticated here
    try:
        donation = Donation.objects.get(pk=pk)
    except Donation.DoesNotExist:
        return HttpResponse("Donation not found", status=404)

    # Auto-fix: If payment is success but receipt_no is missing, generate it now
    if donation.payment_status == Donation.PAY_SUCCESS and not donation.receipt_no:
        donation.mark_paid_success()
        donation.refresh_from_db()

    if not donation.receipt_no:
        return HttpResponse("Receipt not generated yet. This donation might be pending or failed.", status=400)

    buffer = generate_donation_receipt_pdf(donation)
    return FileResponse(buffer, as_attachment=True, filename=f"Receipt_{donation.receipt_no}.pdf")


# ----------------------------
# 5) Webhook endpoint
# ----------------------------
@api_view(["POST"])
def donation_payment_webhook(request, gateway):
    if gateway == "razorpay":
        event = request.data.get("event")
        if event == "order.paid":
            order_id = request.data.get("payload", {}).get("order", {}).get("entity", {}).get("id")
            payment_id = request.data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
            
            try:
                donation = Donation.objects.get(gateway_order_id=order_id)
                donation.mark_paid_success(
                    gateway="razorpay",
                    gateway_order_id=order_id,
                    gateway_payment_id=payment_id
                )
                return Response({"status": "success"})
            except Donation.DoesNotExist:
                return Response({"error": "Donation not found"}, status=404)
                
    return Response({"status": "received", "gateway": gateway})


# ----------------------------
# 6) Export CSV (monthly/yearly)
# ----------------------------
class DonationExportCSVView(generics.GenericAPIView):
    queryset = Donation.objects.select_related("devotee", "category").all()
    # Note: No TenantScopedQuerysetMixin needed
    
    def get(self, request, *args, **kwargs):
        month = request.query_params.get("month")
        year = request.query_params.get("year")

        qs = self.get_queryset()

        if year and month:
            qs = qs.filter(donated_at__year=int(year), donated_at__month=int(month))
            filename = f"donations_{year}_{month}.csv"
        elif year:
            qs = qs.filter(donated_at__year=int(year))
            filename = f"donations_{year}.csv"
        else:
            filename = "donations_all.csv"

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow([
            "Receipt No", "Date", "Devotee Name", "Phone", "Donor Display Name",
            "Category", "Purpose", "Amount", "Payment Mode", "Payment Status",
            "GST Applicable", "GST Number", "GST %", "GST Amount",
            "Gateway", "Gateway Order ID", "Gateway Payment ID",
        ])

        for d in qs.order_by("-donated_at"):
            donor_name = "Anonymous" if d.is_anonymous else (d.display_name or (d.devotee.full_name if d.devotee else "Unknown"))
            writer.writerow([
                d.receipt_no or "",
                d.donated_at.date(),
                d.devotee.full_name if d.devotee else "Unknown",
                d.devotee.phone if d.devotee else "",
                donor_name,
                d.category.name if d.category else "",
                d.purpose,
                d.amount,
                d.payment_mode,
                d.payment_status,
                d.is_gst_applicable,
                d.gst_number,
                d.gst_percent,
                d.gst_amount,
                d.gateway,
                d.gateway_order_id,
                d.gateway_payment_id,
            ])

        return response
