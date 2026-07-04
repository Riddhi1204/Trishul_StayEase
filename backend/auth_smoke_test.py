"""Auth smoke tests"""
import urllib.request
import urllib.error
import json

BASE = 'http://localhost:8000'

def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(BASE+path, data=data,
          headers={'Content-Type':'application/json'}, method='POST')
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def get(path, token=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(BASE+path, headers=headers)
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

PASS = "[PASS]"
FAIL = "[FAIL]"

token = None

print("=== TEST 1: Register ===")
s, d = post('/auth/register', {
    'fullName': 'Test User',
    'email': 'test@trishul.dev',
    'phone': '+919876543210',
    'password': 'Test@1234',
    'confirmPassword': 'Test@1234',
    'role': 'guest'
})
print(f"Status: {s}")
if s == 201:
    token = d['access_token']
    user = d['user']
    print(f"{PASS} Token: {token[:30]}...")
    uid = user['id']
    fname = user['fullName']
    role = user['role']
    print(f"{PASS} User id={uid} name={fname} role={role}")
    if 'passwordHash' not in user:
        print(f"{PASS} passwordHash NOT in response")
    else:
        print(f"{FAIL} passwordHash LEAKED!")
else:
    print(f"{FAIL} Response: {d}")

print()
print("=== TEST 2: Login ===")
s2, d2 = post('/auth/login', {
    'email': 'test@trishul.dev',
    'password': 'Test@1234'
})
print(f"Status: {s2}")
if s2 == 200:
    token2 = d2['access_token']
    print(f"{PASS} Token: {token2[:30]}...")
    token = token2
else:
    print(f"{FAIL} Response: {d2}")

print()
print("=== TEST 3: GET /auth/me ===")
s3, d3 = get('/auth/me', token)
print(f"Status: {s3}")
if s3 == 200:
    eid = d3['id']
    eemail = d3['email']
    erole = d3['role']
    print(f"{PASS} id={eid} email={eemail} role={erole}")
else:
    print(f"{FAIL} Response: {d3}")

print()
print("=== TEST 4: Duplicate email ===")
s4, d4 = post('/auth/register', {
    'fullName': 'Test2',
    'email': 'test@trishul.dev',
    'phone': '+911234567890',
    'password': 'Test@1234',
    'confirmPassword': 'Test@1234',
    'role': 'guest'
})
expected = "409"
actual = str(s4)
marker = PASS if s4 == 409 else FAIL
print(f"{marker} Status: {s4} (expected 409) | detail: {d4.get('detail')}")

print()
print("=== TEST 5: Wrong password ===")
s5, d5 = post('/auth/login', {
    'email': 'test@trishul.dev',
    'password': 'wrongpass'
})
marker = PASS if s5 == 401 else FAIL
print(f"{marker} Status: {s5} (expected 401) | detail: {d5.get('detail')}")

print()
print("=== TEST 6: /auth/me without token ===")
s6, d6 = get('/auth/me')
marker = PASS if s6 in (401, 403) else FAIL
print(f"{marker} Status: {s6} (expected 401 or 403)")

print()
print("=== ALL AUTH SMOKE TESTS COMPLETE ===")
