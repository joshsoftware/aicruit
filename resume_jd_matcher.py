#This code is used to initiate the llama model and perform operations.

from resume_jd_reader import *
from jd_extractor import extract_using_regex
from langchain_ollama import OllamaLLM
import matcher_prompt 

def matcher():
    file = drive_reader()
    all_resumes = resume_reader(file)
    jd =  extract_using_regex()  
    model = OllamaLLM(model="llama3.1")
    for resume_key, resume_value in all_resumes.items():
        prompt = matcher_prompt.generate_matching_prompt(jd,resume_value)
        response = model.invoke(prompt)
        print(response)

if __name__ == "__main__":
    response = matcher()
    print(response)

