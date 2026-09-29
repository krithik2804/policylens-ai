import { NextRequest, NextResponse } from "next/server";
import { DEMO_POLICIES } from "@/lib/mockData";

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

    const uploadedResults = files.map((file, idx) => {
      // Pick matching policy structure from demo base or assign custom
      const basePolicy = DEMO_POLICIES[idx % DEMO_POLICIES.length];
      const customId = `custom_${idx}_${file.name.replace(/[^a-zA-Z0-9]/g, "_")}`;

      return {
        id: basePolicy.id,
        filename: file.name,
        size_kb: Math.round(file.size / 1024),
        status: "ready",
        policy: {
          ...basePolicy,
          filename: file.name,
        },
      };
    });

    return NextResponse.json({
      message: `Successfully processed ${uploadedResults.length} policies.`,
      policies: uploadedResults,
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
