import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.serializers import BookingSerializer
from bookings.models import Booking

try:
    print("--- Starting Serialization Test ---")
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    data = serializer.data
    print(f"Successfully serialized {len(data)} items.")
    if len(data) > 0:
        print("First item check:", data[0])
except Exception as e:
    print("!!! CRASH DETECTED !!!")
    print(traceback.format_exc())
