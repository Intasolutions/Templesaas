from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from core.models import Tenant
from events.models import Event

class Pooja(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="poojas", null=True, blank=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)

    # Festival-specific pooja (optional)
    is_festival_special = models.BooleanField(default=False)
    festival_event = models.ForeignKey(
        Event, on_delete=models.SET_NULL, null=True, blank=True, related_name="festival_poojas"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_pooja_name")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
            models.Index(fields=["is_active"]),
        ]

    def clean(self):
        if self.is_festival_special and not self.festival_event_id:
            raise ValidationError({"festival_event": "Festival event is required for festival special pooja."})

    def __str__(self):
        return self.name


class PoojaTimeSlot(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="pooja_slots", null=True, blank=True)
    pooja = models.ForeignKey(Pooja, on_delete=models.CASCADE, related_name="time_slots")

    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)

    # optional capacity tracking
    capacity = models.PositiveIntegerField(null=True, blank=True)

    # assign priest (optional)
    priest = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_pooja_slots"
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "pooja", "start_time"],
                name="unique_slot_per_pooja"
            )
        ]
        ordering = ["start_time"]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["pooja", "start_time"]),
            models.Index(fields=["start_time"]),
        ]

    def clean(self):
        # basic validation: end_time should be after start_time if provided
        if self.end_time and self.end_time <= self.start_time:
            raise ValidationError({"end_time": "End time must be after start time."})

    def __str__(self):
        return f"{self.pooja.name} @ {self.start_time}"
