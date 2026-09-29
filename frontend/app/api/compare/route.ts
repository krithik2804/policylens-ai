import { NextRequest, NextResponse } from "next/server";
import { DEMO_POLICIES, buildComparison } from "@/lib/mockData";
import { PolicyExtraction } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { policy_ids, user_profile } = body;

    if (!policy_ids || !Array.isArray(policy_ids) || policy_ids.length < 2) {
      return NextResponse.json(
        { detail: "Please provide at least 2 policy IDs to compare." },
        { status: 400 }
      );
    }

    const selected = DEMO_POLICIES.filter((p) => policy_ids.includes(p.id));
    const comparison = buildComparison(
      selected.length >= 2 ? selected : DEMO_POLICIES.slice(0, 2),
      user_profile
    );

    return NextResponse.json(comparison);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
