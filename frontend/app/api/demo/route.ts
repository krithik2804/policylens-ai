import { NextResponse } from "next/server";
import { DEMO_POLICIES, buildComparison } from "@/lib/mockData";

export async function GET() {
  const comparison = buildComparison(DEMO_POLICIES);
  return NextResponse.json(comparison);
}
