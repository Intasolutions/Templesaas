from django.db import models
from django.conf import settings
from core.models import Tenant

class Reminder(models.Model):
    """
    Module: Reminders (Internal Tasks & Notifications)
    Used for tracking upcoming festivals, administrative follow-ups, and devotee alerts.
    """
    TITLE_CHOICES = [
        ('FESTIVAL', 'Festival Preparation'),
        ('FOLLOWUP', 'Devotee Follow-up'),
        ('INVENTORY', 'Restock Alert'),
        ('MAINTENANCE', 'Temple Maintenance'),
        ('OTHER', 'General Task'),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="reminders", null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=TITLE_CHOICES, default='OTHER')
    
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    
    # Priority handling
    is_urgent = models.BooleanField(default=False)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-is_urgent']

    def __str__(self):
        return f"{self.title} - {self.due_date}"
