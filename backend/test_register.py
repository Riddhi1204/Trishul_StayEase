import urllib.request
import urllib.error
import json

data = json.dumps({
    "fullName": "Ananya Joshi",
    "email": "you@example.com",
    "phone": "+919876543210",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "role": "guest"
}).encode('utf-8')

req = urllib.request.Request("https://trishul-stayease.onrender.com/auth/register", data=data,
      headers={'Content-Type':'application/json'}, method='POST')

try:
    r = urllib.request.urlopen(req)
    print(r.status, r.read().decode())
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode())
except Exception as e:
    print("Exception:", e)
