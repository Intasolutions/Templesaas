from django.db import models
import uuid

class Organization(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free Tier'),
        ('pro', 'Pro Tier'),
        ('enterprise', 'Enterprise Tier'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Temple Name")
    slug = models.SlugField(unique=True, help_text="Used for subdomain or unique identifier (e.g. mahadeva-temple)")
    logo = models.ImageField(upload_to='temple_logos/', null=True, blank=True)
    brand_color = models.CharField(max_length=10, default="#6366f1", help_text="Primary color for this temple's dashboard")
    
    # Contact Info
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    address = models.TextField()
    
    # SaaS Subscription
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    is_active = models.BooleanField(default=True)
    is_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TenantBaseModel(models.Model):
    """
    All models in the SaaS product should inherit from this.
    It ensures that data is always isolated per Temple.
    """
    tenant = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="%(class)s_data")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
