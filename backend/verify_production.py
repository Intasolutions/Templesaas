import requests
import json

BASE_URL = "http://localhost:8000/api"
CREDS = {"username": "vijay", "password": "vijay"}

try:
    login_res = requests.post(f"{BASE_URL}/users/login/", json=CREDS)
    data = login_res.json()
    token = data.get("token")
    tenant_code = data.get("tenant", {}).get("subdomain")

    headers = {
        "Authorization": f"Token {token}",
        "X-Tenant-Code": tenant_code
    }

    print(f"Logged in. Tenant Code: {tenant_code}")

    stats_res = requests.get(f"{BASE_URL}/reports/stats/", headers=headers)
    print(f"Stats Status: {stats_res.status_code}")
    if stats_res.status_code != 200:
        print("Crash detected!")
        print(stats_res.text[:2000]) # Print the start of the error page
    else:
        print(f"Stats Data: {json.dumps(stats_res.json(), indent=2)}")

except Exception as e:
    print(f"Script failed: {e}")
