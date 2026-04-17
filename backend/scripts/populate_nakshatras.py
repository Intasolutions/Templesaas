import os
import django
import sys
from pathlib import Path

# Add the backend directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from devotees.models import Nakshatra

nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
    "Uttara Bhadrapada", "Revati"
]

created_count = 0
for name in nakshatras:
    obj, created = Nakshatra.objects.get_or_create(name=name, organization=None)
    if created:
        created_count += 1

print(f"Successfully populated {created_count} new Nakshatras (Total: {len(nakshatras)}).")
