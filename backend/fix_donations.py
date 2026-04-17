import os
import django
import sys

# Add the current directory to sys.path to find the config module
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from donations.models import Donation

def fix_pending():
    qs = Donation.objects.filter(payment_status='pending')
    count = qs.count()
    for d in qs:
        d.mark_paid_success()
    print(f"Successfully fixed {count} donations.")

if __name__ == "__main__":
    fix_pending()
