import json
from fuzzywuzzy import process
from langchain_core.prompts import ChatPromptTemplate
from langchain.llms import Ollama
from typing import Dict

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
llm = Ollama(model="llama3")
automatic_prompt = ChatPromptTemplate.from_template(
    """You are an expert job description parser. Parse this JD systematically.

{jd_text}

Return ONLY a JSON object in this format:
{{
  "title": null,
  "company": null,
  "company_description": null,
  "experience_required": {{
    "min_years": null,
    "max_years": null
  }},
  "skills": {{
    "must_have": ["skill1", "skill2"],
    "good_to_have": ["skill1", "skill2"]
  }},
  "qualifications": ["degree1", "degree2"],
  "responsibilities": ["resp1", "resp2"],
  "location": null,
  "employment_type": "Full-time"
}}
"""
)

# =========================
# Public Function
# =========================
def parse_jd_with_ai(jd_text: str) -> Dict:
    """Send JD text to AI model and return structured JSON."""
    response = llm.invoke(automatic_prompt.format(jd_text=jd_text))
    response_text = str(response)

    json_start = response_text.find('{')
    json_end = response_text.rfind('}') + 1
    if json_start == -1 or json_end == -1:
        return {"error": "No JSON found in AI response"}

    try:
        raw_json = json.loads(response_text[json_start:json_end])
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response as JSON"}

    return map_keys_semantically(raw_json)
