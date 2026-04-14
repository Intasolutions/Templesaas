from django.db import models

class Lead(models.Model):
    INTEREST_LITE = "lite"
    INTEREST_PRO = "pro"
    INTEREST_PRO_MAX = "pro_max"
    INTEREST_ULTIMATE = "ultimate"
    
    INTEREST_CHOICES = [
        (INTEREST_LITE, "Lite Plan"),
        (INTEREST_PRO, "Pro Heritage"),
        (INTEREST_ULTIMATE, "Ultimate Devaswom"),
    ]

    # 1. Contact Info
    full_name = models.CharField(max_length=150)
    temple_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    # 2. Inquiry Details
    location = models.CharField(max_length=200, blank=True)
    message = models.TextField(blank=True)
    interested_plan = models.CharField(max_length=50, choices=INTEREST_CHOICES, default=INTEREST_PRO)
    trial_requested = models.BooleanField(default=False)
    
    # ── Geolocation ──────────────────────────────────────────────────
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # 3. Status Tracking
    is_responded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Heritage Lead"
        verbose_name_plural = "Heritage Leads"

    def __str__(self):
        return f"{self.temple_name} - {self.full_name}"
