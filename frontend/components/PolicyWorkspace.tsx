"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  Upload,
  Download,
  Moon,
  Sun,
  MoreHorizontal,
  Sparkles,
  ClipboardCheck,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  GripVertical,
  X,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { generateComparisonPdfReport } from "../lib/pdfReportGenerator";
import { DEMO_POLICIES, buildComparison } from "../lib/mockData";
import { AskPolicyDrawer } from "./AskPolicyDrawer";
import { UploadPolicies } from "./UploadPolicies";
import { NeedQuestions } from "./NeedQuestions";
import { AnalysisProgress } from "./AnalysisProgress";
import { UserProfile } from "../types";

type ClauseRow = {
  name: string;
  category: string;
  policyA: string;
  policyB: string;
  policyC: string;
  quoteA: string;
  quoteB: string;
  quoteC?: string;
  refA: string;
  refB: string;
  refC?: string;
  statusC?: "blank";
};

const clausesData: ClauseRow[] = [
  {
    name: "Cover / Sum Insured",
    category: "Coverage Limit",
    policyA: "Rs. 5,00,000",
    policyB: "Rs. 10,00,000",
    policyC: "Rs. 7,50,000",
    quoteA: "This policy provides comprehensive in-patient hospitalization coverage with a total sum insured of Rs. 5,00,000 per policy year.",
    quoteB: "HealthShield Student Plus provides a high-tier maximum sum insured of Rs. 10,00,000 for verified enrolled undergraduate and graduate students.",
    quoteC: "MediSure Basic Care indemnifies the policyholder up to an overall sum insured of Rs. 7,50,000 for covered medical hospitalization events.",
    refA: "Page 1, Clause 1.1",
    refB: "Page 1, Clause 1.1",
    refC: "Page 1, Clause 1.1",
  },
  {
    name: "Waiting Period",
    category: "Eligibility & PED",
    policyA: "30 days",
    policyB: "15 days",
    policyC: "UNCLEAR",
    quoteA: "A waiting period of 30 days applies to illnesses from policy inception, except in cases of emergency hospitalization resulting directly from an accidental injury.",
    quoteB: "A preferential waiting period of 15 days applies for student healthcare admissions from the effective start date of coverage.",
    quoteC: undefined,
    refA: "Page 2, Clause 3.1",
    refB: "Page 2, Clause 3.1",
    refC: undefined,
    statusC: "blank",
  },
  {
    name: "Major Exclusions",
    category: "Treatment Restrictions",
    policyA: "4 Exclusions",
    policyB: "4 Exclusions",
    policyC: "4 Exclusions",
    quoteA: "Major Exclusions: Cosmetic or plastic surgery, Infertility treatments, Non-medical comfort supplies, and Hazardous extreme sports are permanently excluded.",
    quoteB: "Major Exclusions: Cosmetic dental treatments, Alternative unproven holistic therapies, Substance abuse rehabilitation, and Bariatric weight reduction surgeries are excluded.",
    quoteC: "Major Exclusions: Cosmetic aesthetic procedures, Refractive vision surgeries under -7.5 dioptres, Self-medication tonics, and Experimental unaccredited procedures are excluded.",
    refA: "Page 2, Section 5",
    refB: "Page 2, Section 5",
    refC: "Page 2, Section 5",
  },
  {
    name: "Price Quote (Annual Premium)",
    category: "Annual Cost",
    policyA: "Rs. 8,500 / yr",
    policyB: "Rs. 10,200 / yr",
    policyC: "Rs. 7,500 / yr",
    quoteA: "The annual premium payable for this policy is Rs. 8,500 per annum, payable in advance on an annual basis prior to policy commencement.",
    quoteB: "The annual premium for this student policy is Rs. 10,200 per annum, reflecting an institutional student rate.",
    quoteC: "The stipulated annual premium for MediSure Basic Care is Rs. 7,500 per annum payable strictly before policy dispatch.",
    refA: "Page 1, Clause 2.1",
    refB: "Page 1, Clause 2.1",
    refC: "Page 1, Clause 2.1",
  },
];

function QuoteButton({
  refText,
  onClick,
  muted = false,
}: {
  refText?: string;
  onClick: () => void;
  muted?: boolean;
}) {
  if (muted) {
    return (
      <span className="honest-blank" onClick={onClick} title="Click to view honest blank reasoning">
        <Info /> Honest blank · Not stated
      </span>
    );
  }
  return (
    <button className="quote-chip" onClick={onClick}>
      <FileText /> Grounded quote <span>{refText}</span>
      <ChevronRight />
    </button>
  );
}

export function PolicyWorkspace() {
  const [dark, setDark] = useState<boolean>(false);
  const [docTab, setDocTab] = useState<"a" | "b" | "c">("a");
  const [view, setView] = useState<"Comparison matrix" | "Requirement profile" | "Evaluation audit log">("Comparison matrix");
  const [selected, setSelected] = useState<{
    clause: ClauseRow;
    policyKey: "a" | "b" | "c";
  } | null>(null);
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);

  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    customer_type: "Student",
    priorities: ["Coverage", "Waiting Period"],
    budget: "₹5,000 - ₹10,000",
  });

  // Sync theme with document class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  };

  // Export full PDF audit report
  const handleExportPdf = () => {
    const comparisonData = buildComparison(DEMO_POLICIES, userProfile);
    generateComparisonPdfReport(comparisonData);
  };

  return (
    <main className={dark ? "app-shell dark-shell" : "app-shell"}>
      {/* Topbar Navigation */}
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <ShieldCheck />
          </div>
          <div>
            <div className="brand-name">
              PolicyLens <span>AI</span>
            </div>
            <div className="brand-subtitle">Zero-Hallucination Insurance Audit System</div>
          </div>
          <div className="model-badge">
            <span /> Model Active · Zero-Hallucination Standard
          </div>
        </div>

        <div className="top-actions">
          <button className="secondary-button" onClick={() => setIsAskDrawerOpen(true)}>
            <MessageSquare /> Ask Policy AI
          </button>
          <button className="secondary-button" onClick={() => setIsUploadOpen(true)}>
            <Upload /> Upload Policy
          </button>
          <button className="primary-button" onClick={handleExportPdf}>
            <Download /> Export PDF Report
          </button>
          <button
            className="theme-button"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {/* Workspace Heading */}
      <section className="workspace-heading">
        <div>
          <p className="eyebrow">
            <Sparkles /> Evaluation Workspace · Verbatim Contract Citations
          </p>
          <h1>
            Policy A (SecureCare) <span>vs</span> Policy B (HealthShield) <span>vs</span> Policy C (MediSure)
          </h1>
          <p className="heading-copy">
            Evidence-backed 3-policy comparison with grounded contract quotes and an honest blank.
          </p>
        </div>
        <div className="heading-meta">
          <div className="verified-pill">
            <ShieldCheck /> Anti-Selling Standard Verified
          </div>
          <p>Zero Guessed Cover · No Premium Collected · Independent Audit</p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck />
          </div>
          <div className="min-w-0">
            <p className="stat-label">Evaluation Standard</p>
            <p className="stat-value">100%</p>
            <p className="stat-detail">Grounded Quotes · Zero Guessing</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon brown">
            <ClipboardCheck />
          </div>
          <div className="min-w-0">
            <p className="stat-label">Contracts Audited</p>
            <p className="stat-value">03</p>
            <p className="stat-detail">Policy A, Policy B, Policy C</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Info />
          </div>
          <div className="min-w-0">
            <p className="stat-label">Honest Blanks Detected</p>
            <p className="stat-value">01</p>
            <p className="stat-detail">Policy C Waiting Period Omitted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rose">
            <ShieldCheck />
          </div>
          <div className="min-w-0">
            <p className="stat-label">Commercial Bias</p>
            <p className="stat-value">0%</p>
            <p className="stat-detail">No Selling · No Premium Collected</p>
          </div>
        </div>
      </section>

      {/* View Tabs */}
      <div className="view-tabs" role="tablist">
        {(["Comparison matrix", "Requirement profile", "Evaluation audit log"] as const).map((tab) => (
          <button
            key={tab}
            className={view === tab ? "active" : ""}
            onClick={() => setView(tab)}
          >
            {tab}
            {tab === "Requirement profile" && (
              <span className="tab-count">Student · ₹5k-₹10k</span>
            )}
            {tab === "Evaluation audit log" && (
              <span className="tab-count">3 Scanned</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 2: Requirement Profile View */}
      {view === "Requirement profile" && (
        <div className="my-6">
          <NeedQuestions
            initialProfile={userProfile}
            isDemoMode={true}
            onComplete={(p) => {
              setUserProfile(p);
              setView("Comparison matrix");
            }}
            onBack={() => setView("Comparison matrix")}
          />
        </div>
      )}

      {/* Tab 3: Evaluation Audit Log View */}
      {view === "Evaluation audit log" && (
        <div className="my-6">
          <AnalysisProgress
            policyCount={3}
            policyNames={[
              "Policy A: SecureCare Essential Health Plan",
              "Policy B: HealthShield Student Plus",
              "Policy C: MediSure Basic Care",
            ]}
            onComplete={() => setView("Comparison matrix")}
          />
        </div>
      )}

      {/* Tab 1: Comparison Matrix (Split Workspace) */}
      {view === "Comparison matrix" && (
        <div className="split-workspace">
          {/* Left Panel: Document Evidence Viewer */}
          <section className="document-panel panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Source Contract Evidence</p>
                <h2>Document Evidence Viewer</h2>
              </div>
              <a
                href={
                  docTab === "a"
                    ? "/policies/Policy_A_SecureCare_Essential.pdf"
                    : docTab === "b"
                    ? "/policies/Policy_B_HealthShield_Student_Plus.pdf"
                    : "/policies/Policy_C_MediSure_Basic_Care.pdf"
                }
                target="_blank"
                rel="noreferrer"
                className="icon-button"
                title="Open PDF in new tab"
              >
                <ExternalLink />
              </a>
            </div>

            <div className="document-tabs">
              <button
                className={docTab === "a" ? "active" : ""}
                onClick={() => {
                  setDocTab("a");
                  setPage(1);
                }}
              >
                <span className="doc-dot green-dot" /> Policy A <small>SecureCare</small>
              </button>
              <button
                className={docTab === "b" ? "active" : ""}
                onClick={() => {
                  setDocTab("b");
                  setPage(1);
                }}
              >
                <span className="doc-dot brown-dot" /> Policy B <small>HealthShield</small>
              </button>
              <button
                className={docTab === "c" ? "active" : ""}
                onClick={() => {
                  setDocTab("c");
                  setPage(1);
                }}
              >
                <span className="doc-dot amber-dot" style={{ background: "#d97706" }} /> Policy C <small>MediSure</small>
              </button>
            </div>

            <div className="doc-toolbar">
              <div className="page-control">
                <button onClick={() => setPage(Math.max(1, page - 1))}>
                  <ChevronRight className="rotate-180" />
                </button>
                <span>
                  Page <strong>{page}</strong> of 2
                </span>
                <button onClick={() => setPage(Math.min(2, page + 1))}>
                  <ChevronRight />
                </button>
              </div>

              <div className="zoom-control">
                <button onClick={() => setZoom(Math.max(80, zoom - 10))}>
                  <ZoomOut />
                </button>
                <span>{zoom}%</span>
                <button onClick={() => setZoom(Math.min(120, zoom + 10))}>
                  <ZoomIn />
                </button>
              </div>
            </div>

            <div className="paper-wrap">
              <article
                className="paper"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              >
                <div className="paper-brand">
                  <span>
                    {docTab === "a"
                      ? "STARCARE GENERAL INSURANCE"
                      : docTab === "b"
                      ? "APEX HEALTH ASSURANCE"
                      : "NATIONAL CARE INDEMNITY"}
                  </span>
                  <span>POLICY CONTRACT SCHEDULE</span>
                </div>

                <h3>
                  {docTab === "a"
                    ? "SecureCare Essential Health Plan"
                    : docTab === "b"
                    ? "HealthShield Student Plus Plan"
                    : "MediSure Basic Care Plan"}
                </h3>

                <p className="paper-meta">
                  {page === 1 ? "Section 1 & 2 · Scope of Coverage and Premium Schedule" : "Section 3, 4 & 5 · Waiting Periods and Exclusions"}
                </p>

                <div className="paper-rule" />

                {page === 1 ? (
                  <>
                    <h4>SECTION 1. SCOPE OF COVERAGE</h4>
                    <p className="highlight-green">
                      {docTab === "a"
                        ? "This policy provides comprehensive in-patient hospitalization coverage with a total sum insured of Rs. 5,00,000 per policy year."
                        : docTab === "b"
                        ? "HealthShield Student Plus provides a high-tier maximum sum insured of Rs. 10,00,000 for verified enrolled undergraduate and graduate students."
                        : "MediSure Basic Care indemnifies the policyholder up to an overall sum insured of Rs. 7,50,000 for covered medical hospitalization events."}
                    </p>

                    <h4>SECTION 2. ANNUAL PREMIUM SCHEDULE</h4>
                    <p className="highlight-brown">
                      {docTab === "a"
                        ? "The annual premium payable for this policy is Rs. 8,500 per annum, payable in advance on an annual basis prior to policy commencement."
                        : docTab === "b"
                        ? "The annual premium for this student policy is Rs. 10,200 per annum, reflecting an institutional student rate."
                        : "The stipulated annual premium for MediSure Basic Care is Rs. 7,500 per annum payable strictly before policy dispatch."}
                    </p>
                  </>
                ) : (
                  <>
                    <h4>SECTION 3. WAITING PERIOD</h4>
                    {docTab === "c" ? (
                      <div className="p-3 my-2 rounded border border-amber-300 bg-amber-50 text-amber-900 text-[10px]">
                        <strong>CRITICAL AUDIT NOTICE (HONEST BLANK):</strong>
                        <p className="mt-1">
                          Section 3 (Waiting Period) is omitted from this contract document. Under the strict zero-hallucination standard, this field is flagged as <strong>UNCLEAR</strong>. No coverage assumption is made.
                        </p>
                      </div>
                    ) : (
                      <p className="highlight-green">
                        {docTab === "a"
                          ? "A waiting period of 30 days applies to illnesses from policy inception, except in cases of emergency hospitalization resulting directly from an accidental injury."
                          : "A preferential waiting period of 15 days applies for student healthcare admissions from the effective start date of coverage."}
                      </p>
                    )}

                    <h4>SECTION 5. MAJOR POLICY EXCLUSIONS</h4>
                    <p className="highlight-brown">
                      {docTab === "a"
                        ? "Major Exclusions: Cosmetic or plastic surgery, Infertility treatments, Non-medical comfort supplies, and Hazardous extreme sports are permanently excluded."
                        : docTab === "b"
                        ? "Major Exclusions: Cosmetic dental treatments, Alternative unproven holistic therapies, Substance abuse rehabilitation, and Bariatric weight reduction surgeries are excluded."
                        : "Major Exclusions: Cosmetic aesthetic procedures, Refractive vision surgeries under -7.5 dioptres, Self-medication tonics, and Experimental unaccredited procedures are excluded."}
                    </p>
                  </>
                )}

                <div className="paper-footer">
                  <span>PolicyLens AI Grounded Verification Copy</span>
                  <span>Page {page} of 2</span>
                </div>
              </article>
            </div>

            <div className="doc-footer">
              <span>
                <GripVertical /> Verifiable Ground-Truth Contract Schedule
              </span>
              <span>
                Hash: {docTab === "a" ? "starcare_8d4c9" : docTab === "b" ? "apex_e91a2" : "national_c48b1"}
              </span>
            </div>
          </section>

          {/* Right Panel: 3-Policy Comparison Matrix */}
          <section className="comparison-panel panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Independent AI Audit</p>
                <h2>Side-by-Side Clause Matrix (3 Policies)</h2>
              </div>
              <button className="filter-button" onClick={() => setView("Requirement profile")}>
                Profile: Student
              </button>
            </div>

            {/* Matrix Header (3 Columns) */}
            <div className="matrix-head-3col">
              <span>Contract Feature</span>
              <span>Policy A · SecureCare</span>
              <span>Policy B · HealthShield</span>
              <span>Policy C · MediSure</span>
            </div>

            {/* Matrix Rows (4 Core Features) */}
            <div className="matrix-body">
              {clausesData.map((row) => (
                <div className="matrix-row-3col" key={row.name}>
                  {/* Feature Name */}
                  <div className="clause-name">
                    <span className="category-tag">{row.category}</span>
                    <strong>{row.name}</strong>
                  </div>

                  {/* Policy A Cell */}
                  <div className="policy-cell">
                    <strong>{row.policyA}</strong>
                    <QuoteButton
                      refText={row.refA}
                      onClick={() => {
                        setSelected({ clause: row, policyKey: "a" });
                        setDocTab("a");
                        setPage(row.refA.includes("Page 2") ? 2 : 1);
                      }}
                    />
                  </div>

                  {/* Policy B Cell */}
                  <div className="policy-cell">
                    <strong>{row.policyB}</strong>
                    <QuoteButton
                      refText={row.refB}
                      onClick={() => {
                        setSelected({ clause: row, policyKey: "b" });
                        setDocTab("b");
                        setPage(row.refB.includes("Page 2") ? 2 : 1);
                      }}
                    />
                  </div>

                  {/* Policy C Cell (With the 1 UNCLEAR Honest Blank) */}
                  <div className="policy-cell">
                    <strong className={row.statusC ? "text-amber-700 dark:text-amber-400 font-bold" : ""}>
                      {row.policyC}
                    </strong>
                    <QuoteButton
                      refText={row.refC}
                      muted={row.statusC === "blank"}
                      onClick={() => {
                        setSelected({ clause: row, policyKey: "c" });
                        setDocTab("c");
                        setPage(2);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="matrix-note">
              <Info /> Strict Zero-Guessing Standard: Every present benefit quotes its exact PDF sentence. When a clause is absent, it is honestly labeled <strong>UNCLEAR</strong>. We never guess coverage and never sell insurance.
            </div>
          </section>
        </div>
      )}

      {/* Footer Status */}
      <footer className="bottom-status">
        <span>
          <span className="status-dot" /> All evidence grounded in verified contract documents · Zero guessed cover
        </span>
        <span>Independent Consumer Tool · No Premium Collected · Not an Insurance Solicitation</span>
      </footer>

      {/* Interactive Grounded Evidence Drawer */}
      {selected && (
        <div className="evidence-drawer">
          <div className="drawer-head">
            <div>
              <p className="panel-kicker">Grounded Verbatim Evidence</p>
              <h2>{selected.clause.name}</h2>
            </div>
            <button className="icon-button" onClick={() => setSelected(null)}>
              <X />
            </button>
          </div>

          <div className="drawer-quote">
            <FileText />
            <blockquote>
              {selected.policyKey === "a"
                ? `“${selected.clause.quoteA}”`
                : selected.policyKey === "b"
                ? `“${selected.clause.quoteB}”`
                : selected.clause.quoteC
                ? `“${selected.clause.quoteC}”`
                : "HONEST BLANK: No explicit clause was found in this contract document. PolicyLens AI strictly reports this as UNCLEAR."}
            </blockquote>
          </div>

          <p className="drawer-ref">
            {selected.policyKey === "a"
              ? `Source: Policy A · ${selected.clause.refA}`
              : selected.policyKey === "b"
              ? `Source: Policy B · ${selected.clause.refB}`
              : selected.clause.refC
              ? `Source: Policy C · ${selected.clause.refC}`
              : "Source: Policy C (MediSure) · Clause Omitted in PDF"}
          </p>

          <button
            className="primary-button drawer-action"
            onClick={() => {
              setDocTab(selected.policyKey);
              setSelected(null);
            }}
          >
            View Highlighted in Document <ChevronRight />
          </button>
        </div>
      )}

      {/* Slide-over Ask Policy AI Drawer */}
      <AskPolicyDrawer
        isOpen={isAskDrawerOpen}
        onClose={() => setIsAskDrawerOpen(false)}
        policies={DEMO_POLICIES}
        onOpenPdf={(policyId) => {
          if (policyId.includes("b")) setDocTab("b");
          else if (policyId.includes("c")) setDocTab("c");
          else setDocTab("a");
          setIsAskDrawerOpen(false);
        }}
      />

      {/* Upload Policy Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <UploadPolicies
              onStartAnalysis={() => {
                setIsUploadOpen(false);
                setView("Evaluation audit log");
              }}
              onUseDemoData={() => {
                setIsUploadOpen(false);
                setView("Comparison matrix");
              }}
              onBack={() => setIsUploadOpen(false)}
              isDemoMode={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default PolicyWorkspace;
