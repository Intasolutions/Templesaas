from django.db import models
from django.contrib.auth.models import User
from core.models import Tenant

class Notification(models.Model):
    """
    Centralized Notification Log (SMS/Email/Push).
    """
    TYPE_SMS = "sms"
    TYPE_EMAIL = "email"
    TYPE_PUSH = "push"
    
    TYPE_CHOICES = [
        (TYPE_SMS, "SMS"),
        (TYPE_EMAIL, "Email"),
        (TYPE_PUSH, "Push Notification"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    recipient_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    recipient_email = models.EmailField(blank=True)
    
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    
    sent_at = models.DateTimeField(auto_now_add=True)
    is_delivered = models.BooleanField(default=False)
    
    # Metadata for grouping
    context = models.CharField(max_length=50, blank=True, help_text="e.g. booking_id:123")

    class Meta:
        ordering = ["-sent_at"]

    def __str__(self):
        return f"{self.notification_type} to {self.recipient_phone or self.recipient_email}"
