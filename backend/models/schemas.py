"""
Pydantic models for PolicyLens AI.
Enforces strict evidence grounding and UNCLEAR logic.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Evidence(BaseModel):
    field: str
    value: str
    quote: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    source_document: Optional[str] = None
    reason: Optional[str] = None


class ExtractedField(BaseModel):
    field: str
    label: str
    value: str
    confidence: str = "high"  # "high", "medium", "low", "unclear"
    evidence: Optional[Evidence] = None


class MajorExclusion(BaseModel):
    item: str
    quote: str
    page: int
    section: Optional[str] = None


class PolicyExtraction(BaseModel):
    id: str
    name: str
    insurer: str
    type: str
    coverage: str
    premium: str
    waiting_period: str
    exclusions: List[str] = []
    major_exclusions_detailed: List[MajorExclusion] = []
    deductible: str
    claim_conditions: str
    important_limitations: str
    is_demo: bool = False
    filename: str
    pdf_url: Optional[str] = None
    evidence_map: Dict[str, Evidence] = {}
    summary: Optional[str] = None
    page_count: int = 1


class UserProfile(BaseModel):
    customer_type: str = "Myself"
    priorities: List[str] = Field(default_factory=lambda: ["Coverage", "Waiting Period"])
    budget: str = "₹5,000–₹10,000"


class CompareRequest(BaseModel):
    policy_ids: List[str]
    user_profile: Optional[UserProfile] = None


class CompareResponse(BaseModel):
    policies: List[PolicyExtraction]
    user_profile: Optional[UserProfile] = None
    summary_points: List[str] = []
    neutral_summary: str
    feature_matrix: List[Dict[str, Any]] = []


class AskRequest(BaseModel):
    policy_id: str
    question: str


class AskResponse(BaseModel):
    policy_id: str
    question: str
    answer: str
    evidence_quote: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    source_document: Optional[str] = None
    found: bool = True
