from django.db import models

class Plan(models.Model):
    """
    Subscription Plans (LITE, PRO, PRO_MAX)
    """
    LITE = 'LITE'
    PRO = 'PRO'
    PRO_MAX = 'PRO_MAX'
    
    PLAN_CHOICES = [
        (LITE, 'Lite'),
        (PRO, 'Pro'),
        (PRO_MAX, 'Pro Max'),
    ]
    
    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    allowed_apps = models.JSONField(default=list, help_text="List of app labels allowed for this plan")
    
    def __str__(self):
        return self.name

class Tenant(models.Model):
    """
    SaaS Tenant / Temple
    One record = one temple
    """
    name = models.CharField(max_length=150)
    subdomain = models.CharField(max_length=63, unique=True, help_text="Used for the URL: subdomain.yourdomain.com")
    
    # Branding
    logo = models.ImageField(upload_to='temple_logos/', null=True, blank=True)
    brand_color = models.CharField(max_length=10, default="#6366f1", help_text="Primary UI color")
    
    # Contact
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    db_name = models.CharField(max_length=63, unique=True, help_text="Internal identifier")
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, null=True, blank=True)
    
    # Location for Panchangam calculations
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if self.is_trial and not self.trial_ends_at:
            from django.utils import timezone
            from datetime import timedelta
            self.trial_ends_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
