from django.db import models
from core.models import Tenant
from bookings.models import Booking

class PrasadShipment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PREPARED = "prepared"
    STATUS_DISPATCHED = "dispatched"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending Preparation"),
        (STATUS_PREPARED, "Prasad Prepared"),
        (STATUS_DISPATCHED, "Dispatched"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="shipments", null=True, blank=True)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="shipment", null=True, blank=True)
    
    # Courier Details
    courier_partner = models.CharField(max_length=100, blank=True, help_text="e.g. BlueDart, Delhivery, India Post")
    tracking_id = models.CharField(max_length=100, blank=True)
    tracking_url = models.URLField(blank=True)
    
    # Shipping Address (copied from devotee or entered manually)
    recipient_name = models.CharField(max_length=150)
    shipping_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    # Logs
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["status"]),
            models.Index(fields=["tracking_id"]),
        ]

    def __str__(self):
        receipt = self.booking.receipt_no if self.booking else "Manual"
        return f"Shipment for {receipt} - {self.status}"
