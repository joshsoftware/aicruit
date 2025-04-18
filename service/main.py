import json
import os
from fastapi import FastAPI, BackgroundTasks, UploadFile, Form, File
from fastapi.responses import JSONResponse
import psycopg2
from logger import logger
from conversation_diarization.speaker_diarization import transcribe_audio, transcription_with_speaker_diarization
from starlette.middleware.cors import CORSMiddleware
from audio_service import translate_with_whisper
from conversation_diarization.dbcon import initDbConnection
from conversation_diarization.jd_interview_aligner import align_interview_with_job_description
from conversation_diarization.request import InterviewAnalysisRequest
from conversation_diarization.audio_transcription_request import AudioTranscriptionRequest
from conversation_diarization.action_extrator import extract_action_from_transcription
from audio_service import translate_with_whisper_timestamped
from summarizer import summarize_using_openai
from summarizer import summarize_using_ollama
from pydantic import BaseModel
from docx import Document
import re
import ollama
from conversation_diarization.speaker_diarization import create_prompt
import ssl
import logging
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2 import service_account
from utils.constants import LLM, SCOPES, TEMPERATURE
from typing import Optional, Dict
import io
from conversation_diarization.jd_parser import read_docx 
from conversation_diarization.jd_interview_aligner import parse_jd_from_llm

dbCursor = initDbConnection()
import traceback
from util import generate_timestamp_jon
from fastapi_versionizer.versionizer import Versionizer, api_version

app = FastAPI()

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def root_route():
    return 'Hello, this is the root route for lingo ai server'

class Body(BaseModel):
    audio_file_link: str
    speaker_diarization: bool

@api_version(1)
@app.post("/upload-audio")
async def upload_audio(body: Body):
    try:
        #check if string is empty
        if body.audio_file_link == "":
            return JSONResponse(status_code=400, content={"message":"Invalid file link"})
        # Check file type
        if not body.audio_file_link.endswith(('.m4a', '.mp4','.mp3','.webm','.mpga','.wav','.mpeg','.ogg')):
            logger.error("invalid file type")
            return JSONResponse(status_code=400, content={"message":"Invalid file type"})
        translation = translate_with_whisper(body.audio_file_link)


        logger.info("translation done")
        summary = summarize_using_openai(translation)


        logger.info("summary done")
        return JSONResponse(content={"message": "File processed successfully!", "translation":translation, "summary": summary}, status_code=200)

    except Exception as e:
        logger.info(traceback.format_exc())
        return JSONResponse(content={"message": str(e)}, status_code=500)
    
@api_version(2)
@app.post("/upload-audio")
async def upload_audio(body: Body):
    try:
        #check if string is empty
        if body.audio_file_link == "":
            return JSONResponse(status_code=400, content={"message":"Invalid file link"})
        # Check file type
        if not body.audio_file_link.endswith(('.m4a', '.mp4','.mp3','.webm','.mpga','.wav','.mpeg','.ogg')):
            logger.error("invalid file type")
            return JSONResponse(status_code=400, content={"message":"Invalid file type"})
        translation = translate_with_whisper_timestamped(body.audio_file_link)

        logger.info("translation done")
        summary = summarize_using_ollama(translation["text"])

        logger.info("summary done")
        result = generate_timestamp_jon(translation,summary)
        logger.info(result)

        return JSONResponse(content=result, status_code=200)
        

    except Exception as e:
        logger.info(traceback.format_exc())
        return JSONResponse(content={"message": str(e)}, status_code=500)
    
versions = Versionizer(
    app=app,
    prefix_format='/v{major}',
    semantic_version_format='{major}',
    latest_prefix='/latest',
    sort_routes=True
).versionize()


@app.post("/audio-transcription/network")
async def audio_transcription_from_network(request: AudioTranscriptionRequest):
    try:
        transcription = transcribe_audio(request.audio)
        return JSONResponse(content={"transcription": transcription["full_transcript"]}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"result": str(e)}, status_code=500)
    
@app.post("/audio-transcription/file")
async def audio_transcription_from_file(file: UploadFile):
    try:
        transcription = transcribe_audio(file.file)
        return JSONResponse(content={"transcription": transcription["full_transcript"]}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"result": str(e)}, status_code=500)
    
@app.post("/get-action-from-audio")
async def get_action_from_transcription(file: UploadFile):
    try:
        # Transcribe
        # transcription = transcribe_audio(audio=file.file, translate=True)
        translation = translate_with_whisper(file.file)
        
        # Get action
        # action = extract_action_from_transcription(transcription["full_transcript"])
        action = extract_action_from_transcription(translation)
        
        # Return response
        return JSONResponse(content={"result": action}, status_code=200)
    
    except Exception as e:
        print(e)
        return JSONResponse(content={"result": str(e)}, status_code=500)

@app.post("/analyse-interview")
async def analyse_interview(
    candidate_name: str = Form(...),
    interviewer_name: str = Form(...),
    core_technology: str = Form(...),
    interview_link: Optional[str] = Form(None),
    job_description_link: str = Form(...),
    interview_transcript: Optional[str] = Form(None),
    transcript_file: UploadFile = File(None),
    background_tasks: BackgroundTasks = None,
):
    ANALYSIS_STATUS = "pending"
    print("Request received")
    try:
        db_connection_string = os.getenv('DATABASE_URL')
    
        # Request payload validation
        if not all([interviewer_name, candidate_name, job_description_link]):
            return JSONResponse(status_code=400, content={"message": "Invalid request, missing params"})

        if transcript_file:
            transcript_file_contents = read_contents_of_file(transcript_file)
        else:
            transcript_file_contents = None
        
        # Create record
        analysis_id = insert_interview_analysis(
            conn_string=db_connection_string,
            user_id='x7w6qksaibnh2usz', #TODO: replace with actual user's id
            candidate_name=candidate_name,
            interviewer_name=interviewer_name,
            interview_recording_link=interview_link if interview_link else None,
            interview_transcript_link=interview_transcript if interview_transcript else None,
            job_description_document_link=job_description_link,
            status=ANALYSIS_STATUS
        )

        if not analysis_id:
            return JSONResponse(content={"message": "Failed to process the request, please try again."}, status_code=500)
        
        request = {
            "candidate_name": candidate_name,
            "interviewer_name": interviewer_name,
            "interview_link": interview_link,
            "job_description_link": job_description_link,
            "interview_transcript_url": interview_transcript,
            "transcript_file_contents": transcript_file_contents,
            "core_technology": core_technology,
        }
        
        # Schedule background task for analysis
        background_tasks.add_task(
            process_interview_analysis,
            db_connection_string,
            analysis_id,
            request
        )
        
        # Respond immediately to the client
        return JSONResponse(content={"message": "Request received and is in progress", "analysis_id": analysis_id}, status_code=202)

    except Exception as e:
        return JSONResponse(content={"result": str(e)}, status_code=500)
    
def get_job_description_contents(file_url: Optional[str], jd_file: Optional[UploadFile]):
    if jd_file:
        file_contents = read_contents_of_file(jd_file)
    elif file_url:
        file_contents = read_docx(file_url)

    parsed_jd_contents = parse_jd_from_llm(file_contents)

    if parsed_jd_contents:
        return parsed_jd_contents
    
    return None

@app.post("/parse-job-description")
async def parse_job_description(
    title: str = Form(...),
    file_url: Optional[str] = Form(None),
    jd_file: UploadFile = File(None),
):
    try:
        # Validate input params
        if not title or not (file_url or jd_file):
            return JSONResponse(status_code=400, content={
                "status": False,
                "data": {},
                "message": "Invalid request, missing params"
            })
        
        jd_file_contents = get_job_description_contents(file_url, jd_file)
        if not jd_file_contents:
            return JSONResponse(status_code=400, content={
                "status": False,
                "data": {},
                "message": "Failed to read job description contents"
            })
        
        return JSONResponse(status_code=200, content={
            "status": True,
            "data": {"title": title, "parsed_data": jd_file_contents},
            "message": "Job description parsed successfully!"
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "status": False,
            "data": {},
            "message": f"Internal server error: {str(e)}"
        })
    
def process_interview_analysis(conn_string, analysis_id, request):
    """
    Background task to handle transcription, speaker diarization, and job description alignment.
    """
    ANALYSIS_STATUS = "completed"

    try:
        if request['transcript_file_contents']:
            transcription_result = get_question_answers_from_file(request['transcript_file_contents'])
            questions_answers = transcription_result["qna"]
            conversation = extract_conversation_from_file(request['transcript_file_contents'])['conversation']
            transcript = transcription_result["transcript"]
        elif request['interview_transcript_url']:
            # Use the provided transcript file url
            print("Using provided transcript file url")
            transcription_text = read_docx(request['interview_transcript_url'])
            transcription_result = get_question_answers_from_transcript(transcription_text['result'])
            questions_answers = transcription_result["qna"]
            conversation = extract_conversation_from_file(transcription_text['result'])['conversation']
            transcript = transcription_text['result']
        else:
            # Perform transcription and speaker diarization
            transcription_result = transcription_with_speaker_diarization(request)
            transcript = transcription_result["transcript"]
            questions_answers = transcription_result["qna"]
            conversation = transcription_result["conversation"]

        # Perform job description alignment
        analysis_result = align_interview_with_job_description(request['job_description_link'], questions_answers, request['core_technology'])

        # Update record in the database
        analysis_updated = update_interview_analysis(
            conn_string=conn_string,
            record_id=analysis_id,
            transcript=transcript,
            questions_answers=questions_answers,
            parsed_job_description=analysis_result["parsed_job_description"],
            analysis_result=analysis_result["analysis"],
            conversation=conversation,
            status=ANALYSIS_STATUS
        )

        if analysis_updated:
            print(f"Analysis for record ID {analysis_id} completed successfully.")
        else:
            print(f"Analysis for record ID {analysis_id} failed.")

    except Exception as e:
        print(f"Error processing analysis for record ID {analysis_id}: {e}")

def insert_interview_analysis(conn_string, user_id, candidate_name, interviewer_name, 
                              interview_recording_link, interview_transcript_link, 
                              job_description_document_link, status):
    """
    Insert a new record into the interview_analysis table and return the generated ID.
    """
    query = """
    INSERT INTO interview_analysis (
        user_id, 
        candidate_name, 
        interviewer_name, 
        interview_recording_link, 
        interview_transcript_link, 
        job_description_document_link, 
        status
    ) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    generated_id = None

    try:
        # Determine which field to populate and set the other to None
        recording_link = interview_recording_link if interview_recording_link else None
        transcript_link = interview_transcript_link if interview_transcript_link else None

        # Establish the database connection
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cur:
                # Execute the INSERT statement with parameterized values
                cur.execute(query, (
                    user_id, 
                    candidate_name, 
                    interviewer_name, 
                    recording_link, 
                    transcript_link, 
                    job_description_document_link,
                    status
                ))
                # Fetch the returned ID
                row = cur.fetchone()
                if row:
                    generated_id = row[0]
                # Commit the transaction
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
    finally:
        return generated_id
    
def update_interview_analysis(conn_string, record_id, transcript, questions_answers, 
                              parsed_job_description, analysis_result, conversation, status):
    """
    Update an existing record in the interview_analysis table.
    """
    query = """
    UPDATE interview_analysis
    SET 
        transcript = %s,
        questions_answers = %s,
        parsed_job_description = %s,
        analysis_result = %s,
        conversation = %s,
        status = %s
    WHERE id = %s;
    """
    
    is_updated = False

    try:
        # Establish the database connection
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cur:
                # Execute the UPDATE statement with parameterized values
                cur.execute(query, (
                    json.dumps(transcript), 
                    json.dumps(questions_answers),
                    json.dumps(parsed_job_description),
                    json.dumps(analysis_result),
                    json.dumps(conversation),
                    status,
                    record_id
                ))
                # Check if any row was updated
                is_updated = cur.rowcount > 0
                # Commit the transaction
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
    finally:
        return is_updated

def read_contents_of_file(transcript_file: UploadFile) -> str:
    """
    Save the uploaded file to disk temporarily, reopen it, and extract text.
    """
    try:
        file_object = io.BytesIO(transcript_file.file.read())
        doc = Document(file_object)
        
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        
        file_contents =  '\n'.join(full_text)
        return file_contents
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def get_question_answers_from_file(file_content: str) -> Dict:
    """
    Process the uploaded file and extract Q&A data.
    Supports DOCX and TXT files (extendable to other formats).
    """
    try:
        print("Processing file content in get_question_answers_from_file")
        prompt = create_prompt(file_content, "qna")
            
        response = ollama.chat(
            model=LLM,
            options={"temperature": TEMPERATURE},
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.get("message", {}).get("content", "")
        response_text_json = re.search(r"\{.*\}", response_text, re.DOTALL)

        if response_text_json:
            try:
                response_text_json = json.loads(response_text_json.group())
            except json.JSONDecodeError as e:
                response_text_json = None
        else:
            response_text_json = None

        print("Processed file content in get_question_answers_from_file")
        return {
            "transcript": file_content,
            "qna": response_text_json
        }
    except Exception as e:
        print(f"Error processing the file: {e}")
        return None

def get_question_answers_from_transcript(file_contents):
    prompt = create_prompt(file_contents, "qna")
            
    response = ollama.chat(
        model=LLM,
        options={"temperature": TEMPERATURE},
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = response.get("message", {}).get("content", "")
    response_text_json = re.search(r"\{.*\}", response_text, re.DOTALL)
    
    if response_text_json:
        try:
            response_text_json = json.loads(response_text_json.group())
        except json.JSONDecodeError as e:
            response_text_json = None
    else:
        response_text_json = None
    
    return {
        "qna": response_text_json
    }

def extract_conversation_from_file(transcript_file_contents: str):
    """
    Extract conversation between all speakers from a transcript text.

    Args:
        transcript_file_contents (str): The transcript content as text.

    Returns:
        dict: A dictionary where each key is a speaker's name and the value is a list of their statements.
    """
    try:
        print("Extracting conversation from file")
        prompt = create_prompt(transcript_file_contents, "conversation")
            
        response = ollama.chat(
            model=LLM,
            options={"temperature": TEMPERATURE},
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.get("message", {}).get("content", "")
        response_text_json = re.search(r"\{.*\}", response_text, re.DOTALL)
        
        if response_text_json:
            try:
                response_text_json = json.loads(response_text_json.group())
            except json.JSONDecodeError as e:
                response_text_json = None
        else:
            response_text_json = None
        
        return {
            "conversation": response_text_json
        }
    except Exception as e:
        print(f"Error extracting conversation: {e}")
        return {}

def extract_conversation_from_transcript(file_text):
    """
    Extract and format the conversation between all speakers from a transcript provided as text.

    Args:
        file_text (str): The full text content of the transcript file.

    Returns:
        str: A formatted string of the conversation between all speakers.
    """
    try:
        paragraphs = [line.strip() for line in file_text.splitlines() if line.strip()]

        conversation = []
        current_speaker = None

        for paragraph in paragraphs:
            if ":" in paragraph:
                parts = paragraph.split(":", 1)
                speaker = parts[0].strip()
                statement = parts[1].strip() if len(parts) > 1 else ""

                if current_speaker is not None and current_speaker != speaker:
                    conversation.append("\n")
                conversation.append(f"{speaker}: {statement}")
                current_speaker = speaker
            else:
                if current_speaker is not None:
                    conversation.append(f"  {paragraph}")

        return "\n".join(conversation)

    except Exception as e:
        print(f"Error extracting conversation: {e}")
        return ""
