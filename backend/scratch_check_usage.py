import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from devotees.models import Devotee, Nakshatra

count = Devotee.objects.filter(nakshatra__isnull=False).count()
print(f"Devotees with Nakshatra: {count}")

for d in Devotee.objects.filter(nakshatra__isnull=False)[:10]:
    print(f"Devotee: {d.full_name}, Nakshatra: {d.nakshatra.name} (Org: {d.nakshatra.organization})")
