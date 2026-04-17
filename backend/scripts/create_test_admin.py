import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

username = 'antigravity_admin'
email = 'admin@example.com'
password = 'admin'

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser {username}...")
    try:
        User.objects.create_superuser(username, email, password)
        print("Superuser created successfully!")
    except Exception as e:
        print(f"Error: {e}")
else:
    print(f"Superuser {username} already exists.")
