import os
import json
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.llms import Ollama
from langchain.prompts import ChatPromptTemplate
from utils.prompt import PARSE_RESUME_PROMPT

# =====================
# Import our S3 utilities
# =====================
# from parse_s3_url import get_text_from_s3_file  # your helper module

app = FastAPI()

# Switch model here (mistral is faster than llama3)
llm = Ollama(model="mistral:7b-instruct-q4_0")  

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

    chain = prompt | llm
    raw_output = chain.invoke({"text": text})

    # 1. Extract JSON block if model wraps it with extra text
    match = re.search(r"\{.*\}", raw_output, re.DOTALL)
    if not match:
        raise HTTPException(status_code=500, detail=f"LLM did not return JSON: {raw_output}")
    
    json_str = match.group(0)

    # 2. Parse JSON safely
    try:
        parsed = json.loads(json_str)
        print(parsed)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON decode failed: {e} | Output: {raw_output}")

    # 3. Ensure keys exist
    final = {k: parsed.get(k, [] if "skills" in k else "") for k in EXPECTED_KEYS}
    return final