
import re
import json
import os
import requests
from typing import Dict, Optional, List
from fastapi import HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from utils.prompt import PARSE_RESUME_PROMPT
# =====================
# Regex patterns
# =====================
EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_REGEX = re.compile(r"\+?\d[\d\s\-()]{7,}\d")

# =====================
# Prompt for LLM classification
# =====================


REQUIRED_KEYS = [
    "candidate_email",
    "candidate_first_name",
    "candidate_last_name",
    "primary_skills",
    "secondary_skills",
    "domain_expertise",
]

# =====================
# Helpers
# =====================
def extract_regex_fields(text: str) -> dict:
    """Extract deterministic fields like email, phone, name."""
    email = EMAIL_REGEX.search(text)
    phone = PHONE_REGEX.search(text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    name = {"candidate_first_name": None, "candidate_last_name": None}
    if lines:
        tokens = re.findall(r"[A-Za-z]+", lines[0])
        if tokens:
            name["candidate_first_name"] = tokens[0].title()
            if len(tokens) > 1:
                name["candidate_last_name"] = tokens[-1].title()
    return {
        "candidate_email": email.group(0) if email else None,
        "phone_number": phone.group(0) if phone else None,
        **name,
    }

def clean_resume_text(text: str) -> str:
    """Clean raw text for stable parsing."""
    text = re.sub(r"-\s*\n\s*", " ", text)  # join hyphenated words
    bullet_re = re.compile(r"^\s*[\u2022\u2023\u25E6\u2043\u2219\-\*\·\•\uF0B7\u2027\u25AA\u25CF\u00B7\u2219\25C6\u29BF\u204C\u204D]+\s+")
    lines = [bullet_re.sub("", l.strip()) for l in text.splitlines()]
    cleaned = "\n".join(l for l in lines if l)
    return re.sub(r"\n{2,}", "\n", cleaned).strip()

def chunk_text(s: str, size: int) -> List[str]:
    """Split large text into chunks of ~size chars."""
    acc, buf, total = [], [], 0
    for para in s.split("\n"):
        if total + len(para) + 1 > size and buf:
            acc.append("\n".join(buf))
            buf, total = [], 0
        buf.append(para)
        total += len(para) + 1
    if buf:
        acc.append("\n".join(buf))
    return acc

def dedup_list(items: List[str]) -> List[str]:
    """Deduplicate & normalize string lists."""
    seen, dedup = set(), []
    for item in items:
        if not isinstance(item, str):
            continue
        norm = re.sub(r"\s+", " ", item).strip()
        if norm and norm.lower() not in seen:
            seen.add(norm.lower())
            dedup.append(norm)
    return dedup

def safe_json_loads(raw_output: str) -> dict:
    """Ensure valid JSON parsing from LLM output."""
    text = str(raw_output).strip()
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    candidate = fenced.group(1) if fenced else re.search(r"\{[\s\S]*\}", text).group(0)
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate).replace("\\_", "_")
    return json.loads(candidate)

def call_llm(prompt_text: str, model: Optional[str] = None) -> dict:
    """Abstract API vs. local Ollama call."""
    model = model or os.getenv("RESUME_LLM_MODEL", "mistral:7b-instruct-q4_0")

    if os.getenv("API_URL") and os.getenv("API_KEY"):
        headers = {
            "Authorization": f"Bearer {os.getenv('API_KEY')}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "temperature": float(os.getenv("RESUME_TEMPERATURE", "0.0")),
            "top_p": float(os.getenv("RESUME_TOP_P", "1.0")),
            "seed": int(os.getenv("RESUME_SEED", "42")),
            "messages": [{"role": "user", "content": prompt_text}],
        }
        r = requests.post(os.getenv("API_URL"), headers=headers, json=payload, timeout=120)
        if r.status_code != 200:
            raise HTTPException(500, f"API failed {r.status_code}: {r.text}")
        return safe_json_loads(r.json()["choices"][0]["message"]["content"])
    else:
        llm = Ollama(
            model=model,
            temperature=float(os.getenv("RESUME_TEMPERATURE", "0.0")),
            model_kwargs={"num_ctx": int(os.getenv("RESUME_NUM_CTX", "8192"))},
        )
        return safe_json_loads(llm.invoke(prompt_text))

def ensure_schema(parsed: dict) -> dict:
    """Guarantee all keys exist."""
    return {k: parsed.get(k) or ([] if k.endswith("skills") or k == "domain_expertise" else None) for k in REQUIRED_KEYS}

# =====================
# Main parser
# =====================
def parse_resume(text: str) -> Dict:
    cleaned = clean_resume_text(text)
    max_chars = int(os.getenv("RESUME_MAX_CHARS", "12000"))
    if len(cleaned) > max_chars:
        cleaned = cleaned[:max_chars]

    regex_data = extract_regex_fields(cleaned)
    prompt = ChatPromptTemplate.from_template(PARSE_RESUME_PROMPT).format(text=cleaned)

    # Call LLM (chunk if needed)
    chunk_size = int(os.getenv("RESUME_CHUNK_SIZE", "4000"))
    if len(cleaned) > chunk_size:
        aggregated = {"primary_skills": [], "secondary_skills": [], "domain_expertise": []}
        name_email = {"candidate_email": None, "candidate_first_name": None, "candidate_last_name": None}
        for idx, chunk in enumerate(chunk_text(cleaned, chunk_size), 1):
            part_prompt = ChatPromptTemplate.from_template(PARSE_RESUME_PROMPT).format(text=chunk)
            parsed_chunk = call_llm(part_prompt)
            for k in aggregated: aggregated[k].extend(parsed_chunk.get(k, []))
            for k in name_email: 
                if not name_email[k] and parsed_chunk.get(k): 
                    name_email[k] = parsed_chunk[k]
        parsed = {**name_email, **{k: dedup_list(v) for k, v in aggregated.items()}}
    else:
        parsed = call_llm(prompt)

    # Merge regex fields
    for k, v in regex_data.items():
        if k in parsed and not parsed.get(k):
            parsed[k] = v

    normalized = ensure_schema(parsed)

    # Second pass for missing fields
    missing = [k for k, v in normalized.items() if v in (None, [], "")]
    if missing:
        fill_prompt = f"Return ONLY valid JSON with these fields: {', '.join(missing)}\nResume text:\n{cleaned}"
        fix = call_llm(fill_prompt, model=os.getenv("RESUME_FILL_MODEL", "llama3.1:8b-instruct"))
        for k in missing:
            if fix.get(k): normalized[k] = fix[k]

    return normalized
