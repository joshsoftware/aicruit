
import os
import json
import time
import jsonschema
import requests
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from utils.prompt import RESUME_JD_PROMPT_TEMPLATE
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
DEFAULT_MODEL = os.getenv("LLM_MODEL")
# -------------------- JSON SCHEMA --------------------
SCHEMA = {
    "type": "object",
    "properties": {
        "match_score": {"type": "integer"},
        "reasoning": {"type": "array", "items": {"type": "string"}},
        "matched_skills": {
            "type": "object",
            "properties": {
                "must_have": {"type": "array", "items": {"type": "string"}},
                "good_to_have": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["must_have", "good_to_have"]
        },
        "missing_skills": {
            "type": "object",
            "properties": {
                "must_have": {"type": "array", "items": {"type": "string"}},
                "good_to_have": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["must_have", "good_to_have"]
        },
        "qualification_match": {"type": "boolean"},
        "experience_match": {"type": "boolean"}
    },
    "required": [
        "match_score", "reasoning",
        "matched_skills", "missing_skills",
        "qualification_match", "experience_match"
    ]
}


# -------------------- MATCHING FUNCTION --------------------
def match_resume_to_jd(resume: dict, jd_id: int, max_retries: int = 3) -> dict:
    """
    Match resume with JD using either remote API or local Ollama.
    JD is fetched from DB using jd_id.
    """

    # 1. Fetch JD data from DB
    jd = fetch_jd_from_db(jd_id)
    if not jd:
        raise ValueError(f"No JD found for id={jd_id}")

    prompt = ChatPromptTemplate.from_template(RESUME_JD_PROMPT_TEMPLATE)

    for attempt in range(1, max_retries + 1):
        try:
            if API_URL and API_KEY:
                # Remote API mode
                print("⚡ Using remote AI API for matching")
                payload = {
                    "model": DEFAULT_MODEL,
                    "messages": [
                        {"role": "user", "content": prompt.format(
                            resume_json=json.dumps(resume, ensure_ascii=False),
                            jd_json=json.dumps(jd, ensure_ascii=False)
                        )}
                    ],
                    "temperature": 0.0
                }
                headers = {
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                }
                response = requests.post(API_URL, headers=headers, json=payload)
                if response.status_code != 200:
                    raise RuntimeError(f"API call failed {response.status_code}: {response.text}")
                content = response.json()["choices"][0]["message"]["content"]
            else:
                # Local Ollama mode
                print("⚡ Using local Ollama model for matching")
                llm = Ollama(model=DEFAULT_MODEL, temperature=0.0)
                chain = prompt | llm
                content = chain.invoke({
                    "resume_json": json.dumps(resume, ensure_ascii=False),
                    "jd_json": json.dumps(jd, ensure_ascii=False)
                })

            parsed = json.loads(content)
            jsonschema.validate(instance=parsed, schema=SCHEMA)
            return parsed

        except Exception as e:
            print(f"[Attempt {attempt}] Invalid JSON or error, retrying... Error: {e}")
            time.sleep(1)

    raise ValueError(f"LLM failed to return valid JSON after {max_retries} attempts.")


# -------------------- DB HELPER --------------------
def fetch_jd_from_db(jd_id: int) -> dict:
    """Fetch parsed JD JSON from DB using jd_id"""
    try:
        # Get database connection details from environment variables
        dbname = os.getenv("DATABASE_NAME")
        user = os.getenv("DATABASE_USERNAME")
        password = os.getenv("DATABASE_PASSWORD")
        host = os.getenv("DATABASE_HOST")
        port = os.getenv("DATABASE_PORT")
        
        # Debug: Print all environment variables
        print(f"Environment variables:")
        print(f"DATABASE_NAME: {dbname}")
        print(f"DATABASE_USER: {user}")
        print(f"DATABASE_HOST: {host}")
        print(f"DATABASE_PORT: {port}")
        print(f"DATABASE_PASSWORD: {'***' if password else 'None'}")
        
        # Check if any required env vars are missing
        if not all([dbname, user, password, host, port]):
            print("Missing required database environment variables!")
            return None
            
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )

        with conn.cursor() as cur:
            cur.execute("SELECT parsed_data FROM job_descriptions WHERE id = %s", (jd_id,))
            row = cur.fetchone()
            if row and row[0]:
                return row[0]  # row[0] is parsed_data (JSONB → dict)
            return None
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
    finally:
        if 'conn' in locals():
            conn.close()
