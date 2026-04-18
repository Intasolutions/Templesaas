from core.models import Plan

plans_data = [
    {
        "name": "LITE",
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees'],
        "amount_inr": 1500
    },
    {
        "name": "PRO",
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees', 'shipments', 'queues', 'finance', 'integrations', 'staff', 'assets', 'panchangam'],
        "amount_inr": 2500
    },
    {
        "name": "MAX",
        "allowed_apps": ['pooja', 'bookings', 'hundi', 'inventory', 'donations', 'events', 'devotees', 'shipments', 'queues', 'finance', 'integrations', 'staff', 'assets', 'tv', 'analytics', 'panchangam'],
        "amount_inr": 3000
    }
]

for p in plans_data:
    plan, created = Plan.objects.get_or_create(name=p['name'])
    plan.allowed_apps = p['allowed_apps']
    plan.amount_inr = p.get('amount_inr', 0)
    plan.save()
    print(f"Verified Plan: {p['name']} (₹{plan.amount_inr})")

print("Update completed.")
