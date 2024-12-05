#This code is used for the extracting various entity from the jd text to pass further to the ollama for better results and beteer understanding of LLM.
#If the jd format changes and some new fields get introduces then just change the keys of the extracted_data dictionary.


import re
import json
from resume_jd_reader import jd_reader,drive_reader
from typing import Dict,List,Optional

def extract_using_regex () ->  Dict[str,List[str]]:
    file = drive_reader()
    job_description = jd_reader(file)
    # Initialize dictionary to store extracted data
    extracted_data = {
        "Job Role": None,
        "Job Location": None,
        "Experience": None,
        "Job Overview": None,
        "Key Responsibilities": [],
        "Preferred Skills": [],
        "Qualifications": []
    }

    job_role_match = re.search(r"Job Role\s*[:\-]?\s*(.*)", job_description)
    if job_role_match:
        extracted_data["Job Role"] = job_role_match.group(1).strip()

    job_location_match = re.search(r"Job Location\s*[:\-]?\s*(.*)", job_description)
    if job_location_match:
        extracted_data["Job Location"] = job_location_match.group(1).strip()

    experience_match = re.search(r"Experience\s*[:\-]?\s*(\d+\s*–\s*\d+\s*years|\d+\+?\s*years)", job_description)
    if experience_match:
        extracted_data["Experience"] = experience_match.group(1).strip()

    job_overview_match = re.search(r"In this role,[\s\S]+?(?=Key Responsibilities)", job_description)
    if job_overview_match:
        extracted_data["Job Overview"] = job_overview_match.group(0).strip()

    responsibilities_match = re.search(r"Key Responsibilities\s*[:\-]?\s*([\s\S]+?)(?=Preferred Skills|Qualifications|$)", job_description)
    if responsibilities_match:
        responsibilities_text = responsibilities_match.group(1).strip()
        responsibilities = [line.strip() for line in responsibilities_text.split("\n") if line.strip()]
        extracted_data["Key Responsibilities"] = responsibilities

    preferred_skills_match = re.search(r"Preferred Skills\s*[:\-]?\s*([\s\S]+?)(?=Qualifications|$)", job_description)
    if preferred_skills_match:
        preferred_skills_text = preferred_skills_match.group(1).strip()
        preferred_skills = [line.strip() for line in preferred_skills_text.split("\n") if line.strip()]
        extracted_data["Preferred Skills"] = preferred_skills

    qualifications_match = re.search(r"Qualifications\s*[:\-]?\s*([\s\S]+)$", job_description)
    if qualifications_match:
        qualifications_text = qualifications_match.group(1).strip()
        qualifications = [line.strip() for line in qualifications_text.split("\n") if line.strip()]
        extracted_data["Qualifications"] = qualifications

    return extracted_data

# if __name__ == "__main__":
#     jd = jd_reader()
#     result = extract_using_regex(jd)
#     print(result)