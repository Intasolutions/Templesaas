from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from core.models import Tenant

class ItemCategory(models.Model):
    """
    inventory grouping (Flowers, Oil, Prasad, Pooja Materials etc.)
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="item_categories", null=True, blank=True)
    name = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_item_category")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return self.name


class Item(models.Model):
    """
    SaaS-safe item master.
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="items", null=True, blank=True)

    category = models.ForeignKey(
        ItemCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="items",
    )

    name = models.CharField(max_length=150)
    unit = models.CharField(max_length=50, default="pcs")  # kg, litre, pcs, etc.

    # Stock
    current_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    opening_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Low-stock alerts
    reorder_level = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_item_name")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
            models.Index(fields=["is_active"]),
            models.Index(fields=["category"]),
        ]

    @property
    def is_low_stock(self) -> bool:
        return self.is_active and self.reorder_level > 0 and self.current_stock <= self.reorder_level

    def clean(self):
        if self.current_stock < 0:
            raise ValidationError({"current_stock": "Stock cannot be negative."})

        if self.opening_stock < 0:
            raise ValidationError({"opening_stock": "Opening stock cannot be negative."})

        if self.reorder_level < 0:
            raise ValidationError({"reorder_level": "Reorder level cannot be negative."})

    def __str__(self):
        return self.name


class StockTransaction(models.Model):
    """
    Transaction ledger.
    """
    TYPE_IN = "in"
    TYPE_OUT = "out"
    TYPE_CHOICES = [
        (TYPE_IN, "Stock In"),
        (TYPE_OUT, "Stock Out"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="stock_transactions", null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name="transactions")
    txn_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0) # For cost tracking
    note = models.CharField(max_length=255, blank=True)

    # Optional references
    reference_type = models.CharField(max_length=50, blank=True)  # "purchase", "booking", "manual"
    reference_id = models.CharField(max_length=50, blank=True)

    # Direct link to purchase
    purchase = models.ForeignKey(
        "Purchase",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="stock_transactions"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["item"]),
            models.Index(fields=["txn_type"]),
        ]

    def clean(self):
        if self.quantity <= 0:
            raise ValidationError({"quantity": "Quantity must be greater than 0."})

        # Prevent negative stock
        if self.txn_type == self.TYPE_OUT and self.item_id:
            if self.item.current_stock - self.quantity < 0:
                raise ValidationError({"quantity": "Insufficient stock for this OUT transaction."})

    def apply_stock(self):
        with transaction.atomic():
            item = Item.objects.select_for_update().get(pk=self.item_id)
            if self.txn_type == self.TYPE_IN:
                item.current_stock = item.current_stock + self.quantity
            else:
                if item.current_stock - self.quantity < 0:
                    raise ValidationError("Insufficient stock.")
                item.current_stock = item.current_stock - self.quantity
            item.save(update_fields=["current_stock"])

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.apply_stock()

    def __str__(self):
        return f"{self.item.name} {self.txn_type} {self.quantity}"


class Vendor(models.Model):
    """
    Supplier/Vendor for purchasing inventory items.
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="vendors", null=True, blank=True)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    gst_number = models.CharField(max_length=20, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_vendor_name")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return self.name


class Purchase(models.Model):
    """
    Purchase Entry (Inward Bill).
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="purchases", null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name="purchases")

    invoice_number = models.CharField(max_length=50, blank=True)
    invoice_date = models.DateField()

    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bill_file = models.FileField(upload_to="purchase_bills/", null=True, blank=True)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-invoice_date", "-id"]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["vendor"]),
            models.Index(fields=["invoice_date"]),
        ]

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # FINANCE SYNC: Create Expense Transaction
        if self.total_amount > 0:
            from finance.models import Transaction
            txn_ref = f"PUR-{self.id}"
            if not Transaction.objects.filter(reference=txn_ref).exists():
                Transaction.objects.create(
                    organization=self.organization,
                    txn_type=Transaction.TYPE_EXPENSE,
                    category=Transaction.CAT_PURCHASE,
                    title=f"Purchase: {self.vendor.name}",
                    amount=self.total_amount,
                    date=self.invoice_date,
                    reference=txn_ref,
                    notes=f"Auto-generated from Purchase ID {self.id}. Invoice: {self.invoice_number}"
                )

    def __str__(self):
        return f"Bill {self.invoice_number} - {self.vendor.name}"
