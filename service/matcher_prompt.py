#this code is used for the creating prompt using prompt template.
#Change the prompt accoring to the need and change variables if needed.

from langchain_core.prompts import PromptTemplate
from service.resume_jd_matcher import resume_reader
from service.jd_extractor import extract_using_regex

def generate_matching_prompt(jd,resume):

    prompt_template = PromptTemplate.from_template( """
Please compare the provided job description with the given candidate's resume and rate the candidate's fit for the job role on a scale from 1 to 10, where 10 is the best possible match and 1 is the worst match. The rating should be based on the following factors:

1. **Job Role**: Does the candidate's experience align with the job role and responsibilities? Does the candidate have experience in the required technologies or domain?
2. **Job Experience**: Does the candidate meet the required number of years of experience? Are there any relevant skills or expertise that show the candidate's suitability for the job?
3. **Key Responsibilities**: How well does the candidate’s experience align with the core responsibilities outlined in the job description?
4. **Skills**: Does the candidate possess the skills required for the job role? Are the skills relevant and demonstrated in the resume?
5. **Projects**: Does the candidate have relevant project experience, especially related to the technologies or domain of the job role?

Additionally, provide a short explanation for the rating, detailing the strengths and weaknesses of the candidate's resume compared to the job description.

### Job Description:
Job Role: {job_role}
Experience: {job_experience}
Job Overview: {job_overview}
Key Responsibilities: {key_responsibilities}
Preferred Skills: {preferred_skills}

### Resume:
Resume: {resume}

Please analyze the job description and the resume, and provide a only rating along with a one line explanation.

""")

    opt_prompt = prompt_template.invoke({
        "job_role": jd['Job Role'],
        "job_overview" : jd["Job Overview"],
        "job_experience" : jd['Experience'],
        "key_responsibilities" : jd['Key Responsibilities'],
        "preferred_skills" : jd["Preferred Skills"],
        "resume" : resume
    })
    # print(jd)

    return opt_prompt
