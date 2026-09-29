"""
PolicyLens AI - FastAPI Application
Backend server providing PDF extraction, evidence verification,
strict UNCLEAR handling, side-by-side comparison, and grounded Q&A.
"""
import os
import uuid
import shutil
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.models.schemas import (
    PolicyExtraction, Evidence, UserProfile,
    CompareRequest, CompareResponse, AskRequest, AskResponse
)
from backend.services.extractor_service import PolicyExtractor, build_comparison_summary
from backend.services.pdf_service import parse_pdf, PDFDocument
from backend.services.qa_service import PolicyQAService
from backend.services.mock_pdf_generator import generate_all_mock_policies


app = FastAPI(
    title="PolicyLens AI API",
    description="Evidence-backed insurance policy comparison agent",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
POLICIES_DIR = os.path.join(DATA_DIR, "policies")
UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")

os.makedirs(POLICIES_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# In-memory store for loaded policies during session
POLICY_STORE: Dict[str, PolicyExtraction] = {}
PDF_PATHS: Dict[str, str] = {}

extractor = PolicyExtractor()
qa_service = PolicyQAService()


def ensure_demo_policies():
    """Ensure the 3 mock PDFs are generated and extracted into store."""
    paths = generate_all_mock_policies(POLICIES_DIR)

    demo_configs = [
        ("policy_a", "Policy_A_SecureCare_Essential.pdf", paths["policy_a"]),
        ("policy_b", "Policy_B_HealthShield_Student_Plus.pdf", paths["policy_b"]),
        ("policy_c", "Policy_C_MediSure_Basic_Care.pdf", paths["policy_c"])
    ]

    for pid, fname, fpath in demo_configs:
        PDF_PATHS[pid] = fpath
        p_ext = extractor.extract_from_pdf(fpath, pid, fname, is_demo=True)
        POLICY_STORE[pid] = p_ext


@app.on_event("startup")
async def startup_event():
    ensure_demo_policies()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PolicyLens AI",
        "policies_loaded": len(POLICY_STORE),
        "demo_ready": "policy_c" in POLICY_STORE
    }


@app.get("/api/demo")
def get_demo_data():
    """Returns the preloaded mock policies A, B, and C."""
    ensure_demo_policies()
    pA = POLICY_STORE["policy_a"]
    pB = POLICY_STORE["policy_b"]
    pC = POLICY_STORE["policy_c"]

    summary_pts = build_comparison_summary([pA, pB, pC])

    matrix = build_feature_matrix([pA, pB, pC])

    return {
        "policies": [pA, pB, pC],
        "summary_points": summary_pts,
        "feature_matrix": matrix
    }


@app.post("/api/upload")
async def upload_policies(files: List[UploadFile] = File(...)):
    """
    Accepts 2 to 3 PDF policy documents.
    Validates PDF format and reasonable file size.
    """
    if len(files) < 2 or len(files) > 3:
        raise HTTPException(
            status_code=400,
            detail="Please upload between 2 and 3 policy PDF documents."
        )

    uploaded_results = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file '{file.filename}'. Only PDF documents are supported."
            )

        policy_id = f"custom_{uuid.uuid4().hex[:8]}"
        saved_filename = f"{policy_id}_{file.filename}"
        file_path = os.path.join(UPLOADS_DIR, saved_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Validate file size (max 25MB)
        size = os.path.getsize(file_path)
        if size > 25 * 1024 * 1024:
            os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail=f"File '{file.filename}' exceeds maximum allowed size of 25MB."
            )

        PDF_PATHS[policy_id] = file_path

        # Perform extraction immediately
        extracted = extractor.extract_from_pdf(
            file_path=file_path,
            policy_id=policy_id,
            original_filename=file.filename,
            is_demo=False
        )
        POLICY_STORE[policy_id] = extracted

        uploaded_results.append({
            "id": policy_id,
            "filename": file.filename,
            "size_kb": round(size / 1024, 1),
            "status": "ready",
            "policy": extracted
        })

    return {
        "message": f"Successfully uploaded and extracted {len(uploaded_results)} policies.",
        "policies": uploaded_results
    }


@app.post("/api/compare", response_model=CompareResponse)
def compare_policies(req: CompareRequest):
    """
    Compares 2 or 3 policies side-by-side.
    Returns comparison matrix, neutral factual summary, and user profile mapping.
    """
    if len(req.policy_ids) < 2 or len(req.policy_ids) > 3:
        raise HTTPException(status_code=400, detail="Comparison requires 2 or 3 policies.")

    selected_policies: List[PolicyExtraction] = []
    for pid in req.policy_ids:
        if pid not in POLICY_STORE:
            # Check if it's one of demo policies
            ensure_demo_policies()
            if pid not in POLICY_STORE:
                raise HTTPException(status_code=404, detail=f"Policy ID '{pid}' not found.")
        selected_policies.append(POLICY_STORE[pid])

    summary_pts = build_comparison_summary(selected_policies)
    neutral_sum = "\n".join([f"• {pt}" for pt in summary_pts])

    matrix = build_feature_matrix(selected_policies, req.user_profile)

    return CompareResponse(
        policies=selected_policies,
        user_profile=req.user_profile,
        summary_points=summary_pts,
        neutral_summary=neutral_sum,
        feature_matrix=matrix
    )


@app.get("/api/policy/{policy_id}", response_model=PolicyExtraction)
def get_policy_detail(policy_id: str):
    if policy_id not in POLICY_STORE:
        ensure_demo_policies()
        if policy_id not in POLICY_STORE:
            raise HTTPException(status_code=404, detail="Policy not found.")
    return POLICY_STORE[policy_id]


@app.get("/api/pdf/{policy_id}")
def get_policy_pdf(policy_id: str):
    if policy_id not in PDF_PATHS:
        ensure_demo_policies()
        if policy_id not in PDF_PATHS:
            raise HTTPException(status_code=404, detail="PDF document file not found.")

    path = PDF_PATHS[policy_id]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="PDF document file missing on disk.")

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=os.path.basename(path),
        content_disposition_type="inline"
    )


@app.post("/api/ask", response_model=AskResponse)
def ask_policy(req: AskRequest):
    """
    Answers questions grounded in the policy document.
    Always includes quote and page number citations.
    If clause not found: 'I couldn't find an explicit clause in the provided document.'
    """
    if req.policy_id not in POLICY_STORE:
        ensure_demo_policies()
        if req.policy_id not in POLICY_STORE:
            raise HTTPException(status_code=404, detail="Policy not found.")

    policy = POLICY_STORE[req.policy_id]
    pdf_path = PDF_PATHS.get(req.policy_id)

    if not pdf_path or not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Policy PDF document not accessible.")

    doc = parse_pdf(pdf_path)
    return qa_service.answer_question(doc, policy, req.question)


def build_feature_matrix(policies: List[PolicyExtraction], user_profile: Optional[UserProfile] = None) -> List[Dict[str, Any]]:
    """Builds side-by-side comparison matrix with priority tagging."""
    priorities = [p.lower() for p in (user_profile.priorities if user_profile else [])]

    rows = [
        {
            "key": "coverage",
            "label": "Sum Insured / Coverage",
            "is_priority": any("cover" in p for p in priorities),
            "values": {
                p.id: {
                    "value": p.coverage,
                    "is_unclear": p.coverage == "UNCLEAR",
                    "evidence": p.evidence_map.get("coverage").dict() if p.evidence_map.get("coverage") else None
                } for p in policies
            }
        },
        {
            "key": "waiting_period",
            "label": "Waiting Period",
            "is_priority": any("wait" in p for p in priorities),
            "values": {
                p.id: {
                    "value": p.waiting_period,
                    "is_unclear": p.waiting_period == "UNCLEAR",
                    "evidence": p.evidence_map.get("waiting_period").dict() if p.evidence_map.get("waiting_period") else None
                } for p in policies
            }
        },
        {
            "key": "premium",
            "label": "Annual Premium",
            "is_priority": any("prem" in p or "budget" in p for p in priorities),
            "values": {
                p.id: {
                    "value": p.premium,
                    "is_unclear": p.premium == "UNCLEAR",
                    "evidence": p.evidence_map.get("premium").dict() if p.evidence_map.get("premium") else None
                } for p in policies
            }
        },
        {
            "key": "exclusions",
            "label": "Major Exclusions",
            "is_priority": any("exclu" in p for p in priorities),
            "values": {
                p.id: {
                    "value": f"{len(p.major_exclusions_detailed)} key exclusions" if p.major_exclusions_detailed else p.exclusions[0] if p.exclusions else "Standard Exclusions",
                    "items": [e.item for e in p.major_exclusions_detailed[:4]],
                    "is_unclear": False,
                    "evidence": p.evidence_map.get("exclusions").dict() if p.evidence_map.get("exclusions") else None
                } for p in policies
            }
        },
        {
            "key": "deductible",
            "label": "Compulsory Deductible",
            "is_priority": False,
            "values": {
                p.id: {
                    "value": p.deductible,
                    "is_unclear": p.deductible == "UNCLEAR",
                    "evidence": p.evidence_map.get("deductible").dict() if p.evidence_map.get("deductible") else None
                } for p in policies
            }
        },
        {
            "key": "claim_conditions",
            "label": "Claim Notice Conditions",
            "is_priority": any("claim" in p for p in priorities),
            "values": {
                p.id: {
                    "value": p.claim_conditions,
                    "is_unclear": p.claim_conditions == "UNCLEAR",
                    "evidence": p.evidence_map.get("claim_conditions").dict() if p.evidence_map.get("claim_conditions") else None
                } for p in policies
            }
        },
        {
            "key": "important_limitations",
            "label": "Important Limitations",
            "is_priority": False,
            "values": {
                p.id: {
                    "value": p.important_limitations,
                    "is_unclear": p.important_limitations == "UNCLEAR",
                    "evidence": p.evidence_map.get("important_limitations").dict() if p.evidence_map.get("important_limitations") else None
                } for p in policies
            }
        }
    ]

    return rows
