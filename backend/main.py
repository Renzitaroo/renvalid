from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from backend.config import GEMINI_API_KEY, DEFAULT_MODEL
from backend.core.verifier import verify_claim
from backend.retrieval.url_scraper import extract_text_from_url
from backend.multimodal.vision import extract_claim_from_image

app = FastAPI(title="RenValid API", version="1.0.0")

# Enable CORS for React Vite frontend (usually runs on port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerifyRequest(BaseModel):
    claim: str
    model: Optional[str] = DEFAULT_MODEL
    api_key: Optional[str] = None

class ScrapeRequest(BaseModel):
    url: str

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RenValid Fact-Check Engine",
        "model": DEFAULT_MODEL
    }

@app.post("/api/verify")
def api_verify(req: VerifyRequest):
    if not req.claim.strip():
        raise HTTPException(status_code=400, detail="Klaim tidak boleh kosong.")
    try:
        result = verify_claim(
            claim=req.claim.strip(),
            api_key=req.api_key or GEMINI_API_KEY,
            model=req.model or DEFAULT_MODEL
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scrape-url")
def api_scrape(req: ScrapeRequest):
    if not req.url.strip():
        raise HTTPException(status_code=400, detail="URL tidak boleh kosong.")
    try:
        article_data = extract_text_from_url(req.url.strip())
        return article_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/scan-image")
async def api_scan_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        mime_type = file.content_type or "image/jpeg"
        extracted_text = extract_claim_from_image(
            image_bytes=contents,
            mime_type=mime_type,
            api_key=GEMINI_API_KEY,
            model=DEFAULT_MODEL
        )
        return {"extracted_claim": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
