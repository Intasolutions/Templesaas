import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Tenant
from devotees.models import Nakshatra

tenants = Tenant.objects.all()
print(f"Tenants: {[(t.name, t.subdomain) for t in tenants]}")

for t in tenants:
    count = Nakshatra.objects.filter(organization=t).count()
    print(f"Tenant: {t.name} ({t.subdomain}), Nakshatra count: {count}")

global_count = Nakshatra.objects.filter(organization__isnull=True).count()
print(f"Global Nakshatra count: {global_count}")
