from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime

from services.answer_key_generator import generate_answer_key
from services.notes_generator import generate_notes_book
from data.demo_textbook import get_demo_textbook, get_demo_questions

app = FastAPI(title="AcadIntel Backend API", version="1.0.0")

# CORS configuration for frontend - MUST be added FIRST before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom middleware to handle OPTIONS requests
@app.middleware("http")
async def handle_options(request: Request, call_next):
    if request.method == "OPTIONS":
        return PlainTextResponse("", status_code=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        })
    response = await call_next(request)
    return response

# Models
class AnswerKeyRequest(BaseModel):
    subject_id: Optional[str] = None
    subject_name: Optional[str] = None
    include_citations: bool = True
    smart_highlights: bool = True
    dark_export: bool = False

class NotesRequest(BaseModel):
    subject_id: Optional[str] = None
    subject_name: Optional[str] = None
    topics: Optional[List[str]] = None
    include_citations: bool = True
    smart_highlights: bool = True
    dark_export: bool = False

class GenerationResponse(BaseModel):
    success: bool
    file_path: str
    filename: str
    message: str
    metadata: dict

@app.get("/")
async def root():
    return {
        "message": "AcadIntel Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "generate_answer_key": "/api/generate/answer-key",
            "generate_notes": "/api/generate/notes",
            "demo_data": "/api/demo/textbook"
        }
    }

@app.post("/api/generate/answer-key")
async def create_answer_key(request: AnswerKeyRequest):
    """
    Generate a comprehensive answer key with:
    - Repeated questions identification
    - High-weightage questions
    - Exact answers from textbooks
    - Source references
    - External links if needed
    """
    try:
        # Get demo questions for the subject
        questions = get_demo_questions(request.subject_name)
        
        # Get demo textbook content
        textbook = get_demo_textbook(request.subject_name)
        
        # Generate answer key PDF
        result = generate_answer_key(
            subject_name=request.subject_name,
            questions=questions,
            textbook=textbook,
            settings={
                "include_citations": request.include_citations,
                "smart_highlights": request.smart_highlights,
                "dark_export": request.dark_export
            }
        )
        
        return GenerationResponse(
            success=True,
            file_path=result["file_path"],
            filename=result["filename"],
            message="Answer key generated successfully",
            metadata={
                "total_questions": result["total_questions"],
                "repeated_questions": result["repeated_questions"],
                "high_weightage": result["high_weightage"],
                "sources_used": result["sources_used"],
                "generation_time": result["generation_time"]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer key: {str(e)}")

@app.post("/api/generate/notes")
async def create_notes(request: NotesRequest):
    """
    Generate exam-ready notes/mini-book with:
    - Important questions converted to topics
    - Structured study material
    - Chapter-wise organization
    - Exam-oriented flow
    """
    try:
        # Get demo questions for the subject
        questions = get_demo_questions(request.subject_name)
        
        # Get demo textbook content
        textbook = get_demo_textbook(request.subject_name)
        
        # Generate notes/mini-book PDF
        result = generate_notes_book(
            subject_name=request.subject_name,
            questions=questions,
            textbook=textbook,
            topics=request.topics,
            settings={
                "include_citations": request.include_citations,
                "smart_highlights": request.smart_highlights,
                "dark_export": request.dark_export
            }
        )
        
        return GenerationResponse(
            success=True,
            file_path=result["file_path"],
            filename=result["filename"],
            message="Notes generated successfully",
            metadata={
                "total_chapters": result["total_chapters"],
                "total_topics": result["total_topics"],
                "total_pages": result["total_pages"],
                "sources_used": result["sources_used"],
                "generation_time": result["generation_time"]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating notes: {str(e)}")

@app.get("/api/download/{filename}")
async def download_pdf(filename: str):
    """Download generated PDF file"""
    file_path = os.path.join("output", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/pdf"
    )

@app.get("/api/demo/textbook")
async def get_textbook_demo():
    """Get demo textbook content for preview"""
    return {
        "quantum_physics": get_demo_textbook("Quantum Physics I"),
        "machine_learning": get_demo_textbook("Machine Learning")
    }

@app.get("/api/demo/questions")
async def get_questions_demo():
    """Get demo questions for preview"""
    return {
        "quantum_physics": get_demo_questions("Quantum Physics I"),
        "machine_learning": get_demo_questions("Machine Learning")
    }

if __name__ == "__main__":
    import uvicorn
    # Create output directory if it doesn't exist
    os.makedirs("output", exist_ok=True)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
