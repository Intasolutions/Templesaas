from datetime import datetime
from django.db.models.functions import Coalesce
from django.db.models import F
from django.http import FileResponse

from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.utils import TenantMixin
from .models import Pooja, PoojaTimeSlot
from .serializers import PoojaSerializer, PoojaTimeSlotSerializer
from .pdf_utils import generate_pooja_daily_pdf
from bookings.models import Booking

# ----------------------------
# 1) Pooja CRUD
# ----------------------------
class PoojaListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = Pooja
    serializer_class = PoojaSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name", "amount", "created_at"]
    ordering = ["-id"]


class PoojaDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Pooja
    queryset = Pooja.objects.prefetch_related("time_slots").all()
    serializer_class = PoojaSerializer
    permission_classes = [AllowAny]


# ----------------------------
# 2) Time Slot CRUD
# ----------------------------
class PoojaTimeSlotListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = PoojaTimeSlot
    serializer_class = PoojaTimeSlotSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["pooja__name", "priest__username"]
    ordering_fields = ["start_time", "pooja"]
    ordering = ["start_time"]


class PoojaTimeSlotDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = PoojaTimeSlot
    queryset = PoojaTimeSlot.objects.select_related("pooja", "priest").all()
    serializer_class = PoojaTimeSlotSerializer
    permission_classes = [AllowAny]


# ----------------------------
# 3) Daily Pooja Print API
# ----------------------------
@api_view(["GET"])
def daily_print(request):
    date_str = request.GET.get("date")
    if not date_str:
        return Response({"error": "date is required. format: DD-MM-YYYY"}, status=400)

    # Accept DD-MM-YYYY (client) + fallback YYYY-MM-DD (dev)
    day = None
    for fmt in ("%d-%m-%Y", "%Y-%m-%d"):
        try:
            day = datetime.strptime(date_str, fmt).date()
            break
        except ValueError:
            continue

    if not day:
        return Response({"error": "Invalid date format. Use DD-MM-YYYY"}, status=400)

    # Note: Database router and Middleware handle tenant isolation.
    # We don't need to filter by tenant explicitly here.
    
    tenant = getattr(request, "tenant", None)
    if not tenant:
        return Response({"error": "No tenant associated with session."}, status=403)
        
    qs = (
        Booking.objects.select_related("devotee", "pooja", "slot", "devotee__gothra", "devotee__nakshatra")
        .filter(organization=tenant, booking_date=day)
        .annotate(print_time=Coalesce("booking_time", F("slot__start_time")))
        .order_by("print_time", "id")
    )

    results = []
    for b in qs:
        results.append({
            "devotee_name": b.devotee.full_name if b.devotee else "Unknown",
            "gothra": b.devotee.gothra.name if b.devotee and b.devotee.gothra else "",
            "nakshatra": b.devotee.nakshatra.name if b.devotee and b.devotee.nakshatra else "",
            "contact_number": b.devotee.phone if b.devotee else "",
            "pooja_name": b.pooja.name,
            "time_slot": str(getattr(b, "print_time", "") or ""),
            "amount_offering": str(b.amount),
            "notes_to_priest": b.notes or "",
            "booking_id": b.id,
            "status": b.status,
            "source": b.source,
        })

    if request.GET.get("export") == "pdf":
        # Pass temple name if available in request.tenant
        temple_name = getattr(request, "tenant", None)
        temple_name = temple_name.name if temple_name else "Temple"
        buffer = generate_pooja_daily_pdf(temple_name, day.strftime("%d-%m-%Y"), results)
        return FileResponse(buffer, as_attachment=True, filename=f"DailyPoojaPrint_{day.strftime('%Y%m%d')}.pdf")

    return Response({
        "date": day.strftime("%d-%m-%Y"),
        "count": len(results),
        "results": results
    })
