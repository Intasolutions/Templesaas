from django.db import models
from django.utils import timezone
from inventory.models import Item
from core.models import Tenant

class MealToken(models.Model):
    """
    Daily Food Distribution Token.
    """
    
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="meal_tokens", null=True, blank=True)
    token_no = models.CharField(max_length=50) # Auto-generated daily sequence
    date = models.DateField(default=timezone.now)
    
    is_redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["token_no"]),
        ]

    def __str__(self):
        return f"Meal Token {self.token_no} ({self.date})"


class PrasadConsumption(models.Model):
    """
    Tracks raw material usage for Prasad preparation.
    """
    
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="prasad_consumptions", null=True, blank=True)
    prasad_name = models.CharField(max_length=150, help_text="e.g. Laddu Batch 1")
    date = models.DateField(default=timezone.now)
    
    # Link to Inventory Item (e.g., Ghee, Flour)
    # Could be a One-to-Many but for simplicity start with direct entries
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name="prasad_usages")
    quantity_used = models.DecimalField(max_digits=10, decimal_places=2)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        from inventory.models import StockTransaction
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Automatic Stock Subtraction
            StockTransaction.objects.create(
                organization=self.organization,
                item=self.item,
                txn_type=StockTransaction.TYPE_OUT,
                quantity=self.quantity_used,
                note=f"Consumed for {self.prasad_name}",
                reference_type="annadhanam",
                reference_id=str(self.id)
            )

    def __str__(self):
        return f"{self.prasad_name} - {self.item.name} ({self.quantity_used})"
