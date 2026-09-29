import { NextRequest, NextResponse } from "next/server";
import { DEMO_POLICIES } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const { policy_id, question } = await req.json();
    const policy = DEMO_POLICIES.find((p) => p.id === policy_id) || DEMO_POLICIES[0];
    const qLower = (question || "").toLowerCase();

    // 1. Waiting period question
    if (qLower.includes("waiting period") || qLower.includes("waiting time")) {
      if (policy.waiting_period === "UNCLEAR") {
        return NextResponse.json({
          policy_id: policy.id,
          question,
          answer:
            "No explicit waiting-period clause was found in the provided policy document. As per strict PolicyLens verification, this term is marked UNCLEAR.",
          evidence_quote: null,
          page: null,
          section: null,
          source_document: policy.filename,
          found: false,
        });
      }
      const ev = policy.evidence_map.waiting_period;
      return NextResponse.json({
        policy_id: policy.id,
        question,
        answer: `The stated waiting period is ${policy.waiting_period}.`,
        evidence_quote: ev?.quote,
        page: ev?.page || 2,
        section: ev?.section || "SECTION 3. WAITING PERIOD",
        source_document: policy.filename,
        found: true,
      });
    }

    // 2. Coverage question
    if (
      qLower.includes("coverage") ||
      qLower.includes("hospitalization") ||
      qLower.includes("sum insured") ||
      qLower.includes("cover")
    ) {
      const ev = policy.evidence_map.coverage;
      return NextResponse.json({
        policy_id: policy.id,
        question,
        answer: `This policy provides ${policy.coverage} in total coverage for in-patient hospitalization expenses.`,
        evidence_quote: ev?.quote,
        page: ev?.page || 1,
        section: ev?.section || "SECTION 1. SCOPE OF COVERAGE",
        source_document: policy.filename,
        found: true,
      });
    }

    // 3. Exclusions question
    if (qLower.includes("exclusion") || qLower.includes("not covered")) {
      const firstEx = policy.major_exclusions_detailed[0];
      const itemsStr = policy.major_exclusions_detailed.map((e) => e.item).join(", ");
      return NextResponse.json({
        policy_id: policy.id,
        question,
        answer: `Identified major exclusions include: ${itemsStr}.`,
        evidence_quote: firstEx.quote,
        page: firstEx.page,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS",
        source_document: policy.filename,
        found: true,
      });
    }

    // 4. Premium question
    if (qLower.includes("premium") || qLower.includes("cost") || qLower.includes("price")) {
      const ev = policy.evidence_map.premium;
      return NextResponse.json({
        policy_id: policy.id,
        question,
        answer: `The annual premium for this policy is ${policy.premium}.`,
        evidence_quote: ev?.quote,
        page: ev?.page || 1,
        section: ev?.section || "SECTION 2. PREMIUM SCHEDULE",
        source_document: policy.filename,
        found: true,
      });
    }

    // 5. Deductible question
    if (qLower.includes("deductible") || qLower.includes("copay")) {
      const ev = policy.evidence_map.deductible;
      return NextResponse.json({
        policy_id: policy.id,
        question,
        answer: `The applicable deductible is ${policy.deductible}.`,
        evidence_quote: ev?.quote,
        page: ev?.page || 2,
        section: ev?.section || "SECTION 4. DEDUCTIBLE",
        source_document: policy.filename,
        found: true,
      });
    }

    // Default: Unfound clause (do NOT hallucinate)
    return NextResponse.json({
      policy_id: policy.id,
      question,
      answer: "I couldn't find an explicit clause in the provided document.",
      evidence_quote: null,
      page: null,
      section: null,
      source_document: policy.filename,
      found: false,
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
