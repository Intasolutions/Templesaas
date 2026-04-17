from django.db import models
from core.models import Tenant


class Transaction(models.Model):
    TYPE_INCOME = "income"
    TYPE_EXPENSE = "expense"

    TYPE_CHOICES = [
        (TYPE_INCOME, "Income"),
        (TYPE_EXPENSE, "Expense"),
    ]

    # Specialized categories for deeper analysis
    CAT_RITUAL = "ritual_fees"
    CAT_DONATION = "donation_general"
    CAT_HUNDI = "hundi_collection"
    CAT_SALARY = "staff_salary"
    CAT_MAINTENANCE = "temple_maintenance"
    CAT_PURCHASE = "stock_purchase"
    CAT_UTILITY = "utility_bills"
    CAT_OTHER = "other"

    CATEGORY_CHOICES = [
        (CAT_RITUAL, "Ritual Fees (Income)"),
        (CAT_DONATION, "Donations (Income)"),
        (CAT_HUNDI, "Hundi Collection (Income)"),
        (CAT_SALARY, "Staff Salary (Expense)"),
        (CAT_MAINTENANCE, "Maintenance (Expense)"),
        (CAT_PURCHASE, "Inventory/Stock (Expense)"),
        (CAT_UTILITY, "Utilities/Bills (Expense)"),
        (CAT_OTHER, "Other Miscellaneous"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="transactions", null=True, blank=True)
    txn_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default=CAT_OTHER)
    
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    date = models.DateField()
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["txn_type"]),
        ]

    def __str__(self):
        return f"{self.txn_type} - {self.title} - {self.amount}"
