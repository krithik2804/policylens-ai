export interface Evidence {
  field: string;
  value: string;
  quote?: string | null;
  page?: number | null;
  section?: string | null;
  source_document?: string | null;
  reason?: string | null;
}

export interface MajorExclusion {
  item: string;
  quote: string;
  page: number;
  section?: string | null;
}

export interface PolicyExtraction {
  id: string;
  name: string;
  insurer: string;
  type: string;
  coverage: string;
  premium: string;
  waiting_period: string;
  exclusions: string[];
  major_exclusions_detailed: MajorExclusion[];
  deductible: string;
  claim_conditions: string;
  important_limitations: string;
  is_demo: boolean;
  filename: string;
  pdf_url?: string;
  evidence_map: Record<string, Evidence>;
  summary?: string;
  page_count: number;
}

export interface UserProfile {
  customer_type: string;
  priorities: string[];
  budget: string;
}

export interface FeatureMatrixRow {
  key: string;
  label: string;
  is_priority: boolean;
  values: Record<
    string,
    {
      value: string;
      items?: string[];
      is_unclear: boolean;
      evidence?: Evidence | null;
    }
  >;
}

export interface CompareResponse {
  policies: PolicyExtraction[];
  user_profile?: UserProfile;
  summary_points: string[];
  neutral_summary: string;
  feature_matrix: FeatureMatrixRow[];
}

export interface AskResponse {
  policy_id: string;
  question: string;
  answer: string;
  evidence_quote?: string | null;
  page?: number | null;
  section?: string | null;
  source_document?: string | null;
  found: boolean;
}
