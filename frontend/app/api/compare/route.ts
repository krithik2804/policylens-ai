import { NextRequest, NextResponse } from "next/server";
import { DEMO_POLICIES, buildComparison } from "@/lib/mockData";
import { buildDynamicComparison } from "@/lib/pdfExtractor";
import { PolicyExtraction } from "@/types";
import { POLICY_STORE } from "../upload/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { policy_ids, user_profile, policies: passedPolicies } = body;

    if (!policy_ids || !Array.isArray(policy_ids) || policy_ids.length < 2) {
      return NextResponse.json(
        { detail: "Please provide at least 2 policy IDs to compare." },
        { status: 400 }
      );
    }

    // Try forwarding to local FastAPI backend if reachable
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const backendRes = await fetch(`${backendUrl}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_ids, user_profile }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running -> Process locally
    }

    // 1. Check if policies were directly passed in the payload
    let targetPolicies: PolicyExtraction[] = [];
    if (passedPolicies && Array.isArray(passedPolicies) && passedPolicies.length >= 2) {
      targetPolicies = passedPolicies;
    } else {
      // 2. Check POLICY_STORE cache
      targetPolicies = policy_ids
        .map((pid: string) => POLICY_STORE.get(pid))
        .filter((p): p is PolicyExtraction => !!p);

      // 3. Check DEMO_POLICIES if IDs are policy_a, policy_b, policy_c
      if (targetPolicies.length < 2) {
        const demoMatches = DEMO_POLICIES.filter((p) => policy_ids.includes(p.id));
        if (demoMatches.length >= 2) {
          targetPolicies = demoMatches;
        }
      }
    }

    if (targetPolicies.length < 2) {
      // If we still don't have enough, use DEMO_POLICIES only if demo IDs were asked for
      if (policy_ids.some((id: string) => id.startsWith("policy_"))) {
        targetPolicies = DEMO_POLICIES.slice(0, Math.min(policy_ids.length, 3));
      } else {
        return NextResponse.json(
          { detail: "Could not find extracted policy data for comparison." },
          { status: 404 }
        );
      }
    }

    // Check if these are demo policies
    const isAllDemo = targetPolicies.every((p) => p.is_demo);
    if (isAllDemo) {
      const comparison = buildComparison(targetPolicies, user_profile);
      return NextResponse.json(comparison);
    }

    // Build dynamic comparison matrix and factual summary for custom policies
    const comparison = buildDynamicComparison(targetPolicies, user_profile);
    return NextResponse.json(comparison);
  } catch (err: any) {
    console.error("Compare error:", err);
    return NextResponse.json({ detail: err.message || "Failed to compare policies" }, { status: 500 });
  }
}
