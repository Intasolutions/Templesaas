from django.db import models
from django.core.validators import MinValueValidator
from core.models import Tenant


class BankAccount(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="bank_accounts", null=True, blank=True)
    name = models.CharField(max_length=150)
    account_number = models.CharField(max_length=50, blank=True)
    ifsc_code = models.CharField(max_length=20, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.account_number})"


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

    PAYMODE_CASH = "cash"
    PAYMODE_BANK = "bank"
    PAYMODE_UPI = "upi"
    PAYMODE_CARD = "card"

    PAYMODE_CHOICES = [
        (PAYMODE_CASH, "Cash"),
        (PAYMODE_BANK, "Bank Transfer"),
        (PAYMODE_UPI, "UPI"),
        (PAYMODE_CARD, "Card"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="transactions", null=True, blank=True)
    txn_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default=CAT_OTHER)
    
    payment_mode = models.CharField(max_length=20, choices=PAYMODE_CHOICES, default=PAYMODE_CASH)
    bank_account = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")

    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(1.0)])

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
