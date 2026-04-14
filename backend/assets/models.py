from django.db import models
from core.models import Tenant
import datetime

class AssetCategory(models.Model):
    """
    Groups like Ornaments, Land, Vehicles, Electronics.
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="asset_categories", null=True, blank=True)
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Asset Categories"

    def __str__(self):
        return self.name

class Asset(models.Model):
    """
    High-value Fixed Assets of the Temple.
    """
    STATUS_HEALTHY = "healthy"
    STATUS_DAMAGED = "damaged"
    STATUS_MAINTENANCE = "maintenance"
    STATUS_LOST = "lost"

    STATUS_CHOICES = [
        (STATUS_HEALTHY, "Healthy/Fine"),
        (STATUS_DAMAGED, "Needs Repair"),
        (STATUS_MAINTENANCE, "Under Cleaning/Service"),
        (STATUS_LOST, "Missing/Lost"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="assets", null=True, blank=True)
    category = models.ForeignKey(AssetCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="assets")
    
    name = models.CharField(max_length=200, help_text="e.g. Traditional Golden Crown")
    asset_id = models.CharField(max_length=50, unique=True, help_text="Internal tracking number")
    
    description = models.TextField(blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    valuation = models.DecimalField(max_digits=15, decimal_places=2, help_text="Estimated market value", default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_HEALTHY)
    location = models.CharField(max_length=150, help_text="e.g. Locker A, Sanctum Sanctorum")
    custodian = models.CharField(max_length=100, blank=True, help_text="Who is currently responsible for it")

    # Maintenance Scheduling
    maintenance_interval_days = models.IntegerField(default=90, help_text="How often should this be cleaned/serviced?")
    last_maintained_on = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def next_maintenance_due(self):
        if not self.last_maintained_on:
            return None
        return self.last_maintained_on + datetime.timedelta(days=self.maintenance_interval_days)

    @property
    def is_maintenance_overdue(self):
        due = self.next_maintenance_due
        if not due:
            return True
        return due < datetime.date.today()

    def __str__(self):
        return f"{self.name} ({self.asset_id})"

class MaintenanceLog(models.Model):
    """
    Audit trail for when an asset was serviced/cleaned.
    """
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="maintenance_logs")
    service_date = models.DateField(default=datetime.date.today)
    performer = models.CharField(max_length=150, help_text="Who performed the service")
    
    activity = models.TextField(help_text="e.g. Silver polishing using traditional oils")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    next_planned_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update Asset status and last maintained date
        self.asset.last_maintained_on = self.service_date
        self.asset.status = Asset.STATUS_HEALTHY
        self.asset.save()

    def __str__(self):
        return f"Service for {self.asset.name} on {self.service_date}"
