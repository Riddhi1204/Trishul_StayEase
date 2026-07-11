import urllib.request
import urllib.error

req = urllib.request.Request(
    "https://trishul-stayease.onrender.com/auth/register",
    method="OPTIONS",
    headers={
        "Origin": "https://trishul-stay-ease.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }
)

try:
    r = urllib.request.urlopen(req)
    print(r.status)
    print(r.headers)
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.headers)
except Exception as e:
    print("Exception:", e)
