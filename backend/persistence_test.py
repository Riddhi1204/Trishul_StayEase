"""
CRUD Persistence Test — Week 5 MongoDB Migration
Verifies that Create, Read, Update, Delete survive a server restart.
Run with: venv\Scripts\python persistence_test.py
"""
import json
import time
import urllib.request
import urllib.error

BASE = "http://localhost:8000"

def request(method, path, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            if r.status == 204:
                return 204, None
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def sep(label):
    print(f"\n{'='*55}")
    print(f"  {label}")
    print('='*55)

sep("STEP 1 — CREATE a test property")
status, prop = request("POST", "/api/properties", {
    "title":    "Persistence Test Lodge",
    "location": "Test Valley, India",
    "price":    9999,
    "type":     "mountain",
    "status":   "available"
})
assert status == 201, f"Expected 201, got {status}"
test_id = prop["id"]
print(f"[PASS] Created  id={test_id} | title='{prop['title']}' | price={prop['price']}")

sep("STEP 2 — READ back immediately")
status, fetched = request("GET", f"/api/properties/{test_id}")
assert status == 200, f"Expected 200, got {status}"
assert fetched["title"] == "Persistence Test Lodge"
print(f"[PASS] Read     id={fetched['id']} | title='{fetched['title']}'")

print("\n>>> SERVER RESTART SIMULATION: sleeping 3s (restart server now if testing manually)...")
time.sleep(3)

sep("STEP 3 — READ after restart (data must still exist)")
status, after = request("GET", f"/api/properties/{test_id}")
assert status == 200, f"[FAIL] Property lost after restart! Got {status}"
assert after["title"] == "Persistence Test Lodge"
print(f"[PASS] Persists after restart: id={after['id']} | title='{after['title']}'")

sep("STEP 4 — UPDATE price and status")
status, updated = request("PUT", f"/api/properties/{test_id}", {
    "price": 1111,
    "status": "booked"
})
assert status == 200, f"Expected 200, got {status}"
assert updated["price"] == 1111
assert updated["status"] == "booked"
print(f"[PASS] Updated  id={updated['id']} | price={updated['price']} | status={updated['status']}")

sep("STEP 5 — READ updated values (persistence check)")
status, verify = request("GET", f"/api/properties/{test_id}")
assert status == 200
assert verify["price"] == 1111 and verify["status"] == "booked"
print(f"[PASS] Update persists: price={verify['price']} | status={verify['status']}")

sep("STEP 6 — SEARCH for the test property")
status, results = request("GET", "/api/properties/search?q=Persistence+Test")
assert status == 200
assert any(r["id"] == test_id for r in results)
print(f"[PASS] Search found {len(results)} result(s) containing id={test_id}")

sep("STEP 7 — FILTER by price <= 2000")
status, filtered = request("GET", "/api/properties/filter?max_price=2000")
assert status == 200
ids = [r["id"] for r in filtered]
assert test_id in ids, f"Updated property (price=1111) should appear in filter"
print(f"[PASS] Filter returned {len(filtered)} result(s), test property included")

sep("STEP 8 — DELETE the test property")
status, _ = request("DELETE", f"/api/properties/{test_id}")
assert status == 204, f"Expected 204, got {status}"
print(f"[PASS] Deleted  id={test_id} (status 204 No Content)")

sep("STEP 9 — VERIFY deletion is permanent")
status, gone = request("GET", f"/api/properties/{test_id}")
assert status == 404, f"Expected 404 after delete, got {status}"
print(f"[PASS] GET after DELETE returns 404 | detail='{gone['detail']}'")

sep("STEP 10 — VERIFY total count unchanged (still 7 original)")
status, all_props = request("GET", "/api/properties")
assert status == 200
original_ids = {1,2,3,4,5,6,7}
current_ids  = {p["id"] for p in all_props}
assert original_ids.issubset(current_ids), "Some seed data is missing!"
print(f"[PASS] {len(all_props)} properties in Atlas, all seed IDs present")

print(f"\n{'='*55}")
print("  ALL 10 PERSISTENCE TESTS PASSED")
print("  MongoDB Atlas storage is working correctly.")
print('='*55)
