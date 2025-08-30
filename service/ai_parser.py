import json
import os
import re
import requests
from typing import Dict
from fuzzywuzzy import process
from langchain_core.prompts import ChatPromptTemplate
from langchain.llms import Ollama   # ✅ for local model
from utils.prompt import PARSE_NEWJD_PROMPT

DEFAULT_MODEL = os.getenv("LLM_MODEL")

# =========================
# Key Mapping Logic
# =========================
EXPECTED_KEYS = {
    "title": "title",
    "company": "company",
    "company_description": "company_description",
    "experience_required": "experience_required",
    "skills": "skills",
    "qualifications": "qualifications",
    "responsibilities": "responsibilities",
    "location": "location",
    "employment_type": "employment_type",
}

def map_keys_semantically(parsed_json: Dict) -> Dict:
    """Map parsed JSON keys to expected schema using fuzzy matching."""
    mapped = {}
    for expected_key in EXPECTED_KEYS:
        if expected_key in parsed_json:
            mapped[expected_key] = parsed_json[expected_key]
            continue

        best_match, score = process.extractOne(expected_key, parsed_json.keys())
        if score >= 80:
            mapped[expected_key] = parsed_json[best_match]
        else:
            if expected_key == "skills":
                mapped[expected_key] = {"must_have": [], "good_to_have": []}
            elif expected_key == "experience_required":
                mapped[expected_key] = {"min_years": None, "max_years": None}
            elif expected_key in ["qualifications", "responsibilities"]:
                mapped[expected_key] = []
            else:
                mapped[expected_key] = None
    return mapped


# =========================
# AI Model Config
# =========================
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

PARSE_NEWJD_PROMPT = ChatPromptTemplate.from_template(
    PARSE_NEWJD_PROMPT
)


# =========================
# Public Function
# =========================
def parse_jd_with_ai(jd_text: str) -> Dict:
    """Send JD text to remote AI API if available, else use local Ollama."""

    if API_URL and API_KEY:  
        # --------------------
        # Remote API Mode
        # --------------------
        print("⚡ Using remote AI API")
        payload = {
            "model": DEFAULT_MODEL,
            "messages": [
                {"role": "user", "content": PARSE_NEWJD_PROMPT.format(jd_text=jd_text)}
            ]
        }

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code != 200:
            return {"error": f"API call failed {response.status_code}: {response.text}"}

        try:
            response_json = response.json()
            response_text = response_json["choices"][0]["message"]["content"].strip()
        except Exception as e:
            return {"error": f"Bad response format: {str(e)}"}

    else:
        # --------------------
        # Local Ollama Mode
        # --------------------
        print("⚡ Using local Ollama model")
        llm = Ollama(model=DEFAULT_MODEL)
        response_text = llm.invoke(
            PARSE_NEWJD_PROMPT.format(jd_text=jd_text)
        )

    # ========================
    # Extract JSON from response
    # ========================
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", response_text)
    if fenced:
        candidate = fenced.group(1)
    else:
        match = re.search(r"\{[\s\S]*\}", response_text)
        if not match:
            return {"error": "No JSON found in AI response"}
        candidate = match.group(0)

    # Cleanup common issues
    candidate = candidate.replace("\\_", "_")
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)

    try:
        raw_json = json.loads(candidate)
    except json.JSONDecodeError:
        print("JD AI JSON decode failed after cleanup", candidate[:500], flush=True)
        return {"error": "Failed to parse AI response as JSON"}

    return map_keys_semantically(raw_json)
