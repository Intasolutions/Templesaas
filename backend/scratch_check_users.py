import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Tenant

for u in User.objects.all():
    print(f"User: {u.username}, Email: {u.email}")
