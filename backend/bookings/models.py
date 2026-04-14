from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from devotees.models import Devotee
from pooja.models import Pooja, PoojaTimeSlot
from core.models import Tenant

class Booking(models.Model):
    # Booking status
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_CANCELLED = "cancelled"
    STATUS_COMPLETED = "completed"
    STATUS_REFUNDED = "refunded"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    # Source: online/offline
    SOURCE_OFFLINE = "offline"
    SOURCE_ONLINE = "online"
    SOURCE_CHOICES = [
        (SOURCE_OFFLINE, "Offline"),
        (SOURCE_ONLINE, "Online"),
    ]

    # Payment modes
    PAYMENT_UPI = "upi"
    PAYMENT_CARD = "card"
    PAYMENT_WALLET = "wallet"
    PAYMENT_CASH = "cash"
    PAYMENT_CHOICES = [
        (PAYMENT_UPI, "UPI"),
        (PAYMENT_CARD, "Card"),
        (PAYMENT_WALLET, "Wallet"),
        (PAYMENT_CASH, "Cash"),
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
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="bookings", null=True, blank=True)
    devotee = models.ForeignKey(Devotee, on_delete=models.CASCADE, related_name="bookings")
    pooja = models.ForeignKey(Pooja, on_delete=models.PROTECT, related_name="bookings")
    slot = models.ForeignKey(PoojaTimeSlot, on_delete=models.SET_NULL, null=True, blank=True)

    booking_date = models.DateField()
    booking_time = models.TimeField(null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default=SOURCE_OFFLINE)

    payment_mode = models.CharField(max_length=20, choices=PAYMENT_CHOICES, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=PAY_PENDING)

    # Payment gateway
    gateway = models.CharField(max_length=30, blank=True)
    gateway_order_id = models.CharField(max_length=100, blank=True)
    gateway_payment_id = models.CharField(max_length=100, blank=True)

    receipt_no = models.CharField(max_length=30, null=True, blank=True)
    qr_payload = models.TextField(blank=True)
    qr_image = models.ImageField(upload_to="booking_qr/", null=True, blank=True)

    reward_points = models.IntegerField(default=0) # Module 7: Loyalty
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_reason = models.CharField(max_length=255, blank=True)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["booking_date", "booking_time", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "receipt_no"],
                name="unique_receipt_no",
            )
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["booking_date"]),
            models.Index(fields=["pooja"]),
            models.Index(fields=["devotee"]),
            models.Index(fields=["status"]),
            models.Index(fields=["payment_status"]),
            models.Index(fields=["source"]),
        ]

    def clean(self):
        if self.source == self.SOURCE_ONLINE and self.payment_mode == self.PAYMENT_CASH:
            raise ValidationError({"payment_mode": "Cash is not allowed for online bookings."})

    def save(self, *args, **kwargs):
        if self.slot_id and not self.booking_time and hasattr(self.slot, "start_time"):
            self.booking_time = self.slot.start_time
        super().save(*args, **kwargs)

    def generate_receipt_no(self) -> str:
        today = timezone.localdate()
        prefix = f"R-{today.strftime('%Y%m%d')}-"
        last = (
            Booking.objects.filter(organization=self.organization, receipt_no__startswith=prefix)
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
            f"RECEIPT:{self.receipt_no or ''}|"
            f"BOOKING:{self.id}|"
            f"POOJA:{self.pooja_id}|"
            f"DATE:{self.booking_date}|"
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
        self.status = self.STATUS_CONFIRMED

        if not self.qr_payload:
            self.qr_payload = self.build_qr_payload()

        self.save()

    def __str__(self):
        return f"{self.devotee.full_name if self.devotee else 'Unknown'} - {self.pooja.name} ({self.booking_date})"
