import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Tenant
from core.utils import provision_tenant_db

tenant = Tenant.objects.get(subdomain="temple1")
provision_tenant_db(tenant)
print("Tenant DB provisioned successfully.")
