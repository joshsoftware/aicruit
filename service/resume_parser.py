import os
import json
import re
import requests
from fastapi import FastAPI, HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain.llms import Ollama   # ✅ for local fallback
from utils.prompt import PARSE_RESUME_PROMPT

app = FastAPI()

# =====================
# API Config
# =====================
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

EXPECTED_KEYS = {
    "candidate_email": None,
    "candidate_first_name": None,
    "candidate_last_name": None,
    "primary_skills": [],
    "secondary_skills": [],
    "domain_expertise": []
}

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def sanitize_parsed_data(parsed: dict, resume_text: str) -> dict:
    """Ensure required keys exist and validate email against resume text."""
    final = {k: parsed.get(k, v) for k, v in EXPECTED_KEYS.items()}

    email = final.get("candidate_email")
    if not (
        email
        and isinstance(email, str)
        and EMAIL_REGEX.match(email.strip())
        and re.search(re.escape(email), resume_text, flags=re.IGNORECASE)
    ):
        final["candidate_email"] = None  # enforce null if invalid or fabricated

    return final


def parse_resume(text: str) -> dict:
    print("**********************")

    # Build user prompt
    prompt = ChatPromptTemplate.from_template(PARSE_RESUME_PROMPT)
    user_prompt = prompt.format(text=text)

    # =====================
    # Call AI model (remote preferred, fallback local)
    # =====================
    raw_output = None
    if API_URL and API_KEY:
        print("⚡ Using remote AI API for resume parsing")
        payload = {
            "model": "mistral:7b-instruct-q4_0",
            "messages": [{"role": "user", "content": user_prompt}]
        }
        headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
        response = requests.post(API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            raise HTTPException(500, f"API call failed {response.status_code}: {response.text}")

        try:
            raw_output = response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            raise HTTPException(500, f"Bad response format: {str(e)} | {response.text}")
    else:
        print("⚡ Using local Ollama model for resume parsing")
        llm = Ollama(model="mistral:7b-instruct-q4_0")
        raw_output = llm.invoke(user_prompt)

    # =====================
    # Extract JSON from output
    # =====================
    match = re.search(r"\{.*\}", raw_output, re.DOTALL)
    if not match:
        raise HTTPException(500, f"LLM did not return JSON: {raw_output}")

    json_str = match.group(0).replace("\\_", "_")  # clean invalid escapes

    # =====================
    # Parse JSON safely
    # =====================
    try:
        parsed = json.loads(json_str)
        print("Parsed raw:", parsed)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"JSON decode failed: {e} | Output: {raw_output}")

    # =====================
    # Validate + fill defaults
    # =====================
    return sanitize_parsed_data(parsed, text)
