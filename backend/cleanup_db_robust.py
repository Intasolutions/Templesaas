
import os
import django
from django.apps import apps
from django.db import transaction

def cleanup():
    print("Starting comprehensive cleanup...")
    
    # Models to EXCLUDE from deletion
    exclude_models = [
        'Plan', 
        'Permission', 
        'Group', 
        'ContentType', 
        'LogEntry', 
        'Session',
        'Site'
    ]
    
    with transaction.atomic():
        # Iterate through all models and delete records
        # We delete in reverse order of dependencies if possible, 
        # or just disable foreign key checks if we were on Postgres/MySQL.
        # On SQLite, we just need to delete things that reference others first.
        
        # A simpler way: just try to delete everything in a loop until nothing is left
        # or use a specific order.
        
        all_models = [m for m in apps.get_models() if m.__name__ not in exclude_models]
        
        # We can't easily determine order, so we'll try to delete multiple times
        # to handle dependencies.
        for _ in range(3):
            for model in all_models:
                try:
                    count = model.objects.all().count()
                    if count > 0:
                        model.objects.all().delete()
                        print(f"Deleted {count} records from {model.__name__}")
                except Exception:
                    # Likely a ProtectedError, skip for now and catch in next pass
                    pass

    print("Comprehensive cleanup complete.")

cleanup()
