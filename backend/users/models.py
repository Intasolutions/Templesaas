from django.contrib.auth.models import User
from django.db import models
from core.models import Tenant


class UserProfile(models.Model):
    # PDF-aligned roles (Super Admin handled by user.is_superuser)
    ROLE_TEMPLE_ADMIN = "temple_admin"
    ROLE_ACCOUNTANT = "accountant"
    ROLE_PRIEST = "priest"
    ROLE_COUNTER_STAFF = "counter_staff"
    ROLE_VOLUNTEER = "volunteer"
    ROLE_DEVOTEE = "devotee"

    ROLE_CHOICES = [
        (ROLE_TEMPLE_ADMIN, "Temple Admin"),
        (ROLE_ACCOUNTANT, "Accountant"),
        (ROLE_PRIEST, "Priest"),
        (ROLE_COUNTER_STAFF, "Counter Staff"),
        (ROLE_VOLUNTEER, "Volunteer"),
        (ROLE_DEVOTEE, "Devotee"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True, related_name='members')
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_DEVOTEE,
    )
    phone = models.CharField(max_length=15, blank=True)
    module_permissions = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    def is_super_admin(self):
        return self.user.is_superuser

    def is_temple_admin(self):
        return self.role == self.ROLE_TEMPLE_ADMIN or self.user.is_superuser

    def is_accountant(self):
        return self.role == self.ROLE_ACCOUNTANT or self.user.is_superuser


class Attendance(models.Model):
    """
    Staff/Volunteer Attendance Ledger.
    """
    STATUS_PRESENT = "present"
    STATUS_ABSENT = "absent"
    STATUS_LEAVE = "leave"
    STATUS_HALF_DAY = "half_day"

    STATUS_CHOICES = [
        (STATUS_PRESENT, "Present"),
        (STATUS_ABSENT, "Absent"),
        (STATUS_LEAVE, "Leave"),
        (STATUS_HALF_DAY, "Half Day"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="attendance_records", null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_attendance")
    date = models.DateField()
    
    in_time = models.TimeField(null=True, blank=True)
    out_time = models.TimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PRESENT)
    remarks = models.CharField(max_length=255, blank=True)

    # Geo-fencing & Verification (Anti-Fraud)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False, help_text="Verified via QR/Geo-fencing")
    verification_method = models.CharField(
        max_length=20, 
        choices=[('manual', 'Manual'), ('qr', 'QR Code'), ('geo', 'Geo-fencing')], 
        default='manual'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        constraints = [
            models.UniqueConstraint(fields=["user", "date"], name="unique_attendance_per_user_per_day")
        ]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["date", "status"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date} ({self.status})"


class DutyRoster(models.Model):
    """
    Staff Duty Scheduler (Module 10).
    """
    SHIFT_MORNING = "morning"
    SHIFT_EVENING = "evening"
    SHIFT_FULL = "full"
    
    SHIFT_CHOICES = [
        (SHIFT_MORNING, "Morning (6am-2pm)"),
        (SHIFT_EVENING, "Evening (2pm-10pm)"),
        (SHIFT_FULL, "Full Day"),
    ]

    # tenant field removed - handled by DB isolation
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="duties", null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_duties")
    
    date = models.DateField()
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    area = models.CharField(max_length=100, help_text="e.g. Sanctum, Counter, Hundi")
    
    notes = models.CharField(max_length=255, blank=True)
    
    class Meta:
        ordering = ["date", "shift"]
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date} ({self.shift})"
