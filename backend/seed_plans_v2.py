from core.models import Plan

plans_data = [
    {
        "name": Plan.LITE,
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees']
    },
    {
        "name": Plan.PRO,
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees', 'shipments', 'queues', 'finance', 'integrations', 'staff', 'assets']
    },
    {
        "name": Plan.PRO_MAX,
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees', 'shipments', 'queues', 'finance', 'integrations', 'staff', 'assets', 'tv', 'analytics']
    }
]

for p in plans_data:
    plan, created = Plan.objects.get_or_create(name=p['name'])
    plan.allowed_apps = p['allowed_apps']
    plan.save()
    print(f"Verified Plan: {p['name']}")

print("Update completed.")
