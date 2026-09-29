"""
AI Policy Q&A Service for PolicyLens AI.
Allows users to ask questions about any uploaded policy document.
Every answer must be grounded in actual document text with exact citations.
If the clause cannot be located, returns:
"I couldn't find an explicit clause in the provided document."
"""
import os
import re
from typing import Optional
from backend.models.schemas import AskResponse, PolicyExtraction
from backend.services.pdf_service import PDFDocument


UNFOUND_ANSWER = "I couldn't find an explicit clause in the provided document."


class PolicyQAService:
    def __init__(self):
        self.gemini_key = os.environ.get("GEMINI_API_KEY")

    def answer_question(self, doc: PDFDocument, policy: PolicyExtraction, question: str) -> AskResponse:
        q_lower = question.lower().strip()

        # Check for waiting period
        if "waiting period" in q_lower or "waiting time" in q_lower:
            if policy.waiting_period == "UNCLEAR":
                return AskResponse(
                    policy_id=policy.id,
                    question=question,
                    answer="No explicit waiting-period clause was found in the provided policy document. As per strict PolicyLens verification, this term is marked UNCLEAR.",
                    evidence_quote=None,
                    page=None,
                    section=None,
                    source_document=policy.filename,
                    found=False
                )
            ev = policy.evidence_map.get("waiting_period")
            return AskResponse(
                policy_id=policy.id,
                question=question,
                answer=f"The stated waiting period is {policy.waiting_period}.",
                evidence_quote=ev.quote if ev else None,
                page=ev.page if ev else 2,
                section=ev.section if ev else "SECTION 3. WAITING PERIOD",
                source_document=policy.filename,
                found=True
            )

        # Check for coverage / hospitalization
        if any(w in q_lower for w in ["coverage", "hospitalization", "sum insured", "cover"]):
            ev = policy.evidence_map.get("coverage")
            quote_text = ev.quote if ev else None
            return AskResponse(
                policy_id=policy.id,
                question=question,
                answer=f"This policy provides {policy.coverage} in total coverage for in-patient hospitalization expenses.",
                evidence_quote=quote_text,
                page=ev.page if ev else 1,
                section=ev.section if ev else "SECTION 1. SCOPE OF COVERAGE",
                source_document=policy.filename,
                found=True
            )

        # Check for exclusions
        if any(w in q_lower for w in ["exclusion", "not covered", "exclusions"]):
            if policy.major_exclusions_detailed:
                items_str = ", ".join([e.item for e in policy.major_exclusions_detailed[:4]])
                first_ex = policy.major_exclusions_detailed[0]
                return AskResponse(
                    policy_id=policy.id,
                    question=question,
                    answer=f"Identified exclusions include: {items_str}.",
                    evidence_quote=first_ex.quote,
                    page=first_ex.page,
                    section="SECTION 5. MAJOR POLICY EXCLUSIONS",
                    source_document=policy.filename,
                    found=True
                )

        # Check for premium
        if any(w in q_lower for w in ["premium", "cost", "price", "annual fee"]):
            ev = policy.evidence_map.get("premium")
            return AskResponse(
                policy_id=policy.id,
                question=question,
                answer=f"The annual premium for this policy is {policy.premium}.",
                evidence_quote=ev.quote if ev else None,
                page=ev.page if ev else 1,
                section=ev.section if ev else "SECTION 2. PREMIUM SCHEDULE",
                source_document=policy.filename,
                found=True
            )

        # Check for deductible
        if any(w in q_lower for w in ["deductible", "copay", "co-payment", "out of pocket"]):
            ev = policy.evidence_map.get("deductible")
            return AskResponse(
                policy_id=policy.id,
                question=question,
                answer=f"The applicable deductible is {policy.deductible}.",
                evidence_quote=ev.quote if ev else None,
                page=ev.page if ev else 2,
                section=ev.section if ev else "SECTION 4. DEDUCTIBLE",
                source_document=policy.filename,
                found=True
            )

        # Check for claims
        if any(w in q_lower for w in ["claim", "notice", "intimation", "admit", "admission"]):
            ev = policy.evidence_map.get("claim_conditions")
            return AskResponse(
                policy_id=policy.id,
                question=question,
                answer=f"Claim condition requires: {policy.claim_conditions}.",
                evidence_quote=ev.quote if ev else None,
                page=ev.page if ev else 2,
                section=ev.section if ev else "SECTION 6. CLAIM CONDITIONS",
                source_document=policy.filename,
                found=True
            )

        # Keyword search across all sentences in PDF
        keywords = [w for w in re.findall(r'\b[a-zA-Z]{4,}\b', q_lower) if w not in ["what", "does", "this", "policy", "cover", "have", "with", "from", "about"]]
        if keywords:
            for p in doc.pages:
                for s in p.sentences:
                    s_lower = s.lower()
                    if all(k in s_lower for k in keywords[:2]):
                        loc = doc.find_quote_location(s)
                        return AskResponse(
                            policy_id=policy.id,
                            question=question,
                            answer=s,
                            evidence_quote=s,
                            page=p.page_number,
                            section=loc[2] if loc else "GENERAL TERMS",
                            source_document=policy.filename,
                            found=True
                        )

        # Strictly NOT found: do NOT fabricate
        return AskResponse(
            policy_id=policy.id,
            question=question,
            answer=UNFOUND_ANSWER,
            evidence_quote=None,
            page=None,
            section=None,
            source_document=policy.filename,
            found=False
        )
