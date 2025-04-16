# AiCruit

AiCruit is a full-stack AI-powered recruitment platform that streamlines the hiring process.

## Tech Stack

- **Backend**: Ruby on Rails (API-only)
- **Frontend**: Next.js
- **Microservices**: Python

## Repository Setup

Clone the repository:

```bash
git clone git@github.com:joshsoftware/aicruit.git
```

## Project Structure

```
aicruit/
├── aicruit-api     # Ruby on Rails backend (API-only)
├── app             # Next.js frontend
└── service         # Python-based microservices
```

## Backend Setup (Rails)

### Requirements
- Ruby version: 3.3.2 (RVM recommended)
- Rails version: 7.2.2
- PostgreSQL: 12+

### Installation Steps

1. Navigate to the backend directory:
   ```bash
   cd aicruit/aicruit-api
   ```

2. Create `.env` file (refer to `.env.example` for required variables)

3. Install dependencies:
   ```bash
   bundle install
   ```

4. Set up the database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

5. Start the Rails server:
   ```bash
   rails s
   ```

The Rails API will be available at http://localhost:3000

## Frontend Setup (Next.js)

### Requirements
- Node.js 18+
- npm

### Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd aicruit/app
   ```

2. Create `.env.local` file (refer to `.env.example` if available)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## Setting Up Custom Domain for Multitenancy (Ubuntu)

### Edit the `/etc/hosts` File

1. Open a terminal window

2. Edit the hosts file with root permissions:
   ```bash
   sudo nano /etc/hosts
   ```

3. Add the following line at the end of the file:
   ```
   127.0.0.1    joshsoftware.aicruit.com
   ```

4. Save and exit the editor

5. Test the configuration:
   ```bash
   ping joshsoftware.aicruit.com
   ```

6. Access the frontend using the custom domain:
   ```
   http://joshsoftware.aicruit.com:5173
   ```

This setup allows you to access your local development environment using the custom domain, which is essential for testing multitenancy features. For the frontend application, replace http://localhost:5173 with http://joshsoftware.aicruit.com:5173 in your browser.


# Python setup 

# Setup Instructions
**Pre-requisite: Note: Following instructions a for linux, python 3.8.1 or above**

    sudo apt-get update
    sudo apt-get install python3.8.1

ffmpeg

    sudo apt update && sudo apt install ffmpeg

Ollam

For Linux:

     curl -fsSL https://ollama.com/install.sh | sh

For Mac:

    https://ollama.com/download/Ollama-darwin.zip

For Windows:

    https://ollama.com/download/OllamaSetup.exe

Llama 3.2 model

     ollama run llama3.2

Setup Clone this github repository git clone

Create python virtual environment

    python3 -m venv lingo .

Activate the virtual environment

    source lingo/bin/activate

Install dependencies

    pip install -r requirements.txt

    uvicorn main:app --host localhost --port 8000 --reload

# exit virtual env

deactivate
