import os
import datetime
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    TIMESTAMP,
    ForeignKey,
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("DATABASE_URL not set in environment variables")
    raise RuntimeError("DATABASE_URL is required")

logger.info(f"Using database URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Models
class Playbook(Base):
    __tablename__ = "playbooks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    upload_time = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    documents = relationship("Document", back_populates="playbook")


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    upload_time = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    status = Column(String, default="pending")
    playbook_id = Column(Integer, ForeignKey("playbooks.id"), nullable=True)
    playbook = relationship("Playbook", back_populates="documents")
    reviews = relationship("ReviewResult", back_populates="document")


class ReviewResult(Base):
    __tablename__ = "review_results"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    conflicts = Column(Text)
    gaps = Column(Text)
    irrelevant = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    document = relationship("Document", back_populates="reviews")


# Schemas
class PlaybookCreate(BaseModel):
    name: str
    content: str


class PlaybookResponse(BaseModel):
    id: int
    name: str
    content: str
    upload_time: datetime.datetime

    class Config:
        orm_mode = True


class DocumentCreate(BaseModel):
    name: str
    content: str
    playbook_id: int


class DocumentResponse(BaseModel):
    id: int
    name: str
    content: str
    upload_time: datetime.datetime
    status: str
    playbook_id: Optional[int]

    class Config:
        orm_mode = True


class ReviewResultCreate(BaseModel):
    document_id: int
    conflicts: str
    gaps: str
    irrelevant: str


class ReviewResultResponse(BaseModel):
    id: int
    document_id: int
    conflicts: str
    gaps: str
    irrelevant: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True


# FastAPI app setup
app = FastAPI(title="AI Redliner - All-in-One App")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # development frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Routes

@app.get("/")
def root():
    return {"message": "Welcome to AI Redliner API"}


# Playbook Endpoints
@app.post("/playbooks/", response_model=PlaybookResponse)
def create_playbook(playbook: PlaybookCreate, db: Session = Depends(get_db)):
    new_playbook = Playbook(**playbook.dict())
    db.add(new_playbook)
    db.commit()
    db.refresh(new_playbook)
    logger.info(f"Created playbook with id {new_playbook.id}")
    return new_playbook


@app.get("/playbooks/", response_model=list[PlaybookResponse])
def get_all_playbooks(db: Session = Depends(get_db)):
    playbooks = db.query(Playbook).all()
    logger.info(f"Fetched {len(playbooks)} playbooks")
    return playbooks


@app.put("/playbooks/{playbook_id}", response_model=PlaybookResponse)
def update_playbook(playbook_id: int, playbook_update: PlaybookCreate, db: Session = Depends(get_db)):
    playbook = db.query(Playbook).filter(Playbook.id == playbook_id).first()
    if not playbook:
        logger.error(f"Playbook not found with id {playbook_id}")
        raise HTTPException(status_code=404, detail="Playbook not found")
    playbook.name = playbook_update.name
    playbook.content = playbook_update.content
    db.commit()
    db.refresh(playbook)
    logger.info(f"Updated playbook with id {playbook_id}")
    return playbook


@app.delete("/playbooks/{playbook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playbook(playbook_id: int, db: Session = Depends(get_db)):
    playbook = db.query(Playbook).filter(Playbook.id == playbook_id).first()
    if not playbook:
        logger.error(f"Playbook not found with id {playbook_id}")
        raise HTTPException(status_code=404, detail="Playbook not found")
    db.delete(playbook)
    db.commit()
    logger.info(f"Deleted playbook with id {playbook_id}")
    return


# Document Endpoints
@app.post("/documents/", response_model=DocumentResponse)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    if not db.query(Playbook).filter(Playbook.id == document.playbook_id).first():
        logger.error(f"Playbook not found with id {document.playbook_id}")
        raise HTTPException(status_code=404, detail="Playbook not found")
    new_document = Document(**document.dict())
    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    logger.info(f"Created document with id {new_document.id}")
    return new_document


@app.get("/documents/", response_model=list[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    logger.info(f"Fetched {len(docs)} documents")
    return docs


# Review Endpoints
@app.post("/reviews/", response_model=ReviewResultResponse)
def submit_review(result: ReviewResultCreate, db: Session = Depends(get_db)):
    if not db.query(Document).filter(Document.id == result.document_id).first():
        logger.error(f"Document not found with id {result.document_id}")
        raise HTTPException(status_code=404, detail="Document not found")
    review = ReviewResult(**result.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    logger.info(f"Created review with id {review.id} for document {result.document_id}")
    return review


@app.get("/reviews/", response_model=list[ReviewResultResponse])
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(ReviewResult).all()
    logger.info(f"Fetched {len(reviews)} reviews")
    return reviews


# Import your RAG engine analyze function here
from rag_engine import analyze_document_with_playbook


@app.post("/analyze/{document_id}")
async def analyze_document(document_id: int, db: Session = Depends(get_db)):
    logger.info(f"Starting analysis for document_id: {document_id}")
    
    try:
        # Get document and verify it exists
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            logger.error(f"Document not found: {document_id}")
            raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
        
        # Get playbook and verify it exists
        playbook = db.query(Playbook).filter(Playbook.id == document.playbook_id).first()
        if not playbook:
            logger.error(f"Playbook not found for document {document_id}: {document.playbook_id}")
            raise HTTPException(status_code=404, detail=f"Playbook {document.playbook_id} not found")
        
        if not document.content:
            logger.error(f"Document {document_id} has no content")
            raise HTTPException(status_code=400, detail="Document has no content")
            
        if not playbook.content:
            logger.error(f"Playbook {document.playbook_id} has no content")
            raise HTTPException(status_code=400, detail="Playbook has no content")

        # Run analysis
        logger.info(f"Running analysis for document {document_id} with playbook {playbook.id}")
        conflicts, gaps, irrelevant = await analyze_document_with_playbook(
            playbook.content, document.content
        )
        
        # Create review
        review = ReviewResult(
            document_id=document.id,
            conflicts=conflicts or "No conflicts found",
            gaps=gaps or "No gaps found",
            irrelevant=irrelevant or "No irrelevant content found"
        )
        
        # Save to database
        db.add(review)
        document.status = "reviewed"
        db.commit()
        db.refresh(review)
        
        logger.info(f"Analysis complete for document_id: {document_id}")
        
        return {
            "message": "Analysis complete",
            "review": {
                "conflicts": review.conflicts,
                "gaps": review.gaps,
                "irrelevant": review.irrelevant,
                "created_at": review.created_at
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        db.rollback()  # Rollback any partial changes
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/analyze/{document_id}")
def get_analysis(document_id: int, db: Session = Depends(get_db)):
    try:
        # Verify document exists first
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            logger.error(f"Document not found: {document_id}")
            raise HTTPException(status_code=404, detail=f"Document {document_id} not found")

        # Get latest review
        review = (
            db.query(ReviewResult)
            .filter(ReviewResult.document_id == document_id)
            .order_by(ReviewResult.created_at.desc())
            .first()
        )
        
        if not review:
            logger.error(f"Analysis not found for document_id: {document_id}")
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        logger.info(f"Fetched analysis for document_id: {document_id}")
        
        return {
            "message": "Analysis found",
            "review": {
                "conflicts": review.conflicts,
                "gaps": review.gaps,
                "irrelevant": review.irrelevant,
                "created_at": review.created_at,
                "document_id": review.document_id
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching analysis: {str(e)}")
