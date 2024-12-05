#This code is used to read the jd and resumes from the google drive folder.
#drive_reader method requier the google drive folder name to read the jd and resumes from the given folder.
#extract_document_content method used for the extracting content from the resumes it checks for the pdf file extension using pypdfloader.
#resume_reader method is used for the reading resumes contents and store it in the dictionary.
#jd_reader is used to read the jd content from the google docs and returns a string.


from drive_connector import *
from typing import *
from dotenv import load_dotenv
import os
from langchain_community.document_loaders import PyPDFLoader

load_dotenv()

def drive_reader():
    service = create_drive_service()
    folder_id = get_folder_id(service, "GoLang")
    files = get_files_in_folder(service, folder_id)
    return files

def extract_document_content(file: Dict) -> str:
    """
    Extract content from a PDF or Google Doc.
    """
    content = ""
    if file['mimeType'] == "application/pdf":
        loader = PyPDFLoader("https://www.googleapis.com/drive/v3/files/"+ file['id'] + "?alt=media&key=" + os.getenv("GCP_API_KEY"))
        documents = loader.load()
        content = " ".join([doc.page_content for doc in documents])
    elif 'document' in file['mimeType']:
        content = read_google_doc(file['id'])
    return content

def resume_reader(files: List[Dict]) -> Dict[str, List[str]]:
    all_resumes = {}
    for i, file_content in enumerate(files):
        if file_content['mimeType'] in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
            resume_content = extract_document_content(file_content)
            if resume_content:
                all_resumes[f"Resume{i+1}"] = [resume_content]
            logger.info(f"Loaded resume {i+1}.")
    return all_resumes

def jd_reader(file) -> str:
    jd = ""
    for file_content in file:
        if 'document' in file_content['mimeType']:
            logger.info("Reading Google Docs content...")
            doc_text = read_google_doc(file_content['id'])
            if doc_text:
                jd+= doc_text
                logger.info("Google Docs content successfully extracted:")
            else:
                logger.error("Failed to extract content from Google Docs.")
        else:
            continue
    return jd

# if __name__ == "__main__":
#     response = resume_reader()
#     print(response)

