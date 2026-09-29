# PolicyLens AI 🔍🛡️

> **"Understand your insurance policy before you pay."**
> Evidence-backed insurance policy comparison agent with zero hallucinations and exact PDF citations.

---

## 🏆 Hackathon Demo Moment: The "UNCLEAR" Principle

Most people purchasing insurance policies compare only the headline price. Critical details—such as **waiting periods, room rent sub-limits, exclusions, and claim notice procedures**—are buried in multi-page policy PDFs, often leading to unexpected claim rejections.

Generic AI chatbots hallucinate or "guess" standard insurance terms when a document is silent. **PolicyLens AI solves this with strict evidence grounding:**

- **If a required clause exists in the PDF:** The value is extracted and backed by an **exact verbatim sentence**, the **exact page number**, and the **section title**.
- **If a required clause is missing from the PDF:** The application **strictly returns "UNCLEAR"** with the explanation:
  > *"No explicit clause was found in the provided policy document."*
- **PolicyLens NEVER infers, guesses, or fabricates policy terms.**

### The 3 Mock Demo Policies

1. **Policy A: SecureCare Essential Health Plan**
   - *Sum Insured:* Rs. 5,00,000 | *Annual Premium:* Rs. 8,500
   - *Waiting Period:* **30 days** (Found on **Page 2**, Section 3)
   - *Evidence:* `"A waiting period of 30 days applies to illnesses from policy inception, except in cases of emergency hospitalization resulting directly from an accidental injury."`

2. **Policy B: HealthShield Student Plus**
   - *Sum Insured:* Rs. 10,00,000 | *Annual Premium:* Rs. 10,200
   - *Waiting Period:* **15 days** (Found on **Page 2**, Section 3)
   - *Evidence:* `"A preferential waiting period of 15 days applies for student healthcare admissions from the effective start date of coverage."`

3. **Policy C: MediSure Basic Care**
   - *Sum Insured:* Rs. 7,50,000 | *Annual Premium:* Rs. 7,500
   - *Waiting Period:* **UNCLEAR** ⚠️
   - *Quote:* `null` | *Page:* `null`
   - *Reason:* `"No explicit clause was found in the provided policy document."`
   - **Clicking the cell reveals the strict audit log and links directly to the original PDF to verify the clause absence.**

---

## 🚀 Key Features

1. **Requirement Profile (Screen 2):**
   - 3 essential questions: Customer Type (Myself, Student, Family, Parents), Priorities (Coverage, Waiting Period, Exclusions, Premium, Claim Conditions), and Target Budget.
   - Automatically tags and highlights matching priority rows in the comparison table.

2. **Drag-and-Drop PDF Upload (Screen 3):**
   - Upload 2 or 3 PDF policy documents with size validation (up to 25MB each).
   - Instant "Load 3 Demo Policies" button for zero-friction judging.

3. **Step-by-Step Animated Extraction (Screen 4):**
   - Real-time animated verification: Document loaded → Text extraction → Coverage → Waiting Periods → Exclusions → Premium → Evidence Verification.

4. **Side-by-Side Comparison Matrix (Screen 5):**
   - Full matrix comparing Coverage, Waiting Period, Major Exclusions, Premium, Deductibles, Claim Notice Procedures, and Treatment Sub-limits.
   - Distinctive amber **UNCLEAR** badge for missing clauses.

5. **Verbatim Evidence Panel:**
   - Clicking any cell opens the evidence panel displaying the exact quote, section heading, and page number, with an **Open Source PDF** button.

6. **Itemized Major Exclusions:**
   - Every exclusion is itemized individually with its own verbatim quote and page number (e.g., cosmetic surgery, infertility, non-medical items).

7. **Neutral Factual AI Summary:**
   - Concise, neutral summary points without sales opinions (strictly avoids *"Policy A is best"* or *"Choose B"*).

8. **Grounded AI Policy Q&A:**
   - Ask any question about a policy (e.g. *"What is the waiting period?"*).
   - Grounded in PDF text with page citations. For Policy C's waiting period, strictly states: *"No explicit waiting-period clause was found in the provided policy document."*

9. **Educational Boundary / Safety:**
   - Always displays: *"Educational comparison tool — not insurance advice, a quotation, or a licensed insurance sale."*

---

## 🛠️ Architecture & Tech Stack

```
policylens-ai/
├── backend/
│   ├── main.py                  # FastAPI application & REST endpoints
│   ├── models/schemas.py        # Pydantic data schemas
│   ├── services/
│   │   ├── pdf_service.py       # PyMuPDF text & page extraction + sentence locating
│   │   ├── extractor_service.py # Evidence extraction & strict UNCLEAR verification
│   │   ├── qa_service.py        # Grounded Q&A engine with citations
│   │   └── mock_pdf_generator.py# ReportLab generator for Policies A, B, and C
│   └── test_api.py              # Automated backend test suite
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Clean layout & metadata
│   │   ├── page.tsx             # Master page controlling user flow
│   │   └── globals.css          # Tailwind CSS styling
│   ├── components/
│   │   ├── Navbar.tsx           # Header & demo trigger
│   │   ├── LandingHero.tsx      # Fintech hero & trust badges
│   │   ├── NeedQuestions.tsx    # 3 requirement questions
│   │   ├── UploadPolicies.tsx   # Drag-and-drop PDF uploader
│   │   ├── AnalysisProgress.tsx # Animated verification progression
│   │   ├── ComparisonDashboard.tsx # Side-by-side comparison table
│   │   ├── EvidenceModal.tsx    # Verbatim quote & page inspector
│   │   ├── PolicyDetailModal.tsx# Comprehensive single-policy breakdown
│   │   ├── PdfViewerModal.tsx   # Ground-truth PDF page viewer
│   │   └── AskPolicyDrawer.tsx  # Grounded Q&A chat drawer
│   ├── lib/api.ts               # Frontend API client
│   └── types/index.ts           # TypeScript interfaces
└── data/
    └── policies/                # Generated mock policy PDFs (A, B, C)
```

- **Frontend:** Next.js, React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Python 3.12, FastAPI, Uvicorn, PyMuPDF (`pymupdf`), ReportLab
- **Grounding Engine:** Verbatim sentence indexing, section detection, multi-page PDF citation verification.

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# From project root
python -m pip install fastapi uvicorn pymupdf reportlab pydantic python-multipart httpx

# Run automated test suite
python backend/test_api.py

# Start FastAPI server
uvicorn backend.main:app --reload --port 8000
```
Backend will run at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`.

---

## 🧪 Verification & Demo Walkthrough

1. Open `http://localhost:3000`.
2. Click **[ View Demo ]** (or **[ Compare Policies ]** → answer 3 questions → click **Load 3 Demo Policies**).
3. Watch the animated analysis verify all 3 policies.
4. On the comparison dashboard:
   - Check **Policy A Waiting Period**: `30 days` (p. 2)
   - Check **Policy B Waiting Period**: `15 days` (p. 2)
   - Check **Policy C Waiting Period**: ⚠️ **`UNCLEAR`**
5. **The Presentation Climax:** Click the **UNCLEAR** badge on Policy C.
   - Modal explains: *"No explicit clause was found in the provided policy document."*
   - Click **[ Open Source PDF ]** to inspect the authentic contract PDF and prove no waiting period exists.
6. Click **Ask PolicyLens AI** to test interactive Q&A grounded with citations.
