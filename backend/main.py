from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to call backend (CORS policy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Redliner backend is running"}

@app.post("/upload-playbook")
async def upload_playbook(file: UploadFile = File(...)):
    content = await file.read()
    # For now, just return the content size
    return {"filename": file.filename, "size": len(content)}

@app.post("/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    content = await file.read()
    # Placeholder response
    return {"filename": file.filename, "analysis": "To be implemented"}
