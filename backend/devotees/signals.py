from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import Tenant
from .models import Nakshatra

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

@receiver(post_save, sender=Tenant)
def seed_tenant_nakshatras(sender, instance, created, **kwargs):
    if created:
        for eng, ml in NAKSHATRAS:
            Nakshatra.objects.get_or_create(
                organization=instance,
                name=eng,
                defaults={'name_ml': ml}
            )
