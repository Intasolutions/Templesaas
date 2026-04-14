from django.db import models
from core.models import Tenant


class Event(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="events", null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    start_date = models.DateField()
    end_date = models.DateField()

    location = models.CharField(max_length=200, blank=True)

    # Festival Management (Module 6)
    enable_digital_passes = models.BooleanField(default=False)
    pass_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Price per entry pass")
    
    # Simple crowd control logic
    max_capacity = models.PositiveIntegerField(default=0, help_text="0 for unlimited")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["start_date"]),
            models.Index(fields=["is_active"]),
        ]

    def get_current_occupancy(self):
        from bookings.models import Booking
        from django.db.models import Sum
        # Count all confirmed bookings for poojas linked to this event
        return Booking.objects.filter(
            pooja__festival_event=self,
            status="confirmed"
        ).count()

    def get_occupancy_percentage(self):
        if self.max_capacity <= 0:
            return 0
        return min(100, round((self.get_current_occupancy() / self.max_capacity) * 100, 2))

    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"
