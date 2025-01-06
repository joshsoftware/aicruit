#This code is used for getting drive access to the application in which get_credentials method is used to define scopes and get authanticat google
#get_folder_id method is used to get the folder id with the help of folder name just pass the folder name and service account credential to the method it will access the desire folder from google drive
#get_files_in_folder method is used to list down all the files present in the folder which passed to the get_folder_id method.
#create_drive_service method is used to get access of google drive using the google api provided in the .env file.
#create_docs_service method is used to get access to the google docs listed in the given folder and handle google docs.
#read_google_doc method is used to read the google docs with the help of google docs id.


import os
import ssl
import logging
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2 import service_account
from datetime import datetime, timezone

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Google Drive API scopes
SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents.readonly"
]

def get_credentials():
    """Get Google Drive API credentials."""
    try:
        # Use the service account file from the environment variable
        credentials = service_account.Credentials.from_service_account_file(
            os.getenv("SERVICE_ACCOUNT_FILE"), scopes=SCOPES
        )
        logger.info("Credentials successfully loaded.")
        return credentials
    except Exception as error:
        logger.error(f"An error occurred while loading credentials: {error}")
        return None

def get_folder_id(service, folder_name):
    """Get the ID of a folder by name."""
    try:
        # Search for the folder in Google Drive
        results = service.files().list(
            q=f"mimeType='application/vnd.google-apps.folder' and name='{folder_name}'",
            fields="files(id, name)"
        ).execute()
        items = results.get("files", [])
        if not items:
            logger.info(f"No folder found with the name '{folder_name}'.")
            return None
        logger.info(f"Folder '{folder_name}' found with ID: {items[0]['id']}")
        return items[0]['id']
    except Exception as error:
        logger.warning(f"An error occurred while fetching folder ID: {error}")
        return None

def get_files_in_folder(service, folder_id):
    """Get all files in a specific folder by folder ID."""
    try:
        # Get all files in the specified folder
        results = service.files().list(
            q=f"'{folder_id}' in parents",
            fields="files(id, name, mimeType, createdTime, modifiedTime)"
        ).execute()
        files = results.get("files", [])
        logger.info(f"Found {len(files)} files in the folder.")
        return files
    except Exception as error:
        logger.warning(f"An error occurred while fetching files: {error}")
        return []

def create_drive_service():
    """Create and return a Google Drive API service object."""
    creds = get_credentials()
    if not creds:
        logger.error("Unable to obtain credentials.")
        return None
    return build("drive", "v3", credentials=creds)

def create_docs_service():
    """Create and return a Google Docs API service object."""
    creds = get_credentials()
    if not creds:
        logger.error("Unable to obtain credentials.")
        return None
    return build("docs", "v1", credentials=creds)

def read_google_doc(doc_id):
    """Read the content of a Google Docs document."""
    docs_service = create_docs_service()
    try:
        # Retrieve the Google Docs document content
        document = docs_service.documents().get(documentId=doc_id).execute()

        # Extract the document content (text)
        doc_content = document.get('body').get('content')
        
        text = ''
        for element in doc_content:
            if 'paragraph' in element:
                for run in element['paragraph'].get('elements', []):
                    if 'textRun' in run:
                        text += run['textRun'].get('content')

        return text
    except Exception as error:
        logger.error(f"Error reading Google Docs document: {error}")
        return None



# If you'd like to use these functions in other scripts, you can call them as follows:
# service = create_drive_service()
# folder_id = get_folder_id(service, "Fullstack")
# files = get_files_in_folder(service, folder_id)


    # logger.info(f"Folder ID: {folder_id}")

    # # Retrieve and process files
    # files = get_files_in_folder(service, folder_id)
    # if not files:
    #     logger.info("No files found in the folder.")
    #     return