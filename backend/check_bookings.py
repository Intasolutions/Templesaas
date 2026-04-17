import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.models import Booking

def check():
    print("--- Checking All Bookings (April 2026) ---")
    bookings = Booking.objects.filter(booking_date__year=2026, booking_date__month=4)
    if not bookings.exists():
        print("No bookings found for April 2026.")
        return
        
    for b in bookings:
        print(f"ID: {b.id} | Date: {b.booking_date} | Devotee: {b.devotee.full_name if b.devotee else 'None'} | Pooja: {b.pooja.name if b.pooja else 'None'} | Prasad: {b.prasadam_item.name if b.prasadam_item else 'None'} | Status: {b.status}")

if __name__ == "__main__":
    check()
