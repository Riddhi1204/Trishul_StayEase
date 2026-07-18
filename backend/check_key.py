import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def list_models():
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    print("Available models:")
    for m in client.models.list():
        if 'flash' in m.name:
            print(m.name)

if __name__ == "__main__":
    list_models()
