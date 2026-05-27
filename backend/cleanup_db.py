
from django.contrib.auth.models import User
from core.models import Tenant, Subscription, SubscriptionRequest
from users.models import UserProfile

def cleanup():
    print("Starting cleanup...")
    
    # Delete all Tenants (this should cascade to Subscriptions if configured, but let's be explicit)
    tenant_count = Tenant.objects.all().count()
    Tenant.objects.all().delete()
    print(f"Deleted {tenant_count} tenants.")
    
    # Delete all Users EXCEPT superusers (optional, but let's delete all if they want a clean slate)
    # The user said "clean it", so let's remove everyone so they can reuse emails.
    user_count = User.objects.all().count()
    User.objects.all().delete()
    print(f"Deleted {user_count} users (including superusers for a full reset).")
    
    # UserProfile should be deleted by cascade or signal, but User.objects.all().delete() handles it.
    
    print("Cleanup complete. You can now sign up with any email/subdomain.")

if __name__ == "__main__":
    cleanup()
