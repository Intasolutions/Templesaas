import os
import django

import sys
from pathlib import Path

# Add the backend directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Plan

plans_data = [
    {
        "name": "LITE",
        "allowed_apps": ["devotees", "pooja", "bookings", "notifications", "core", "users", "reports"]
    },
    {
        "name": "PRO",
        "allowed_apps": ["devotees", "pooja", "bookings", "notifications", "core", "users", "reports", "donations", "events", "inventory", "finance"]
    },
    {
        "name": "PRO_MAX",
        "allowed_apps": ["devotees", "pooja", "bookings", "notifications", "core", "users", "reports", "donations", "events", "inventory", "finance", "hundi", "annadhanam", "queues", "audit_logs", "leads", "shipments", "panchangam", "assets"]
    }
]

for plan_info in plans_data:
    plan, created = Plan.objects.get_or_create(name=plan_info["name"])
    plan.allowed_apps = plan_info["allowed_apps"]
    plan.save()
    if created:
        print(f"Created plan: {plan.name}")
    else:
        print(f"Updated plan: {plan.name}")

print("Plan initialization complete.")
