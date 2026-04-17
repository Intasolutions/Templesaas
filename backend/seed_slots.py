import os
import django
from datetime import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pooja.models import Pooja, PoojaTimeSlot

def seed():
    print("--- Seeding Time Slots for Ganapathi Homam ---")
    poojas = Pooja.objects.filter(name__iexact="ganapathi homam")
    if not poojas.exists():
        print("Pooja not found.")
        return
        
    for p in poojas:
        # Create morning slots
        PoojaTimeSlot.objects.get_or_create(pooja=p, start_time=time(6, 0), end_time=time(7, 0))
        PoojaTimeSlot.objects.get_or_create(pooja=p, start_time=time(7, 0), end_time=time(8, 0))
        PoojaTimeSlot.objects.get_or_create(pooja=p, start_time=time(8, 0), end_time=time(9, 0))
        print(f"Slots added for {p.name}")

if __name__ == "__main__":
    seed()
