import json
import re
from fuzzywuzzy import process
from langchain_core.prompts import ChatPromptTemplate
from langchain.llms import Ollama
from typing import Dict
from utils.prompt import PARSE_NEWJD_PROMPT
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
llm = Ollama(model="mistral:7b-instruct-q4_0")
automatic_prompt = ChatPromptTemplate.from_template(PARSE_NEWJD_PROMPT)

# =========================
# Public Function
# =========================
def parse_jd_with_ai(jd_text: str) -> Dict:
    """Send JD text to AI model and return structured JSON. Robust JSON extraction and cleanup."""
    response = llm.invoke(automatic_prompt.format(jd_text=jd_text))
    response_text = str(response).strip()
    try:
        preview = response_text[:2000]
        print(f"JD AI raw response length={len(response_text)}", flush=True)
        print(f"JD AI raw response preview={preview}", flush=True)
    except Exception:
        pass

    # Prefer fenced JSON first
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", response_text)
    if fenced:
        candidate = fenced.group(1)
    else:
        # Fallback to the largest braces block
        match = re.search(r"\{[\s\S]*\}", response_text)
        if not match:
            return {"error": "No JSON found in AI response"}
        candidate = match.group(0)

    # Cleanup common issues
    candidate = candidate.replace("\\_", "_")  # unescape underscores
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)  # remove trailing commas

    try:
        raw_json = json.loads(candidate)
    except json.JSONDecodeError:
        print("JD AI JSON decode failed after cleanup", candidate[:500], flush=True)
        return {"error": "Failed to parse AI response as JSON"}

    return map_keys_semantically(raw_json)
