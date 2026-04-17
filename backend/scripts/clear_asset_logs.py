import os
import sys
import django

# Add the project root to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from assets.models import MaintenanceLog

def clear_logs():
    count = MaintenanceLog.objects.all().count()
    MaintenanceLog.objects.all().delete()
    print(f"Successfully deleted {count} maintenance records.")

if __name__ == "__main__":
    clear_logs()
