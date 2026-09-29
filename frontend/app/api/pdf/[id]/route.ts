import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let filename = "Policy_A_SecureCare_Essential.pdf";
  if (id === "policy_b" || id.includes("healthshield")) {
    filename = "Policy_B_HealthShield_Student_Plus.pdf";
  } else if (id === "policy_c" || id.includes("medisure")) {
    filename = "Policy_C_MediSure_Basic_Care.pdf";
  }

  const filePath = path.join(process.cwd(), "public", "policies", filename);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  }

  // Redirect to static file route as fallback
  return NextResponse.redirect(new URL(`/policies/${filename}`, req.url));
}
