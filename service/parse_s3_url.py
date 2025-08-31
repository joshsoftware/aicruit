import os
import tempfile
import boto3
import fitz  # PyMuPDF for PDF
import docx2txt  # For DOCX
import textract   # For DOC and others

# =====================
# AWS Config - from env
# =====================
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION", "us-east-1")

if not aws_access_key or not aws_secret_key:
    raise EnvironmentError("AWS credentials not found in environment variables")

# S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=aws_region
)

# =====================
# Helper: Parse S3 URL
# =====================
def parse_s3_url(s3_url: str):
    if not s3_url.startswith("s3://"):
        raise ValueError("Invalid S3 URL format")
    parts = s3_url.replace("s3://", "").split("/", 1)
    return parts[0], parts[1]

# =====================
# S3 File Download
# =====================
def download_file_from_s3(s3_url: str, suffix: str) -> str:
    """Download file from S3 and return temp file path."""
    bucket, key = parse_s3_url(s3_url)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    s3.download_file(bucket, key, tmp_file.name)
    return tmp_file.name

# =====================
# File Readers
# =====================
def read_pdf(file_path: str) -> str:
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text("text") + "\n"
    return text.strip()

def read_docx(file_path: str) -> str:
    return docx2txt.process(file_path).strip()

def read_doc(file_path: str) -> str:
    return textract.process(file_path).decode("utf-8").strip()

def read_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read().strip()

# =====================
# Main Function
# =====================
def get_text_from_s3_file(s3_url: str) -> str:
    """Download any file type from S3 & extract text."""
    extension = os.path.splitext(s3_url)[-1].lower()

    if extension == ".pdf":
        path = download_file_from_s3(s3_url, ".pdf")
        return read_pdf(path)
    elif extension == ".docx":
        path = download_file_from_s3(s3_url, ".docx")
        return read_docx(path)
    elif extension == ".doc":
        path = download_file_from_s3(s3_url, ".doc")
        return read_doc(path)
    elif extension == ".txt":
        path = download_file_from_s3(s3_url, ".txt")
        return read_txt(path)
    else:
        raise ValueError(f"Unsupported file type: {extension}")
