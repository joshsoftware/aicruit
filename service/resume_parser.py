import os
import json
import re
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
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
    "candidate_email": "candidate_email",
    "candidate_first_name": "candidate_first_name",
    "candidate_last_name": "candidate_last_name",
    "primary_skills": "primary_skills",
    "secondary_skills": "secondary_skills",
    "domain_expertise": "domain_expertise"
}


def parse_resume(text: str) -> dict:
    print("**********************")
    prompt = ChatPromptTemplate.from_template(PARSE_RESUME_PROMPT)
    user_prompt = prompt.format(text=text)

    # =====================
    # Case 1: Remote API
    # =====================
    if API_URL and API_KEY:
        print("⚡ Using remote AI API for resume parsing")

        payload = {
            "model": "mistral:7b-instruct-q4_0",
            "messages": [{"role": "user", "content": user_prompt}]
        }
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"API call failed {response.status_code}: {response.text}"
            )

        try:
            response_json = response.json()
            raw_output = response_json["choices"][0]["message"]["content"]
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Bad response format: {str(e)} | {response.text}"
            )

    # =====================
    # Case 2: Local Ollama
    # =====================
    else:
        print("⚡ Using local Ollama model for resume parsing")
        llm = Ollama(model="mistral:7b-instruct-q4_0")
        raw_output = llm.invoke(user_prompt)

    # =====================
    # Extract JSON block
    # =====================
    match = re.search(r"\{.*\}", raw_output, re.DOTALL)
    if not match:
        raise HTTPException(
            status_code=500,
            detail=f"LLM did not return JSON: {raw_output}"
        )
    
    json_str = match.group(0)

    # =====================
    # Parse JSON safely
    # =====================
    try:
        parsed = json.loads(json_str)
        print(parsed)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"JSON decode failed: {e} | Output: {raw_output}"
        )

    # =====================
    # Ensure keys exist
    # =====================
    final = {k: parsed.get(k, [] if "skills" in k else "") for k in EXPECTED_KEYS}
    return final
