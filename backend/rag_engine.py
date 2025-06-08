import os
import logging
import spacy
import faiss
import httpx
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from fastapi import HTTPException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_CLOUD_API_KEY")
if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY not found in environment variables")

# Load spaCy model for sentence segmentation
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Load embedding model
embedding_model = SentenceTransformer("all-mpnet-base-v2")

def split_text(text, max_tokens=500):
    """
    Splits text into semantically coherent chunks using spaCy.
    """
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    chunks = []
    current_chunk = ""
    current_tokens = 0

    for sentence in sentences:
        sentence_tokens = len(sentence.split())
        if current_tokens + sentence_tokens <= max_tokens:
            current_chunk += " " + sentence
            current_tokens += sentence_tokens
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
            current_tokens = sentence_tokens

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def build_faiss_index(chunks):
    """
    Builds a FAISS index from the provided text chunks.
    """
    try:
        embeddings = embedding_model.encode(chunks, convert_to_numpy=True)
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(embeddings)
        return index, embeddings, chunks
    except Exception as e:
        logger.error(f"Error building FAISS index: {e}")
        raise

def get_top_k_chunks(index, chunks, embeddings, query, k=5):
    """
    Retrieves the top-k most similar chunks to the query.
    """
    try:
        query_embedding = embedding_model.encode([query], convert_to_numpy=True)
        distances, indices = index.search(query_embedding, k)
        return [chunks[i] for i in indices[0]]
    except Exception as e:
        logger.error(f"Error retrieving top-k chunks: {e}")
        raise

def parse_groq_response(text):
    conflicts = gaps = irrelevant = ""
    try:
        sections = text.split('\n- ')
        for section in sections:
            lower = section.lower()
            if "conflicts" in lower:
                conflicts = section.split(':',1)[-1].strip()
            elif "gaps" in lower:
                gaps = section.split(':',1)[-1].strip()
            elif "irrelevant" in lower:
                irrelevant = section.split(':',1)[-1].strip()
    except Exception as e:
        logger.warning(f"Parsing Groq response failed: {e}")
    return conflicts, gaps, irrelevant

async def analyze_document_with_playbook(playbook_text, doc_text):
    """
    Analyzes the document against the playbook and identifies conflicts, gaps, and irrelevant content
    """
    if not playbook_text or not doc_text:
        raise HTTPException(status_code=400, detail="Both playbook and document content are required")
        
    try:
        # Split playbook into semantically coherent chunks
        chunks = split_text(playbook_text)
        logger.info(f"Split playbook into {len(chunks)} chunks.")

        # Build FAISS index
        index, embeddings, raw_chunks = build_faiss_index(chunks)
        logger.info("Built FAISS index.")

        # Retrieve top-k relevant chunks based on document text
        top_chunks = get_top_k_chunks(index, raw_chunks, embeddings, doc_text)
        logger.info("Retrieved top-k relevant chunks.")

        # Compose the context for prompt
        context = "\n\n".join(top_chunks)
        
        # Make API request and parse response
        generated_text = await make_llm_request(context, doc_text)
        logger.info("Received response from LLM API")

        # Parse structured markdown response
        conflicts, gaps, irrelevant = parse_groq_response(generated_text)
        
        if not any([conflicts, gaps, irrelevant]):
            logger.warning("No analysis results found in LLM response")
            
        return conflicts, gaps, irrelevant

    except Exception as e:
        logger.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
