import { CompareResponse, PolicyExtraction, UserProfile } from "../types";

export const DEMO_POLICIES: PolicyExtraction[] = [
  {
    id: "policy_a",
    name: "SecureCare Essential Health Plan",
    insurer: "StarCare General Insurance Ltd.",
    type: "Comprehensive Health Insurance",
    coverage: "Rs. 5,00,000",
    premium: "Rs. 8,500 / year",
    waiting_period: "30 days",
    exclusions: [
      "Cosmetic procedures",
      "Infertility treatment",
      "Non-medical expenses",
      "Hazardous activities"
    ],
    major_exclusions_detailed: [
      {
        item: "Cosmetic procedures",
        quote: "Cosmetic procedures: Cosmetic, aesthetic or plastic surgery treatments, including procedures aimed at improving appearance or gender affirmation.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Infertility treatment",
        quote: "Infertility treatment: Infertility, sub-fertility, assisted reproductive technology (ART), IVF procedures, or gestational surrogacy.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Non-medical expenses",
        quote: "Non-medical expenses: Non-medical expenses, personal comfort items, dietary supplements, and vitamins without a medical prescription.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Hazardous activities",
        quote: "Hazardous activities: Treatment arising from intentional self-inflicted injuries, suicide attempts, or participation in hazardous and extreme sporting activities.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      }
    ],
    deductible: "Rs. 5,000 / year",
    claim_conditions: "48 hrs notice (planned) / 24 hrs (emergency)",
    important_limitations: "Cataract sub-limit: Rs. 25,000 / eye",
    is_demo: true,
    filename: "Policy_A_SecureCare_Essential.pdf",
    pdf_url: "/policies/Policy_A_SecureCare_Essential.pdf",
    page_count: 2,
    evidence_map: {
      coverage: {
        field: "coverage",
        value: "Rs. 5,00,000",
        quote: "This policy provides comprehensive in-patient hospitalization coverage with a total sum insured of Rs. 5,00,000 per policy year.",
        page: 1,
        section: "SECTION 1. SCOPE OF COVERAGE AND SUM INSURED",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      premium: {
        field: "premium",
        value: "Rs. 8,500 / year",
        quote: "The annual premium payable for this policy is Rs. 8,500 per annum, payable in advance on an annual basis prior to policy commencement.",
        page: 1,
        section: "SECTION 2. PREMIUM PAYMENT AND RENEWAL TERMS",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      waiting_period: {
        field: "waiting_period",
        value: "30 days",
        quote: "A waiting period of 30 days applies to illnesses from policy inception, except in cases of emergency hospitalization resulting directly from an accidental injury.",
        page: 2,
        section: "SECTION 3. WAITING PERIOD",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      deductible: {
        field: "deductible",
        value: "Rs. 5,000 / year",
        quote: "A mandatory aggregate deductible of Rs. 5,000 applies before any claim is eligible for disbursement by the insurer.",
        page: 2,
        section: "SECTION 4. DEDUCTIBLE AND COST SHARING",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      claim_conditions: {
        field: "claim_conditions",
        value: "48 hrs notice (planned) / 24 hrs (emergency)",
        quote: "For planned hospitalization, written intimation must be submitted to the insurer at least 48 hours prior to hospital admission.",
        page: 2,
        section: "SECTION 6. CLAIM CONDITIONS AND NOTICE PROCEDURE",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      important_limitations: {
        field: "important_limitations",
        value: "Cataract sub-limit: Rs. 25,000 / eye",
        quote: "Cataract surgery claims are subject to a sub-limit of Rs. 25,000 per eye.",
        page: 2,
        section: "SECTION 7. IMPORTANT LIMITATIONS",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      },
      exclusions: {
        field: "exclusions",
        value: "4 major exclusions identified",
        quote: "Cosmetic procedures: Cosmetic, aesthetic or plastic surgery treatments, including procedures aimed at improving appearance or gender affirmation.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS",
        source_document: "Policy_A_SecureCare_Essential.pdf"
      }
    }
  },
  {
    id: "policy_b",
    name: "HealthShield Student Plus",
    insurer: "Apex Health & Allied Assurance Co.",
    type: "Student Dedicated Medical Protection Plan",
    coverage: "Rs. 10,00,000",
    premium: "Rs. 10,200 / year",
    waiting_period: "15 days",
    exclusions: [
      "Cosmetic dental",
      "Alternative treatments",
      "Substance abuse",
      "Weight reduction"
    ],
    major_exclusions_detailed: [
      {
        item: "Cosmetic dental",
        quote: "Cosmetic dental: Cosmetic dental treatments, veneers, orthodontics, or cosmetic surgery unless necessitated by accidental trauma.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Alternative treatments",
        quote: "Alternative treatments: Alternative medical treatments including untested holistic therapies, naturopathy, and experimental unapproved medication.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Substance abuse",
        quote: "Substance abuse: Substance abuse rehabilitation, alcoholism treatments, or injuries sustained while operating a motorized vehicle under toxicological influence.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Weight reduction",
        quote: "Weight reduction: Weight reduction treatments, bariatric surgical procedures, and obesity management programs.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      }
    ],
    deductible: "Rs. 2,500 / year",
    claim_conditions: "12 hrs notice via student claims portal",
    important_limitations: "Max 10 counseling sessions / 60 days travel",
    is_demo: true,
    filename: "Policy_B_HealthShield_Student_Plus.pdf",
    pdf_url: "/policies/Policy_B_HealthShield_Student_Plus.pdf",
    page_count: 2,
    evidence_map: {
      coverage: {
        field: "coverage",
        value: "Rs. 10,00,000",
        quote: "HealthShield Student Plus provides a high-tier maximum sum insured of Rs. 10,00,000 for verified enrolled undergraduate and graduate students.",
        page: 1,
        section: "SECTION 1. SUMMARY OF COVERAGE BENEFITS",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      premium: {
        field: "premium",
        value: "Rs. 10,200 / year",
        quote: "The annual premium for this student policy is Rs. 10,200 per annum, reflecting an institutional student rate.",
        page: 1,
        section: "SECTION 2. PREMIUM SCHEDULE",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      waiting_period: {
        field: "waiting_period",
        value: "15 days",
        quote: "A preferential waiting period of 15 days applies for student healthcare admissions from the effective start date of coverage.",
        page: 2,
        section: "SECTION 3. WAITING PERIOD",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      deductible: {
        field: "deductible",
        value: "Rs. 2,500 / year",
        quote: "A student-friendly annual deductible of Rs. 2,500 per policy year applies across all non-network claims.",
        page: 2,
        section: "SECTION 4. DEDUCTIBLES AND CO-PAYMENT",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      claim_conditions: {
        field: "claim_conditions",
        value: "12 hrs notice via student claims portal",
        quote: "Cashless hospitalization approval requests must be transmitted through the digital student claims portal within 12 hours of emergency intake.",
        page: 2,
        section: "SECTION 6. CLAIM SETTLEMENT PROCEDURES",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      important_limitations: {
        field: "important_limitations",
        value: "Max 10 counseling sessions / 60 days travel",
        quote: "Psychological counseling sessions are limited to 10 consultation sessions per calendar year.",
        page: 2,
        section: "SECTION 7. IMPORTANT LIMITATIONS",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      },
      exclusions: {
        field: "exclusions",
        value: "4 major exclusions identified",
        quote: "Cosmetic dental: Cosmetic dental treatments, veneers, orthodontics, or cosmetic surgery unless necessitated by accidental trauma.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS",
        source_document: "Policy_B_HealthShield_Student_Plus.pdf"
      }
    }
  },
  {
    id: "policy_c",
    name: "MediSure Basic Care",
    insurer: "National Care Indemnity Ltd.",
    type: "Standard Individual Basic Medical Cover",
    coverage: "Rs. 7,50,000",
    premium: "Rs. 7,500 / year",
    waiting_period: "UNCLEAR", // CRITICAL HACKATHON DEMO
    exclusions: [
      "Cosmetic procedures",
      "Vision treatments",
      "Self-medication",
      "Experimental procedures"
    ],
    major_exclusions_detailed: [
      {
        item: "Cosmetic procedures",
        quote: "Cosmetic procedures: Cosmetic or aesthetic procedures and elective treatments not medically required for life preservation.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Vision treatments",
        quote: "Vision treatments: Refractive error eye surgeries and laser corrective vision treatments under minus 7.5 dioptres.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Self-medication",
        quote: "Self-medication: Self-medication purchases, over-the-counter wellness tonics, and unauthorized health supplements.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      },
      {
        item: "Experimental procedures",
        quote: "Experimental procedures: Experimental and unproven medical procedures that lack regulatory accreditation.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS"
      }
    ],
    deductible: "Rs. 10,000 / claim",
    claim_conditions: "24 hrs notice in writing to claims desk",
    important_limitations: "Room rent cap: Rs. 4,000 / day",
    is_demo: true,
    filename: "Policy_C_MediSure_Basic_Care.pdf",
    pdf_url: "/policies/Policy_C_MediSure_Basic_Care.pdf",
    page_count: 2,
    evidence_map: {
      coverage: {
        field: "coverage",
        value: "Rs. 7,50,000",
        quote: "MediSure Basic Care indemnifies the policyholder up to an overall sum insured of Rs. 7,50,000 for covered medical hospitalization events.",
        page: 1,
        section: "SECTION 1. INDEMNITY COVERAGE AND BENEFITS",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      },
      premium: {
        field: "premium",
        value: "Rs. 7,500 / year",
        quote: "The stipulated annual premium for MediSure Basic Care is Rs. 7,500 per annum payable strictly before policy dispatch.",
        page: 1,
        section: "SECTION 2. ANNUAL PREMIUM SCHEDULE",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      },
      waiting_period: {
        field: "waiting_period",
        value: "UNCLEAR",
        quote: null,
        page: null,
        section: null,
        source_document: "Policy_C_MediSure_Basic_Care.pdf",
        reason: "No explicit clause was found in the provided policy document."
      },
      deductible: {
        field: "deductible",
        value: "Rs. 10,000 / claim",
        quote: "A mandatory deductible of Rs. 10,000 per claim must be borne by the insured policyholder before liability attaches to the insurer.",
        page: 2,
        section: "SECTION 4. POLICY DEDUCTIBLE RULES",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      },
      claim_conditions: {
        field: "claim_conditions",
        value: "24 hrs notice in writing to claims desk",
        quote: "The insured must inform the claims administration desk in writing within 24 hours of any hospital admission.",
        page: 2,
        section: "SECTION 6. CLAIM SUBMISSION AND VERIFICATION",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      },
      important_limitations: {
        field: "important_limitations",
        value: "Room rent cap: Rs. 4,000 / day",
        quote: "Room rent is capped at a maximum of Rs. 4,000 per day irrespective of the hospital tier.",
        page: 2,
        section: "SECTION 7. IMPORTANT RESTRICTIONS",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      },
      exclusions: {
        field: "exclusions",
        value: "4 major exclusions identified",
        quote: "Cosmetic procedures: Cosmetic or aesthetic procedures and elective treatments not medically required for life preservation.",
        page: 2,
        section: "SECTION 5. MAJOR POLICY EXCLUSIONS",
        source_document: "Policy_C_MediSure_Basic_Care.pdf"
      }
    }
  }
];

export function buildComparison(policies: PolicyExtraction[], userProfile?: UserProfile): CompareResponse {
  const priorities = [
    ...(userProfile?.priorities || ["Coverage", "Waiting Period"])
  ].map((p) => p.toLowerCase());

  const summaryPoints = policies.map((p) => {
    if (p.waiting_period === "UNCLEAR") {
      return `${p.name} provides ${p.coverage} coverage with an annual premium of ${p.premium}. The provided document does not contain an explicit waiting-period clause, so this field is marked UNCLEAR.`;
    }
    return `${p.name} provides ${p.coverage} coverage with an annual premium of ${p.premium} and a stated ${p.waiting_period} waiting period.`;
  });

  const featureMatrix = [
    {
      key: "coverage",
      label: "Sum Insured / Coverage",
      is_priority: priorities.some((p) => p.includes("cover")),
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.coverage,
            is_unclear: p.coverage === "UNCLEAR",
            evidence: p.evidence_map.coverage || null
          }
        ])
      )
    },
    {
      key: "waiting_period",
      label: "Waiting Period",
      is_priority: priorities.some((p) => p.includes("wait")),
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.waiting_period,
            is_unclear: p.waiting_period === "UNCLEAR",
            evidence: p.evidence_map.waiting_period || null
          }
        ])
      )
    },
    {
      key: "premium",
      label: "Annual Premium",
      is_priority: priorities.some((p) => p.includes("prem") || p.includes("budget")),
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.premium,
            is_unclear: p.premium === "UNCLEAR",
            evidence: p.evidence_map.premium || null
          }
        ])
      )
    },
    {
      key: "exclusions",
      label: "Major Exclusions",
      is_priority: priorities.some((p) => p.includes("exclu")),
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: `${p.major_exclusions_detailed?.length || 4} key exclusions`,
            items: p.major_exclusions_detailed?.map((e) => e.item) || p.exclusions,
            is_unclear: false,
            evidence: p.evidence_map.exclusions || null
          }
        ])
      )
    },
    {
      key: "deductible",
      label: "Compulsory Deductible",
      is_priority: false,
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.deductible,
            is_unclear: p.deductible === "UNCLEAR",
            evidence: p.evidence_map.deductible || null
          }
        ])
      )
    },
    {
      key: "claim_conditions",
      label: "Claim Notice Conditions",
      is_priority: priorities.some((p) => p.includes("claim")),
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.claim_conditions,
            is_unclear: p.claim_conditions === "UNCLEAR",
            evidence: p.evidence_map.claim_conditions || null
          }
        ])
      )
    },
    {
      key: "important_limitations",
      label: "Important Limitations",
      is_priority: false,
      values: Object.fromEntries(
        policies.map((p) => [
          p.id,
          {
            value: p.important_limitations,
            is_unclear: p.important_limitations === "UNCLEAR",
            evidence: p.evidence_map.important_limitations || null
          }
        ])
      )
    }
  ];

  return {
    policies,
    user_profile: userProfile,
    summary_points: summaryPoints,
    neutral_summary: summaryPoints.map((s) => `• ${s}`).join("\n"),
    feature_matrix: featureMatrix
  };
}
