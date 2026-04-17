from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from devotees.models import Devotee
from core.models import Tenant

class DonationCategory(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="donation_categories", null=True, blank=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_donation_category")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return self.name


class Donation(models.Model):
    # Payment modes
    PAYMENT_CASH = "cash"
    PAYMENT_UPI = "upi"
    PAYMENT_CARD = "card"
    PAYMENT_WALLET = "wallet"
    PAYMENT_BANK = "bank"
    PAYMENT_CHOICES = [
        (PAYMENT_CASH, "Cash"),
        (PAYMENT_UPI, "UPI"),
        (PAYMENT_CARD, "Card"),
        (PAYMENT_WALLET, "Wallet"),
        (PAYMENT_BANK, "Bank Transfer"),
    ]

    # Payment status
    PAY_PENDING = "pending"
    PAY_SUCCESS = "success"
    PAY_FAILED = "failed"
    PAY_REFUNDED = "refunded"
    PAYMENT_STATUS_CHOICES = [
        (PAY_PENDING, "Pending"),
        (PAY_SUCCESS, "Success"),
        (PAY_FAILED, "Failed"),
        (PAY_REFUNDED, "Refunded"),
    ]

    # relations
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="donations", null=True, blank=True)
    devotee = models.ForeignKey(Devotee, on_delete=models.PROTECT, related_name="donations", null=True, blank=True)
    category = models.ForeignKey(
        DonationCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations",
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # donor recognition
    display_name = models.CharField(max_length=120, blank=True)
    is_anonymous = models.BooleanField(default=False)

    purpose = models.CharField(max_length=150, blank=True)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_CASH)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=PAY_PENDING)

    # Payment gateway
    gateway = models.CharField(max_length=30, blank=True)
    gateway_order_id = models.CharField(max_length=100, blank=True)
    gateway_payment_id = models.CharField(max_length=100, blank=True)

    receipt_no = models.CharField(max_length=30, null=True, blank=True)
    qr_payload = models.TextField(blank=True)
    qr_image = models.ImageField(upload_to="donation_qr/", null=True, blank=True)

    is_gst_applicable = models.BooleanField(default=False)
    gst_number = models.CharField(max_length=20, blank=True)
    gst_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    remarks = models.TextField(blank=True)
    donated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-donated_at"]
        verbose_name = "Donation"
        verbose_name_plural = "Donations"
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "receipt_no"],
                name="unique_donation_receipt",
            )
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["donated_at"]),
            models.Index(fields=["payment_status"]),
            models.Index(fields=["payment_mode"]),
            models.Index(fields=["devotee"]),
            models.Index(fields=["category"]),
        ]

    def clean(self):
        if self.is_gst_applicable and not self.gst_number:
            raise ValidationError({"gst_number": "GST number is required when GST is applicable."})

    def generate_receipt_no(self) -> str:
        today = timezone.localdate()
        prefix = f"D-{today.strftime('%Y%m%d')}-"
        last = (
            Donation.objects.filter(organization=self.organization, receipt_no__startswith=prefix)
            .order_by("-receipt_no")
            .values_list("receipt_no", flat=True)
            .first()
        )
        if last:
            try:
                last_seq = int(last.split("-")[-1])
            except Exception:
                last_seq = 0
        else:
            last_seq = 0
        return f"{prefix}{last_seq + 1:06d}"

    def build_qr_payload(self) -> str:
        return (
            f"DONATION_RECEIPT:{self.receipt_no or ''}|"
            f"DONATION:{self.id}|"
            f"AMOUNT:{self.amount}|"
            f"PHONE:{self.devotee.phone if self.devotee else ''}"
        )

    def mark_paid_success(self, gateway: str = "", gateway_order_id: str = "", gateway_payment_id: str = ""):
        if gateway:
            self.gateway = gateway
        if gateway_order_id:
            self.gateway_order_id = gateway_order_id
        if gateway_payment_id:
            self.gateway_payment_id = gateway_payment_id

        if not self.receipt_no:
            self.receipt_no = self.generate_receipt_no()

        self.payment_status = self.PAY_SUCCESS

        if not self.qr_payload:
            self.qr_payload = self.build_qr_payload()

        self.save()

        from finance.models import Transaction
        txn_ref = f"DN-{self.receipt_no}"
        if not Transaction.objects.filter(reference=txn_ref).exists():
            Transaction.objects.create(
                organization=self.organization,
                txn_type=Transaction.TYPE_INCOME,
                category=Transaction.CAT_DONATION,
                title=f"Donation: {self.category.name if self.category else 'General'}",
                amount=self.amount,
                date=self.donated_at.date(),
                reference=txn_ref,
                notes=f"Auto-generated from Donation ID {self.id}. Donor: {self.devotee.full_name if self.devotee else 'Unknown'}"
            )

    def __str__(self):
        name = "Anonymous" if self.is_anonymous else (self.display_name or (self.devotee.full_name if self.devotee else "Unknown"))
        return f"{self.receipt_no or 'NO-RECEIPT'} - {name} - {self.amount}"
