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
    razorpay_plan_id = models.CharField(max_length=100, blank=True, null=True, help_text="Plan ID from Razorpay Dashboard")
    
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
    
    # Authorized Signatory (for receipts)
    authorized_signatory_name = models.CharField(max_length=150, blank=True, help_text="Name of the official signing receipts (e.g., K. Balakrishnan)")
    authorized_signatory_designation = models.CharField(max_length=100, blank=True, help_text="Official designation (e.g., Executive Officer)")
    
    # Razorpay Specific
    razorpay_customer_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Location for Panchangam calculations
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    
    # Lifecycle Status
    STATUS_TRIAL = 'trial'
    STATUS_PENDING_APPROVAL = 'pending_approval'
    STATUS_APPROVED = 'approved'
    STATUS_ACTIVE = 'active'
    STATUS_EXPIRED = 'expired'
    
    STATUS_CHOICES = [
        (STATUS_TRIAL, 'Free Trial'),
        (STATUS_PENDING_APPROVAL, 'Pending Approval'),
        (STATUS_APPROVED, 'Approved (Payment Pending)'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_EXPIRED, 'Expired'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_TRIAL)
    
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

class SubscriptionRequest(models.Model):
    """
    Client's request to purchase a plan
    """
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_PAID = 'paid'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending Review'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_PAID, 'Paid & Activated'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='purchase_requests')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    # Billing info
    billing_cycle = models.CharField(max_length=10, choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')], default='monthly')
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Amount at the time of request")
    
    notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)

    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.plan.name} ({self.status})"

class Subscription(models.Model):
    """
    Links a Tenant to a recurring Razorpay Subscription
    """
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('authenticated', 'Authenticated'),
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('halted', 'Halted'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]

    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='subscription')
    razorpay_subscription_id = models.CharField(max_length=100, unique=True)
    razorpay_plan_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.status}"
