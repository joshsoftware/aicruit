import os
import re
import json
import requests
import datetime
from typing import Dict, List, Optional, Any
from langchain_community.llms import Ollama
from utils.prompt import RESUME_PARSE_PROMPT
# This is a placeholder for your actual prompt file.
# The RESUME_PARSE_PROMPT variable is defined below for clarity.
# from utils.prompt import RESUME_PARSE_PROMPT

API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
DEFAULT_MODEL = os.getenv("LLM_MODEL")
TEMPERATURE = float(os.getenv("RESUME_TEMPERATURE", "0.0"))

REQUIRED_TOP_LEVEL = ["primary_skills", "secondary_skills", "domain_expertise", "relevant_experience", "education_certificates"]

def _safe_extract_json(text: str) -> Dict[str, Any]:
    text = str(text).strip()
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    candidate = fenced.group(1) if fenced else None
    if not candidate:
        m = re.search(r"\{[\s\S]*\}", text)
        if not m:
            raise ValueError("No JSON found in model response")
        candidate = m.group(0)
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate).replace("\\_", "_")
    return json.loads(candidate)

def _dedup_list(items: List[str]) -> List[str]:
    seen, out = set(), []
    for x in items or []:
        if not isinstance(x, str):
            continue
        v = re.sub(r"\s+", " ", x).strip()
        key = v.lower()
        if v and key not in seen:
            seen.add(key)
            out.append(v)
    return out

def _parse_date(date_str: str) -> Optional[datetime.date]:
    """Parses a date string and returns a datetime.date object."""
    if not date_str or date_str.strip() == "":
        return None
        
    date_str = date_str.strip().lower()
    
    # Use the current date to handle "present" or similar keywords
    current_month_year = datetime.datetime.now().strftime("%b %Y").lower()
    date_str = date_str.replace("present", current_month_year).replace("till date", current_month_year).replace("presently", current_month_year)
    
    # Add more date formats and better error handling
    fmts = [
        "%b %Y", "%Y-%m", "%Y", "%B %Y", "%m/%Y", "%m-%Y",
        "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%d %b %Y", "%d %B %Y",
        "%b %d, %Y", "%B %d, %Y", "%Y/%m/%d", "%Y/%m"
    ]
    
    for fmt in fmts:
        try:
            return datetime.datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    
    # If no format works, try to extract just the year
    year_match = re.search(r'\b(19|20)\d{2}\b', date_str)
    if year_match:
        try:
            year = int(year_match.group())
            return datetime.date(year, 1, 1)  # Use January 1st as default
        except ValueError:
            pass
    
    print(f"Could not parse date: '{date_str}'")
    return None

def _calculate_years(start_date_str: str, end_date_str: str) -> Optional[float]:
    """Calculates the duration in years between two date strings."""
    try:
        start_date = _parse_date(start_date_str)
        end_date = _parse_date(end_date_str)
        
        if start_date and end_date:
            delta = end_date - start_date
            # Using 365.25 to account for leap years
            years = round(delta.days / 365.25, 2)
            print(f"Calculated years: {start_date} to {end_date} = {years} years")
            return years
        else:
            print(f"Date parsing failed - start: '{start_date_str}' -> {start_date}, end: '{end_date_str}' -> {end_date}")
            return None
    except Exception as e:
        print(f"Error calculating years: {e}")
        return None

def _ensure_schema(parsed: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures the parsed data adheres to the expected schema."""
    rv = {
        "primary_skills": _dedup_list(parsed.get("primary_skills") or []),
        "secondary_skills": _dedup_list(parsed.get("secondary_skills") or []),
        "domain_expertise": _dedup_list(parsed.get("domain_expertise") or []),
        "relevant_experience": parsed.get("relevant_experience") or {},
        "education_certificates": parsed.get("education_certificates") or [],
    }

    # Normalize relevant_experience
    rexp = rv["relevant_experience"] if isinstance(rv["relevant_experience"], dict) else {}
    roles = rexp.get("roles") if isinstance(rexp.get("roles"), list) else []
    norm_roles = []
    
    total_years = 0
    print(f"Processing {len(roles)} roles for experience calculation...")
    
    for i, r in enumerate(roles):
        if not isinstance(r, dict):
            continue
        
        print(f"Role {i+1}: {r.get('title')} at {r.get('company')}")
        print(f"  Start: '{r.get('start_date')}', End: '{r.get('end_date')}'")
        
        years = _calculate_years(r.get("start_date"), r.get("end_date"))
        if years:
            total_years += years
            print(f"  Calculated years: {years}")
        else:
            print(f"  Could not calculate years")
        
        norm_roles.append({
            "title": r.get("title"),
            "company": r.get("company"),
            "start_date": r.get("start_date"),
            "end_date": r.get("end_date"),
            "years": years,
            "highlights": [h for h in (r.get("highlights") or []) if isinstance(h, str)],
        })
    
    rv["relevant_experience"] = {
        "total_years": round(total_years, 2) if total_years > 0 else None,
        "roles": norm_roles,
    }
    
    print(f"Total calculated experience: {rv['relevant_experience']['total_years']} years")
    
    # Normalize education_certificates
    edu = []
    for e in rv["education_certificates"]:
        if not isinstance(e, dict):
            continue
        t = e.get("type")
        # Heuristics for type: check for 'degree', 'bachelor', 'master' in name
        if not t or t not in ("degree", "certification"):
            name_lower = str(e.get("name", "")).lower()
            if "bachelor" in name_lower or "b.com" in name_lower or "m.com" in name_lower or "degree" in name_lower or "diploma" in name_lower:
                t = "degree"
            else:
                t = "certification"

        edu.append({
            "name": e.get("name"),
            "issuer": e.get("issuer"),
            "year": e.get("year"),
            "type": t,
        })
    rv["education_certificates"] = edu
    return rv

def _call_model(prompt_text: str, model: Optional[str] = None) -> str:
    """Calls the specified LLM model with the given prompt."""
    model = model or DEFAULT_MODEL
    if API_URL and API_KEY:
        headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": model,
            "temperature": TEMPERATURE,
            "messages": [{"role": "user", "content": prompt_text}],
        }
        r = requests.post(API_URL, headers=headers, json=payload)
        if r.status_code != 200:
            raise RuntimeError(f"API failed {r.status_code}: {r.text}")
        return r.json()["choices"][0]["message"]["content"]
    # Local Ollama
    llm = Ollama(model=model, temperature=TEMPERATURE, model_kwargs={"num_ctx": int(os.getenv("RESUME_NUM_CTX", "8192"))})
    return llm.invoke(prompt_text)

def parse_resume_skills_experience_education(resume_text: str) -> Dict[str, Any]:
    """Parses a resume using an LLM and returns structured data."""
    prompt = RESUME_PARSE_PROMPT.format(resume_text=resume_text)
    raw = _call_model(prompt)
    parsed = _safe_extract_json(raw)
    normalized = _ensure_schema(parsed)
    
    qualifications = []
    certifications = []
    
    for edu in normalized.get("education_certificates", []):
        if edu.get("type") == "degree":
            qualifications.append(edu)
        elif edu.get("type") == "certification":
            certifications.append(edu)

    return {
        "primary_skills": normalized.get("primary_skills"),
        "secondary_skills": normalized.get("secondary_skills"),
        "domain_expertise": normalized.get("domain_expertise"),
        "years_of_experience": normalized.get("relevant_experience", {}).get("total_years"),
        "qualifications": qualifications,
        "certifications": certifications,
    }


