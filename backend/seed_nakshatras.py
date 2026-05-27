import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from devotees.models import Nakshatra
from core.models import Tenant

NAKSHATRAS = [
    ("Ashwini", "അശ്വതി"), ("Bharani", "ഭരണി"), ("Krittika", "കാർത്തിക"),
    ("Rohini", "രോഹിണി"), ("Mrigashirsha", "മകയിരം"), ("Ardra", "തിരുവാതിര"),
    ("Punarvasu", "പുണർതം"), ("Pushya", "പൂയ്യം"), ("Ashlesha", "ആയില്യം"),
    ("Magha", "മകം"), ("Purva Phalguni", "പൂരം"), ("Uttara Phalguni", "ഉത്രം"),
    ("Hasta", "അത്തം"), ("Chitra", "ചിത്ര"), ("Swati", "ചോതി"),
    ("Vishakha", "വിശാഖം"), ("Anuradha", "അനിഴം"), ("Jyeshtha", "തൃക്കേട്ട"),
    ("Mula", "മൂലം"), ("Purva Ashadha", "പൂരാടം"), ("Uttara Ashadha", "ഉത്രാടം"),
    ("Shravana", "തിരുവോണം"), ("Dhanishtha", "അവിട്ടം"), ("Shatabhisha", "ചതയം"),
    ("Purva Bhadrapada", "പൂരുരുട്ടാതി"), ("Uttara Bhadrapada", "ഉത്രട്ടാതി"), ("Revati", "രേവതി")
]

def seed():
    tenants = Tenant.objects.all()
    print(f"Found {tenants.count()} tenants to seed.")
    
    for t in tenants:
        count = 0
        for eng, ml in NAKSHATRAS:
            # We use name as the unique key per tenant for seeding
            obj, created = Nakshatra.objects.update_or_create(
                organization=t,
                name=eng,
                defaults={'name_ml': ml}
            )
            if created:
                count += 1
        print(f"Seeded/Updated {count} stars for {t.name}")

if __name__ == "__main__":
    seed()
