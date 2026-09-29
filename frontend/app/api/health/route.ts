import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "PolicyLens AI",
    runtime: "Next.js Edge/Serverless",
    demo_ready: true,
  });
}
