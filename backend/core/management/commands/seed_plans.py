from django.core.management.base import BaseCommand
from core.models import Plan, Tenant

class Command(BaseCommand):
    help = 'Seeds plans and initial tenant'

    def handle(self, *args, **kwargs):
        # 1. Define Plans
        plans_data = {
            "LITE": ["devotees", "pooja", "bookings", "donations", "users"],
            "PRO": ["devotees", "pooja", "bookings", "donations", "hundi", "events", "annadhanam", "inventory", "finance", "users"],
            "PRO_MAX": ["devotees", "pooja", "bookings", "donations", "hundi", "events", "annadhanam", "inventory", "finance", "queues", "audit_logs", "notifications", "users"],
        }

        for tier, apps in plans_data.items():
            plan, created = Plan.objects.update_or_create(
                name=tier,
                defaults={"allowed_apps": apps}
            )
            if created:
                self.stdout.write(f"Created plan: {tier}")

        # 2. Create Initial Tenant (Shared)
        pro_max = Plan.objects.get(name="PRO_MAX")
        tenant, created = Tenant.objects.update_or_create(
            subdomain="temple1",
            defaults={
                "name": "Mahadeva Temple",
                "db_name": "tenant_temple1",
                "plan": pro_max
            }
        )
        if created:
            self.stdout.write(f"Created tenant: {tenant.name} on {pro_max.name} plan")
