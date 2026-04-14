from django.db import models
from core.models import Tenant


class Transaction(models.Model):
    TYPE_INCOME = "income"
    TYPE_EXPENSE = "expense"

    TYPE_CHOICES = [
        (TYPE_INCOME, "Income"),
        (TYPE_EXPENSE, "Expense"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="transactions", null=True, blank=True)
    txn_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)  # e.g., Donation, Pooja Booking, Purchase
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    date = models.DateField()
    reference = models.CharField(max_length=100, blank=True)  # receipt no / invoice no
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["txn_type"]),
        ]

    def __str__(self):
        return f"{self.txn_type} - {self.title} - {self.amount}"
