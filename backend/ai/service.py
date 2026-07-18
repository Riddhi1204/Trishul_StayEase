import os
import json
import time
import asyncio
from typing import Dict, Any, Tuple
from google import genai
from google.genai import types

from ai.prompts import SYSTEM_INSTRUCTION, build_user_prompt

# Simple TTL Cache to avoid repeated identical API calls
# Maps request signature to (timestamp, response_dict)
_cache: Dict[str, Tuple[float, dict]] = {}
CACHE_TTL_SECONDS = 3600  # 1 hour

def _get_cache_key(data: dict) -> str:
    """Create a deterministic cache key from input data."""
    return f"{data.get('destination')}_{data.get('days')}_{data.get('budget')}_{data.get('travel_style')}_{data.get('guests')}_{data.get('special_requests','')}".lower().strip()

async def generate_travel_plan(data: dict) -> dict:
    """
    Calls Gemini API to generate a travel plan.
    Implements caching, robust JSON parsing, and fallback error handling.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured on the server.")

    cache_key = _get_cache_key(data)
    if cache_key in _cache:
        timestamp, cached_result = _cache[cache_key]
        if time.time() - timestamp < CACHE_TTL_SECONDS:
            return cached_result

    client = genai.Client(api_key=api_key)
    user_prompt = build_user_prompt(data)

    try:
        # Offload the blocking Gemini API call to a thread
        loop = asyncio.get_running_loop()
        
        def _call_gemini():
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )

        response = await loop.run_in_executor(None, _call_gemini)
        
        if not response.text:
            raise ValueError("Received empty response from Gemini API.")

        # Clean JSON if wrapped in markdown (though response_mime_type should prevent this)
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text.removeprefix("```json").removesuffix("```").strip()
            
        parsed_json = json.loads(raw_text)
        
        # Save to cache
        _cache[cache_key] = (time.time(), parsed_json)
        return parsed_json

    except json.JSONDecodeError as e:
        raise ValueError(f"AI response was not valid JSON. Detail: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Gemini API Error: {str(e)}")
