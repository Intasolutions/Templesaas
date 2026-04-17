import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pooja.models import Pooja, PoojaTimeSlot

def check():
    print("--- Checking Pooja Slots ---")
    poojas = Pooja.objects.all()
    for p in poojas:
        slots = p.time_slots.all()
        print(f"Pooja: {p.name} (ID: {p.id}) | Slots Count: {slots.count()}")
        for s in slots:
            print(f"  Slot: {s.start_time} - {s.end_time}")

if __name__ == "__main__":
    check()
