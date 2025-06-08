# 🧠 AI Redliner – Automated Legal Document Review

**AI Redliner** is an AI-powered legal assistant designed to automate document review against compliance playbooks. It redlines conflicts, highlights gaps, and flags irrelevant or missing content—reducing manual review time from hours to minutes.

---

## 🚀 Features

- 📄 Upload and manage compliance playbooks  
- 📁 Analyze documents for rule violations or missing sections  
- 🔍 Highlights conflicts, gaps, and irrelevant content  
- ⚡ Built using Retrieval-Augmented Generation (RAG)  
- 📊 Generates structured markdown reports for quick correction  

---

## 🛠️ Tech Stack

**Frontend**:  
- Next.js  
- Tailwind CSS

**Backend**:  
- FastAPI

**Database**:  
- PostgreSQL

**AI/ML**:  
- Groq API (via [Groq Cloud Console](https://console.groq.com/))  
- Sentence-Transformers (`all-mpnet-base-v2`)  
- FAISS (for semantic search and similarity retrieval)

**NLP**:  
- spaCy (for semantic text splitting and pre-processing)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-redliner.git
cd ai-redliner
````

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

#### ✅ Create a `.env` file inside the `backend` directory:

```env
GROQ_CLOUD_API_KEY=your_groq_api_key_here
```

> 🔐 Replace `your_groq_api_key_here` with your actual key from [https://console.groq.com](https://console.groq.com)

#### ▶️ Run the backend server

```bash
uvicorn main:app --reload
```

This starts your FastAPI server on `http://localhost:8000`.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser to view the frontend.

---

📈 **Use Case**
Legal teams can dramatically reduce time spent on policy compliance checks by automating the comparison of internal rules with incoming documents.
AI Redliner ensures audit-readiness, reduces errors, and enables faster decision-making with structured, AI-generated redline reports.

