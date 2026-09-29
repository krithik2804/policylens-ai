import { CompareResponse, PolicyExtraction, UserProfile, AskResponse } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend service unreachable");
  return res.json();
}

export async function fetchDemoData(): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE}/api/demo`);
  if (!res.ok) throw new Error("Failed to load demo policies");
  return res.json();
}

export async function uploadPolicies(files: File[]): Promise<{
  message: string;
  policies: Array<{
    id: string;
    filename: string;
    size_kb: number;
    status: string;
    policy: PolicyExtraction;
  }>;
}> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to upload and extract policies");
  }

  return res.json();
}

export async function comparePolicies(
  policyIds: string[],
  userProfile?: UserProfile
): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      policy_ids: policyIds,
      user_profile: userProfile,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to compare policies");
  }

  return res.json();
}

export async function askPolicyQuestion(
  policyId: string,
  question: string
): Promise<AskResponse> {
  const res = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      policy_id: policyId,
      question: question,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to query policy document");
  }

  return res.json();
}

export function getPdfUrl(policyId: string): string {
  return `${API_BASE}/api/pdf/${policyId}`;
}
