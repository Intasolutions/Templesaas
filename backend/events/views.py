from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Event
from .serializers import EventSerializer
from django.http import FileResponse
from .utils import generate_event_pass_pdf
from rest_framework.decorators import api_view
from rest_framework.response import Response
from bookings.models import Booking

from core.utils import TenantMixin
from .models import Event
from .serializers import EventSerializer

class EventListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = Event
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class EventDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Event
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
def event_pass_pdf(request, event_id, booking_id):
    """
    Standalone endpoint to get a pass for a specific booking for an event.
    """
    try:
        event = Event.objects.get(pk=event_id)
        booking = Booking.objects.get(pk=booking_id, pooja__festival_event=event)
    except (Event.DoesNotExist, Booking.DoesNotExist):
        return Response({"error": "Event or Booking not found"}, status=404)

    if not event.enable_digital_passes:
        return Response({"error": "Digital passes not enabled for this event"}, status=400)

    tenant_name = request.tenant.name if hasattr(request, "tenant") else "Temple Authority"
    buffer = generate_event_pass_pdf(event, booking.devotee.full_name if booking.devotee else "Unknown", booking.id, tenant_name)
    return FileResponse(buffer, as_attachment=True, filename=f"Pass_{event.name}_{booking.id}.pdf")


@api_view(["GET"])
def event_sample_pass_pdf(request, event_id):
    """
    Generates a SAMPLE pass for the event to preview the design.
    """
    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    tenant_name = request.tenant.name if hasattr(request, "tenant") else "Temple Authority"
    buffer = generate_event_pass_pdf(event, "Sample Devotee", "SAMPLE-001", tenant_name)
    return FileResponse(buffer, as_attachment=True, filename=f"Sample_Pass_{event.name}.pdf")
