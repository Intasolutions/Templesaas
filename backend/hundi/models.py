from django.db import models
from django.contrib.auth.models import User
from core.models import Tenant

class HundiSession(models.Model):
    """
    Represents a periodic Hundi Opening event.
    """
    STATUS_OPEN = "open"
    STATUS_COUNTING = "counting"
    STATUS_CLOSED = "closed"

    STATUS_CHOICES = [
        (STATUS_OPEN, "Open"),
        (STATUS_COUNTING, "Counting In Progress"),
        (STATUS_CLOSED, "Closed & Verified"),
    ]

    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="hundi_sessions", null=True, blank=True)
    name = models.CharField(max_length=150, help_text="e.g. Weekly Hundi Opening - Jan Week 1")
    opening_date = models.DateField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_OPEN)
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Audit Proof (Module 5 requirement)
    proof_attachment = models.FileField(upload_to="hundi_proofs/", null=True, blank=True)
    
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-opening_date"]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # FINANCE SYNC: Create Income Transaction on Close
        if self.status == self.STATUS_CLOSED and self.total_amount > 0:
            from finance.models import Transaction
            txn_ref = f"HUNDI-{self.id}"
            
            # Note: No tenant filter needed here anymore
            if not Transaction.objects.filter(reference=txn_ref).exists():
                Transaction.objects.create(
                    organization=self.organization,
                    txn_type=Transaction.TYPE_INCOME,
                    category=Transaction.CAT_HUNDI,
                    title=f"Hundi Collection: {self.name}",
                    amount=self.total_amount,
                    date=self.opening_date,
                    reference=txn_ref,
                    notes=f"Auto-generated from Hundi Session ID {self.id}"
                )

    def __str__(self):
        return f"{self.name} ({self.total_amount})"


class HundiCollection(models.Model):
    """
    Denomination-wise Cash Entry.
    """
    # tenant field removed - handled by DB isolation
    session = models.ForeignKey(HundiSession, on_delete=models.PROTECT, related_name="collections")

    DENOMINATION_CHOICES = [
         (500, "500"),
         (200, "200"),
         (100, "100"),
         (50, "50"),
         (20, "20"),
         (10, "10"),
         (5, "5"),
         (2, "2"),
         (1, "1"),
    ]

    denomination = models.PositiveIntegerField(choices=DENOMINATION_CHOICES)
    count = models.PositiveIntegerField(default=0)
    amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.amount = self.denomination * self.count
        super().save(*args, **kwargs)
        
        # Update parent session total
        total = self.session.collections.aggregate(total=models.Sum("amount"))["total"] or 0
        self.session.total_amount = total
        self.session.save(update_fields=["total_amount"])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["session", "denomination"], name="unique_denomination_per_session")
        ]

    def __str__(self):
        return f"{self.denomination} x {self.count} = {self.amount}"


class HundiWitness(models.Model):
    """
    Staff/Volunteers present during counting (Audit Trail).
    """
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="hundi_witnesses", null=True, blank=True)
    session = models.ForeignKey(HundiSession, on_delete=models.CASCADE, related_name="witnesses")
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=150, help_text="Name if not a system user")
    role = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name_plural = "Hundi Witnesses"

    def __str__(self):
        return self.name or (self.user.username if self.user else "Unknown")
