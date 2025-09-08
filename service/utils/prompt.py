UPDATED_QNA_PROMPT_MSG = """
    <TRANSCRIPTION>

    1. Above is the transcription of an interview. Analyze the communication and make a list of questions asked by the interviewer and their answers given by the candidate.
    2. Evaluate whether the answer is 'right', 'partially right,' or 'wrong.' Put 'unknown' if you are unsure about the correctness of the answer.
    3. Rate each answer out of 10 (1 to 10).
    4. Add a remark stating what could be improved when the rating for an answer is not 10 out of 10. Otherwise, keep it empty.
    5. I want your response as a **pure JSON string**, in the following format:

    ```json
    {
        "rating_scale": [1, 10],
        "result": [
            {
                "id": 1,
                "question": "",
                "answer": "",
                "correctness": "",
                "remark": "",
                "rating": 1
            }
        ]
    }
    
    
    Important: You must return only the JSON object. Do not add any explanations, headers, or other text outside the JSON object. If you include anything outside of the JSON, the response will be considered invalid.
    Do not prefix or suffix the response with anything like "Here is the analysis."
    """

QNA_PROMPT_MESSAGE = """
    <TRANSCRIPTION>
    
    1. Above is the transcription of an interview. Analyse the communication and make a list of questions asked by interviewer and their 2. answers given by the candidate.
    3. Evaluate whether the answer is 'right', 'partially right' or 'wrong'. Put 'unknown' if you are not sure about correctness of the answer.
    4. Rate each answer out of 10 (1 to 10).
    5. Add a remark stating what could be improved when rating for an answer is not 10 out of 10. Otherwise keep it empty.
    6. I want your response as a pure JSON, in following format:
    
    {
        "rating_scale": [1,10],
        "result": [
            {
                "id": 1,
                "question": "",
                "answer": "",
                "correctness": "",
                "remark": "",
                "rating": 1
            },
            {
                "id": 2,
                "question": "",
                "answer": "",
                "correctness": "",
                "remark": "",
                "rating": 1
            }
        ]
    }
    
    I'll be parsing your response directly as a JSON string, so make sure apart from JSON, no other text is present in response.
    """

CONVERSATION_PROMPT_MESSAGE = """
    <TRANSCRIPTION>
    
    1. Above is the transcription of an interview. Analyse the communication and make a conversation between the interviewer and the candidate with their respective names.
    2. I want full conversation, including questions asked by the interviewer and answers given by the candidate. 
    3. I want your response as a pure JSON, in following format:
    
    {
        "result": [
            {
                "speaker_name": "Interviewer",
                "text": "Question 1"
            },
            {
                "speaker_name": "Candidate",
                "text": "Answer 1"
            },
            {
                "speaker_name": "Interviewer",
                "text": "Question 2"
            },
            {
                "speaker_name": "Candidate",
                "text": "Answer 2"
            }
        ]
    }
    
    I'll be parsing your response directly as a JSON string, so make sure apart from JSON, no other text is present in response.
    """
    
JD_INTERVIEW_ALIGNMENT_PROMPT = """
Read the given Job Description below:

<JOB_DESCRIPTION>

and also Read the below Questions of the Interview:

<QUESTIONS_AND_ANSWERS>

Now do this:
1. Analyze the above Questions with JD, and evaluate if these Question's are relevant to the JD
2. Based on whole evaluation you've done, add the strengths, weaknesses and overall summary of the candidate.
3. I want your response as a **pure JSON string**, in the following format:

```json
{
    "core_skills": ["Question Numbers which are aligned for Skills (Must have)"],
    "secondary_skills": ["Question Numbers which are aligned for (Good to have)"],
    "domain_expertise": ["Question Numbers which are aligned for Responsibilities"],
    "strengths":["These are candidate's qualities"],
    "weaknesses":["These are candidate's weaknesses"],
    "summary": "Overall Summary of the candidate"
}

Important: You must return only the JSON object. Do not add any explanations, headers, or other text outside the JSON object. If you include anything outside of the JSON, the response will be considered invalid.
Do not prefix or suffix the response with anything like "Here is the analysis."
"""


ACTION_EXTRATOR_PROMPT = """
<USER_COMMAND>

Above is the command given by a banking app user.
Goal here is to convert this command into an actionable JSON object.

Following is the list of action we support.

[
    {
        "action": "money_transfer",
        "data": {
            "amount": "",
            "recipient": ""
        }
    },
    {
        "action": "account_balance_check",
        "data": {
            
        }
    },
    {
        "action": "loan_emi_check",
        "data": {
            
        }
    }
]

Check if the given command aligns to one of the actions listed above, if yes then give the JSON object with relevant data added in the 'data' param, if no then response back with 'unsupported' as action and put the actual user command as data.

Please note, not all commands need any information in data, only put data when it's supporting the action (like in case of money_transfer the amount and recipient are necessary details, but nothing is needed in case of account_balance_check)

Important: You must return only the JSON object. Do not add any explanations, headers, or other text outside the JSON object. If you include anything outside of the JSON, the response will be considered invalid.
Do not prefix or suffix the response with anything like "Here is the result."

"""

QNA_DIFFCULTY_LEVEL_RATING_FIND_PROMPT = """
    <QUESTIONS>

    1. Above are the questions from question bank. Analyze them.
    2. Now, analyze the below questions that were asked in the interview and align them with above questions bank. For each question, assign a difficulty level based on the corresponding question in the question bank.

    <ASKED_QUESTIONS>



    3. Evaluate whether the difficulty level is 'Basic', 'Medium', or 'Advanced'. 
    4. If you are unsure about the level of a question then provide a difficulty level by your own.
    5. If it is not present in the question bank, mark it as 'Unknown'.
    6. Please provide your response as a **pure JSON string** in the following format:

    ```json
    {
      "result": [
          {
              "id": "<question_id>",
              "question": "<question>",
              "difficulty_level": "<level>"
          },
          {
              "id": "<question_id>",
              "question": "<question>",
              "difficulty_level": "<level>"
          },
      ]
    }
    ```
    Important: You must return only the JSON object. Do not add any explanations, headers, or other text outside the JSON object. If you include anything outside of the JSON, the response will be considered invalid.
    Do not prefix or suffix the response with any text like "Here is the analysis."
"""

PARSE_JD_PROMPT = """
    <FILE_CONTENTS>

    
    1. Above are the file contents for given job description. Analyze it.
    2. Now, On the basis of above job description, prepare a list of core skills(Must to have), secondary(Good to have) skills, and domain expertise(responsibilities) required for the job.
    3. skills must be in full sentences, not just keywords.
    4. Please provide your response as a **pure JSON string** in the following format:

    ```json
    {
        "core_skills": ["skill1", "skill2"],
        "secondary_skills": ["skill1", "skill2"],
        "domain_expertise": ["skill1", "skill2"],
    }
    ```
    Important: You must return only the JSON object. Do not add any explanations, headers, or other text outside the JSON object. If you include anything outside of the JSON, the response will be considered invalid.
    Do not prefix or suffix the response with any text like "Here is the analysis."
"""

RESUME_PARSE_PROMPT = """
You are an expert resume parser specializing in tech and business resumes. Your task is to meticulously extract specific information and return it as a valid JSON object.

Rules:
- STRICTLY adhere to the JSON schema.
- If information is not explicitly present, set the value to null or an empty list (e.g., []). Do NOT guess.
- Primary skills are core, hard skills (e.g., programming languages, specific frameworks). Secondary skills are softer skills or less central technologies.
- Domain expertise should be a list of industries or business areas (e.g., 'Finance', 'E-commerce', 'Logistics').
- Skills should be concise keywords/tokens, not full sentences. Deduplicate and normalize them.
- **CRITICAL:** For each work experience role, you MUST find and provide the "start_date" and "end_date". If the end date is ongoing, use "present".
- Output ONLY the JSON object. Do NOT include any markdown, code fences, or explanatory text before or after the JSON.

Schema:
{{
  "primary_skills": [string],
  "secondary_skills": [string],
  "domain_expertise": [string],
  "relevant_experience": {{
    "total_years": number or null,
    "roles": [
      {{
        "title": string or null,
        "company": string or null,
        "start_date": string or null,
        "end_date": string or null,
        "years": number or null,
        "highlights": [string]
      }}
    ]
  }},
  "education_certificates": [
    {{
      "name": string,
      "issuer": string or null,
      "year": string or null,
      "type": "degree" | "certification"
    }}
  ]
}}

Resume Text:
{resume_text}
"""





PARSE_NEWJD_PROMPT="""
You are an expert job description parser. Parse this JD systematically.

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


RESUME_JD_PROMPT_TEMPLATE = """
You are an expert technical recruiter.
Compare the given candidate resume with the job description.
Return STRICT JSON only, no commentary.

### Candidate Resume (parsed JSON):
{resume_json}

### Job Description (parsed JSON):
{jd_json}

### Instructions:
1. Compare candidate’s skills with JD must-have and good-to-have skills.
2. Evaluate years of experience against JD requirements.
3. Check if qualifications match JD expectations.
4. Consider domain expertise if relevant.
5. Give a match score as a float (0.0–10.0)
6. Output reasoning in 2–4 short bullet points.

### Output Format (STRICT JSON):
{{
  "match_score": <float>,
  "reasoning": [
    "<point 1>",
    "<point 2>",
    "<point 3>"
  ],
  "matched_skills": {{
    "must_have": ["..."],
    "good_to_have": ["..."]
  }},
  "missing_skills": {{
    "must_have": ["..."],
    "good_to_have": ["..."]
  }},
  "qualification_match": true/false,
  "experience_match": true/false
}}
"""