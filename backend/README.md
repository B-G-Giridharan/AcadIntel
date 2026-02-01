# AcadIntel Backend

FastAPI backend for AcadIntel (answer key + notes PDF generation).

## Requirements
- Python 3.8+
- pip

## Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Server: http://localhost:8000

## API Endpoints
- POST /api/generate/answer-key
- POST /api/generate/notes
- GET /api/download/{filename}
- GET /api/demo/textbook
- GET /api/demo/questions

## Notes
- Generated PDFs are saved in backend/output/.
- CORS allows localhost ports used by the frontend dev server.
