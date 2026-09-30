"""
DocMate AI - Backend API Server
FastAPI backend providing AI assistant endpoints, service registry, checklist generation,
and static file hosting for all-in-one web deployment.
"""

import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Try loading .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from .services_data import get_all_services, get_service_by_id, search_services
from .checklist_engine import generate_custom_checklist
from .ai_assistant import DocMateAIAssistant

app = FastAPI(
    title="DocMate AI API",
    description="Intelligent Citizen Document Preparation & Conversational AI Assistant",
    version="1.0.0"
)

# Enable CORS for direct file:// browser access and external frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = DocMateAIAssistant()

# --- Pydantic Schemas ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query or message")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation turns")
    language: Optional[str] = Field("en", description="Language code: en or ta")
    userContext: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Current application context")

class ChecklistRequest(BaseModel):
    service_id: str
    applicant_relation: Optional[str] = "self"
    residence_type: Optional[str] = "own"
    state: Optional[str] = "Tamil Nadu"
    district: Optional[str] = "Chennai"
    mode: Optional[str] = "eseva"
    urgency: Optional[str] = "normal"
    lang: Optional[str] = "en"

# --- API Endpoints ---

@app.get("/api/health")
async def health_check():
    """Health check and AI engine status."""
    return {
        "status": "healthy",
        "service": "DocMate AI Backend",
        "version": "1.0.0",
        "ai_engine": "active",
        "llm_available": bool(assistant.gemini_api_key or assistant.openai_api_key),
        "llm_provider": "gemini" if assistant.gemini_api_key else ("openai" if assistant.openai_api_key else "internal-expert-system")
    }

@app.get("/api/services")
async def list_services(q: Optional[str] = Query(None, description="Search query")):
    """List all available services or filter by keyword."""
    if q:
        return {"services": search_services(q)}
    return {"services": get_all_services()}

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    """Retrieve detailed service documents and rules."""
    service = get_service_by_id(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.get("/api/suggestions")
async def get_suggestions(lang: str = Query("en")):
    """Get quick suggestion prompt chips for conversational AI."""
    if lang == "ta":
        return {
            "suggestions": [
                "பிறப்புச் சான்றிதழ் பெற என்ன ஆவணங்கள் தேவை?",
                "தந்தையின் சாதிச் சான்றிதழ் இல்லையெனில் என்ன செய்வது?",
                "வருமானச் சான்றிதழின் செல்லுபடி காலம் எவ்வளவு?",
                "இ-சேவை மையத்தில் அரசு கட்டணம் எவ்வளவு?",
                "DigiLocker ஆவணங்களை அரசு அலுவலகங்களில் ஏற்பார்களா?",
                "முகவரி சான்றுக்கு ரேஷன் கார்டு இல்லையெனில் மாற்று என்ன?"
            ]
        }
    return {
        "suggestions": [
            "What documents do I need for a Birth Certificate?",
            "What if I don't have my father's Community Certificate?",
            "How long is an Income Certificate valid?",
            "What is the official government fee at e-Seva?",
            "Can I use DigiLocker documents instead of originals?",
            "What can I use as address proof without a Ration Card?"
        ]
    }

@app.post("/api/chat")
async def chat_with_assistant(req: ChatRequest):
    """Conversational AI Assistant endpoint."""
    hist = [{"role": m.role, "content": m.content} for m in req.history] if req.history else []
    response = await assistant.query(
        user_message=req.message,
        history=hist,
        lang=req.language or "en",
        user_context=req.userContext or {}
    )
    return response

@app.post("/api/checklist/generate")
async def generate_checklist(req: ChecklistRequest):
    """Generate custom tailored checklist for specific citizen situation."""
    result = generate_custom_checklist(req.dict())
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# --- Static Files Mount (All-in-One Application) ---
# Root directory of the project
STATIC_DIR = Path(__file__).resolve().parent.parent

# Serve static files (index.html, styles.css, js/, etc.)
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    print(f"Starting DocMate AI Backend on http://127.0.0.1:{port}...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
