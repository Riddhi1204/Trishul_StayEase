"""Property Security Smoke Tests"""
import urllib.request
import urllib.error
import json

BASE = 'http://localhost:8000'
PASS = "[PASS]"
FAIL = "[FAIL]"

def request(path, method='GET', body=None, token=None):
    headers = {}
    if body:
        headers['Content-Type'] = 'application/json'
    if token:
        headers['Authorization'] = f'Bearer {token}'
        
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(BASE+path, data=data, headers=headers, method=method)
    
    try:
        r = urllib.request.urlopen(req)
        body = r.read()
        return r.status, json.loads(body) if body else None
    except urllib.error.HTTPError as e:
        body = e.read()
        return e.code, json.loads(body) if body else None

def test():
    # 1. Register Guest
    print("--- Setup Accounts ---")
    s, guest = request('/auth/register', 'POST', {
        'fullName': 'Guest User', 'email': 'guest_test@trishul.dev',
        'phone': '+911000000000', 'password': 'Test@1234',
        'confirmPassword': 'Test@1234', 'role': 'guest'
    })
    if s == 409:
        s, guest = request('/auth/login', 'POST', {'email': 'guest_test@trishul.dev', 'password': 'Test@1234'})
    guest_token = guest['access_token']
    
    # 2. Register Host 1
    s, host1 = request('/auth/register', 'POST', {
        'fullName': 'Host One', 'email': 'host1@trishul.dev',
        'phone': '+912000000000', 'password': 'Test@1234',
        'confirmPassword': 'Test@1234', 'role': 'host'
    })
    if s == 409:
        s, host1 = request('/auth/login', 'POST', {'email': 'host1@trishul.dev', 'password': 'Test@1234'})
    h1_token = host1['access_token']

    # 3. Register Host 2
    s, host2 = request('/auth/register', 'POST', {
        'fullName': 'Host Two', 'email': 'host2@trishul.dev',
        'phone': '+913000000000', 'password': 'Test@1234',
        'confirmPassword': 'Test@1234', 'role': 'host'
    })
    if s == 409:
        s, host2 = request('/auth/login', 'POST', {'email': 'host2@trishul.dev', 'password': 'Test@1234'})
    h2_token = host2['access_token']

    # TEST: Guest creates property (Should Fail)
    print("\n--- Test 1: Guest Property Creation ---")
    s, r = request('/api/properties', 'POST', {
        "title": "Guest House", "location": "Delhi", "price": 1000, "type": "urban", "status": "available"
    }, guest_token)
    print(f"{PASS if s == 403 else FAIL} Guest creation blocked (status: {s})")

    # TEST: Host 1 creates property (Should Succeed)
    print("\n--- Test 2: Host Property Creation ---")
    s, prop1 = request('/api/properties', 'POST', {
        "title": "Host 1 Villa", "location": "Goa", "price": 5000, "type": "villa", "status": "available"
    }, h1_token)
    print(f"{PASS if s == 201 else FAIL} Host 1 creation succeeded (status: {s})")
    prop1_id = prop1['id']
    print(f"Property ID: {prop1_id}, Owner: {prop1['host_id']}")

    # TEST: Host 2 tries to edit Host 1's property (Should Fail)
    print("\n--- Test 3: Edit Cross-Ownership ---")
    s, r = request(f'/api/properties/{prop1_id}', 'PUT', {"title": "Hacked"}, h2_token)
    print(f"{PASS if s == 403 else FAIL} Host 2 edit blocked (status: {s})")

    # TEST: Host 1 edits own property (Should Succeed)
    print("\n--- Test 4: Edit Own Property ---")
    s, r = request(f'/api/properties/{prop1_id}', 'PUT', {"title": "Host 1 Villa Updated"}, h1_token)
    print(f"{PASS if s == 200 else FAIL} Host 1 edit succeeded (status: {s})")

    # TEST: Host 2 tries to delete Host 1's property (Should Fail)
    print("\n--- Test 5: Delete Cross-Ownership ---")
    s, r = request(f'/api/properties/{prop1_id}', 'DELETE', None, h2_token)
    print(f"{PASS if s == 403 else FAIL} Host 2 delete blocked (status: {s})")

    # TEST: Host 1 deletes own property (Should Succeed)
    print("\n--- Test 6: Delete Own Property ---")
    s, r = request(f'/api/properties/{prop1_id}', 'DELETE', None, h1_token)
    print(f"{PASS if s == 204 else FAIL} Host 1 delete succeeded (status: {s})")

if __name__ == '__main__':
    test()
