from django.db import models
from django.utils import timezone
from core.models import Tenant

class QueueSession(models.Model):
    """
    Manages a daily or event-based queue (e.g. "Darshan Line - 01 Jan").
    """
    STATUS_ACTIVE = "active"
    STATUS_PAUSED = "paused"
    STATUS_CLOSED = "closed"
    
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_PAUSED, "Paused"),
        (STATUS_CLOSED, "Closed"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="queue_sessions", null=True, blank=True)
    name = models.CharField(max_length=150)
    
    # Configuration
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    
    current_token_number = models.PositiveIntegerField(default=0, help_text="Currently serving")
    last_issued_number = models.PositiveIntegerField(default=0, help_text="Last token generated")
    
    avg_wait_time_minutes = models.PositiveIntegerField(default=5)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_time"]

    def __str__(self):
        return f"{self.name} (Serving: {self.current_token_number})"


class Token(models.Model):
    """
    Individual Entry Token (Digital or Printed).
    """
    STATUS_WAITING = "waiting"
    STATUS_SERVING = "serving"
    STATUS_COMPLETED = "completed"
    STATUS_NO_SHOW = "no_show"

    STATUS_CHOICES = [
        (STATUS_WAITING, "Waiting"),
        (STATUS_SERVING, "Serving Now"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_NO_SHOW, "No Show"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="tokens", null=True, blank=True)
    session = models.ForeignKey(QueueSession, on_delete=models.CASCADE, related_name="tokens")
    
    number = models.PositiveIntegerField()
    priority = models.BooleanField(default=False, help_text="Senior Citizen / VIP")
    
    phone = models.CharField(max_length=15, blank=True) # For SMS notification
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_WAITING)
    
    issued_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["session", "number"], name="unique_token_per_session")
        ]
        ordering = ["session", "number"]

    def send_sms_notification(self, message=None):
        if not self.phone:
            return False
        msg = message or f"Token #{self.number} for {self.session.name} is now being served. Please proceed."
        print(f"SMS SENT TO {self.phone}: {msg}")
        return True

    def __str__(self):
        return f"{self.session.name} - #{self.number}"
