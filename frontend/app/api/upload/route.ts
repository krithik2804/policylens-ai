import { NextRequest, NextResponse } from "next/server";
import { extractPolicyFromPdf } from "@/lib/pdfExtractor";
import { PolicyExtraction } from "@/types";

// In-memory policy cache for the Next.js runtime
export const POLICY_STORE = new Map<string, PolicyExtraction>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2 || files.length > 3) {
      return NextResponse.json(
        { detail: "Please upload between 2 and 3 policy PDF documents." },
        { status: 400 }
      );
    }

    // Try forwarding to local FastAPI backend if reachable in local dev
    const isVercel = !!process.env.VERCEL;
    const backendUrl = process.env.BACKEND_URL || (!isVercel && process.env.NODE_ENV === "development" ? "http://localhost:8000" : undefined);
    if (backendUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const fwdFormData = new FormData();
        files.forEach((file) => fwdFormData.append("files", file));

        const backendRes = await fetch(`${backendUrl}/api/upload`, {
          method: "POST",
          body: fwdFormData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.policies && Array.isArray(data.policies) && data.policies.length >= 2) {
          // Store in local cache as well
          data.policies.forEach((item: any) => {
            if (item.policy) {
              POLICY_STORE.set(item.id, item.policy);
            }
          });
          return NextResponse.json(data);
        }
      } else {
        const errData = await backendRes.json().catch(() => ({}));
        if (errData.detail) {
          return NextResponse.json({ detail: errData.detail }, { status: backendRes.status });
        }
      }
    } catch (err: any) {
      // Backend not running or timeout -> Fallback to built-in TypeScript PDF extractor
    }
  }

    // Process files with TypeScript PDF Extractor (Works everywhere including Vercel!)
    const uploadedResults = [];

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const customId = `custom_${Date.now()}_${idx}_${file.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20)}`;
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      // Extract real policy data dynamically from uploaded PDF
      const extracted = await extractPolicyFromPdf(uint8, file.name, customId);
      POLICY_STORE.set(customId, extracted);

      uploadedResults.push({
        id: customId,
        filename: file.name,
        size_kb: Math.round(file.size / 1024),
        status: "ready",
        policy: extracted,
      });
    }

    return NextResponse.json({
      message: `Successfully uploaded and extracted ${uploadedResults.length} policies.`,
      policies: uploadedResults,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ detail: err.message || "Failed to process PDF upload." }, { status: 400 });
  }
}
