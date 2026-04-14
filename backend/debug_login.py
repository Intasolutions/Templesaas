import requests
import json

url = "http://localhost:8000/api/users/login/"
data = {
    "username": "vijay",
    "password": "vijay"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(response.text[:1000])
except Exception as e:
    print(f"Request failed: {e}")
