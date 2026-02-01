# 🎓 AcadIntel - AI-Powered Academic Intelligence Platform

> **Hackathon-Optimized Full-Stack Academic Management System**

AcadIntel is a source-verified academic intelligence system that helps college students generate exam-focused notes and answer keys using **trusted academic sources only** (previous year question papers, textbooks, reference books, and library data), while avoiding AI hallucinations.

## 🌟 Core Principles

✅ **AI-Powered** - Used for retrieval, ranking, structuring, and summarization  
✅ **Source-Verified** - NO fabricated or hallucinated answers  
✅ **Traceable** - Every answer must be traceable to a source  
✅ **Fallback Links** - If content unavailable locally, provides verified external links  
✅ **Stress-Free** - Designed for calm, focused studying

---

## 🚀 Quick Start

**Prerequisites:**  Node.js (v18 or higher) + Python 3.8+

### Option 1: Full Stack (Recommended)

Use the automated startup script:
```bash
start.bat  # Windows
```

This will:
1. Setup Python virtual environment
2. Install backend dependencies
3. Start backend server (http://localhost:8000)
4. Install frontend dependencies
5. Start frontend server (http://localhost:3000)

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
npm install
npm run dev
```

### Access & Demo
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Demo Login:** `2024-STUD-8821`

---

## 🎯 Key Features Implemented

### ✅ **1. Authentication & Student Detection**
- Login using Registration Number (QR code ready for future)
- Auto-detect: Department, Year, Regulation

### ✅ **2. Dashboard & Navigation**
- Sidebar-based navigation
- "➕ New Subject Notes" button
- ChatGPT-like workspace
- Clean, minimal UI

### ✅ **3. Subject Creation Flow**
- Input: Subject Name, Code, Regulation
- Dedicated workspace per subject

### ✅ **4. Subject Workspace**
- Question Papers with status tracking
- E-textbooks with reading progress
- Library status and availability
- AI Tutor for Q&A
- **Generate Notes/Answer Keys with Backend** 🆕

### ✅ **5. Library Management**
- Real-time book availability
- Location tracking
- Due date monitoring

### ✅ **6. AI Features**
- **Answer Key Generator (Backend Powered)** 🆕
  - Identifies repeated questions (3+ times)
  - Highlights high-weightage (10+ marks)
  - Retrieves exact answers from textbooks
  - Includes source citations
  - Provides external links if not found
  - Professional PDF output
- **Exam-Ready Notes (Backend Powered)** 🆕
  - Chapter-wise organization
  - Converts questions to topics
  - Structured study material
  - Key terms highlighting
  - Book-style PDF output
- AI Tutor with Gemini AI
- Mock data fallback

### ✅ **7. PDF Preview & Export**
- Professional preview
- Zoom controls (50-200%)
- Export settings
- A4 formatting
- Backend:** Python FastAPI + ReportLab 🆕  
**Styling:** Tailwind CSS  
**Routing:** React Router v7  
**AI:** Google Gemini AI  
**PDF Generation:** ReportLab (Python) 🆕
- Profile management
- Light/Dark theme
- Account settings

### ✅ **9. Backend API** 🆕
- FastAPI server
- Answer key generation endpoint
- Notes generation endpoint
- PDF download endpoint
- Demo textbook data
- ReportLab PDF creation

---

## 🏗️ Tech Stack

**Frontend:** React 19 + TypeScript + Vite  
**Styling:** Tailwind CSS  
**Routing:** React Router v7  
**AI:** Google Gemini AI  
**Icons:** Material Symbols  

---

## 📁 Project Structure

```
AcadIntel/
├── components/           # React components
│   ├── AIAssistantModal.tsx
│   ├── AITutorModal.tsx
│   ├── DashboardPage.tsx
│   ├── LibraryPage.tsx
│   ├── LoginPage.tsx
│   ├── NewSubjectPage.tsx
│   ├── PDFPreviewPage.tsx
│   ├── SettingsPage.tsx
│   ├── Sidebar.tsx
│   └── SubjectWorkspacePage.tsx
├── contexts/            # State management
│   └── AppContext.tsx
├── services/            # AI integration
│   └── geminiService.ts
├── App.tsx              # Main component
├── index.tsx            # Entry point
├── types.ts             # TypeScript types
└── package.json         # Dependencies
```

---

## 🎨 UI/UX Highlights

- **Premium Design:** Dark/Light themes with calm colors
- **Typography:** Lexend & Inter fonts for readability
- **Responsive:** Mobile-first approach
- **Smooth:** 200-300ms transitions
- **Accessible:** High contrast, keyboard navigation

---

## 🔧 Configuration

Create `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=AcadIntel
VITE_APP_VERSION=1.0.0
```

**Note:** Works with mock data without API key!

---

## 📝 Usage Guide

1. **Login:** Use `2024-STUD-8821`
2. **Create Subject:** Click "➕ New Subject Notes"
3. **Workspace:** Browse materials, use AI Tutor
4. **Generate:** Create answer keys and notes
5. **Settings:** Switch themes, manage profile

---

## 🚀 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 🧩 Consolidated Documentation

### Setup & Troubleshooting (Summary)

**Environment:**
- Node.js v18+ and Python 3.8+ are required.
- Add Gemini API key to `.env` as `VITE_GEMINI_API_KEY` and restart the dev server.
- Hash-based routing is used for static hosting (`#/path`).

**Common Issues:**
- Gemini key not working → verify at https://aistudio.google.com/app/apikey and restart dev server.
- Tailwind styles missing → ensure `index.css` is imported in `index.tsx` and dependencies installed.
- Vite env typing → handled via `vite-env.d.ts` for `import.meta.env`.

### QR Feature (Scanner + Generator)

**Scanner (New Subject):**
- Click **Scan QR Code** on New Subject page.
- Allow camera access and scan a QR code with subject JSON.

**Generator (Dashboard):**
- Click **Generate QR Code** on Dashboard.
- Fill subject details, generate, download or copy JSON.

**QR JSON Format:**
```json
{
  "name": "Subject Name",
  "code": "SUB-101",
  "regulation": "R-2021"
}
```

**Tech:** `html5-qrcode` (scanner), generator modal, and `qrCodeUtils.ts`.

### Backend API (FastAPI)

**Start Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Endpoints:**
- `POST /api/generate/answer-key`
- `POST /api/generate/notes`
- `GET /api/download/{filename}`
- `GET /api/demo/textbook`
- `GET /api/demo/questions`

**Backend Features:**
- Repeated question detection and high-weightage tagging
- Source citations from textbooks
- External fallback links for missing sources
- Professional PDF output (ReportLab)

### Demo Script (5 minutes)

**Flow:** Login → Dashboard → New Subject → Subject Workspace → AI Tutor → Generate Notes → Library → Settings.

**Key talking points:**
- Source-verified answers (no hallucinations)
- Professional PDFs with citations
- Stress-free UI and quick navigation

### Launch Checklist (Quick)

1. Start backend at http://localhost:8000
2. Start frontend at http://localhost:3000
3. Login with `2024-STUD-8821`
4. Generate notes/answer key to verify PDF download

---

## 🔮 Future Enhancements

- [ ] FastAPI backend
- [ ] PostgreSQL/MongoDB database
- [ ] FAISS vector store
- [ ] PDF ingestion pipeline
- [ ] RAG with LangChain
- [ ] Real authentication
- [ ] File upload
- [ ] Mobile app

---

## 🐛 Known Limitations

- Frontend-only (mock backend data)
- Single demo user
- No persistent storage
- No file upload processing

---

## 📄 License

MIT License - Free for educational use

---

**Built for Hackathon** - AcadIntel Team  
**Powered by:** React + TypeScript + Vite + Gemini AI

🌟 **Star this repo if you find it helpful!**
