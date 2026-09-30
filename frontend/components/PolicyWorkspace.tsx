"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Fullscreen,
  GripVertical,
  Info,
  Maximize2,
  Moon,
  MoreHorizontal,
  PanelRight,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type Clause = {
  name: string;
  category: string;
  policyA: string;
  policyB: string;
  quoteA?: string;
  quoteB?: string;
  refA?: string;
  refB?: string;
  delta: number;
  status?: "blank";
};

const clauses: Clause[] = [
  { name: "Annual Deductible", category: "Cost sharing", policyA: "$500 / year", policyB: "$1,000 / year", quoteA: "The annual deductible is five hundred dollars per insured person.", quoteB: "A deductible of $1,000 applies per policy year.", refA: "Page 8, Clause 2.1", refB: "Page 11, Section 4", delta: 62 },
  { name: "Pre-existing Conditions", category: "Eligibility", policyA: "Covered after 12 months", policyB: "Not covered", quoteA: "Pre-existing conditions are covered following a continuous twelve-month waiting period.", refA: "Page 14, Clause 3.2", refB: "Page 17, Exclusion 6", delta: 84 },
  { name: "Waiting Period", category: "Access", policyA: "30 days", policyB: "90 days", quoteA: "Full coverage applies after a 30-day waiting window.", quoteB: "The waiting period for eligible treatment is ninety days.", refA: "Page 14, Clause 3.2", refB: "Page 12, Section 3.1", delta: 48 },
  { name: "Hospital Network", category: "Provider access", policyA: "12,000+ hospitals", policyB: "8,400+ hospitals", quoteA: "Access is available at more than 12,000 network hospitals nationwide.", quoteB: "The provider network includes approximately 8,400 hospitals.", refA: "Page 22, Schedule B", refB: "Page 19, Network List", delta: 70 },
  { name: "Natural Disasters", category: "Exclusions", policyA: "Covered", policyB: "Not stated", quoteA: "Treatment arising from natural disasters remains eligible under this policy.", refA: "Page 31, Clause 8.4", delta: 91, status: "blank" },
];

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof ShieldCheck; tone: string }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon /></div>
      <div className="min-w-0"><p className="stat-label">{label}</p><p className="stat-value">{value}</p><p className="stat-detail">{detail}</p></div>
    </div>
  );
}

function QuoteButton({ quote, refText, onClick, muted = false }: { quote?: string; refText?: string; onClick: () => void; muted?: boolean }) {
  if (muted) return <span className="honest-blank"><Info /> Honest blank · Not stated</span>;
  return <button className="quote-chip" onClick={onClick}><FileText /> Grounded quote <span>{refText}</span><ChevronRight /></button>;
}

export function PolicyWorkspace() {
  const [dark, setDark] = useState(false);
  const [docTab, setDocTab] = useState<"a" | "b">("a");
  const [view, setView] = useState("Comparison matrix");
  const [selected, setSelected] = useState<Clause | null>(null);
  const [page, setPage] = useState(14);
  const [zoom, setZoom] = useState(100);

  return (
    <main className={dark ? "app-shell dark-shell" : "app-shell"}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><ShieldCheck /></div>
          <div><div className="brand-name">VeriPolicy <span>AI</span></div><div className="brand-subtitle">Enterprise policy evaluation engine</div></div>
          <div className="model-badge"><span /> Model active · v2.4</div>
        </div>
        <div className="top-actions">
          <button className="secondary-button"><Upload /> Upload policy</button>
          <button className="primary-button"><Download /> Export report</button>
          <button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
          <button className="icon-button" aria-label="More options"><MoreHorizontal /></button>
        </div>
      </header>

      <section className="workspace-heading">
        <div><p className="eyebrow"><Sparkles /> Evaluation workspace</p><h1>SecureCare Essential <span>vs</span> HealthShield Student Plus</h1><p className="heading-copy">Evidence-backed comparison with exact source citations and honest blanks.</p></div>
        <div className="heading-meta"><div className="verified-pill"><ShieldCheck /> Analysis verified</div><p>Last evaluated 2 minutes ago</p></div>
      </section>

      <section className="stats-grid">
        <StatCard label="Coverage match score" value="84%" detail="Strong alignment · +12% vs benchmark" icon={BarChart3} tone="green" />
        <StatCard label="Grounded citations found" value="32" detail="Across 5 coverage categories" icon={ClipboardCheck} tone="brown" />
        <StatCard label="Honest blanks detected" value="04" detail="No unsupported assumptions" icon={Info} tone="amber" />
        <StatCard label="Critical exclusions" value="07" detail="3 require your attention" icon={ShieldCheck} tone="rose" />
      </section>

      <div className="view-tabs" role="tablist">
        {["Comparison matrix", "Side-by-side clauses", "Evaluation audit log"].map((tab) => <button key={tab} className={view === tab ? "active" : ""} onClick={() => setView(tab)}>{tab}{tab === "Evaluation audit log" && <span className="tab-count">12</span>}</button>)}
        <div className="view-tools"><button className="icon-button"><Search /></button><button className="icon-button"><PanelRight /></button></div>
      </div>

      {view !== "Comparison matrix" ? <div className="empty-view"><ClipboardCheck /><h2>{view}</h2><p>This view is ready for your next review pass. Select a grounded quote in the comparison matrix to inspect its source evidence.</p></div> : <div className="split-workspace">
        <section className="document-panel panel">
          <div className="panel-header"><div><p className="panel-kicker">Source documents</p><h2>Policy evidence viewer</h2></div><button className="icon-button"><Maximize2 /></button></div>
          <div className="document-tabs"><button className={docTab === "a" ? "active" : ""} onClick={() => setDocTab("a")}><span className="doc-dot green-dot" /> Policy A <small>Uploaded</small></button><button className={docTab === "b" ? "active" : ""} onClick={() => setDocTab("b")}><span className="doc-dot brown-dot" /> Policy B <small>Benchmark</small></button></div>
          <div className="doc-toolbar"><div className="page-control"><button onClick={() => setPage(Math.max(1, page - 1))}><ChevronRight className="rotate-180" /></button><span>Page <strong>{page}</strong> of 48</span><button onClick={() => setPage(Math.min(48, page + 1))}><ChevronRight /></button></div><div className="zoom-control"><button onClick={() => setZoom(Math.max(75, zoom - 5))}><ZoomOut /></button><span>{zoom}%</span><button onClick={() => setZoom(Math.min(125, zoom + 5))}><ZoomIn /></button></div><button className="icon-button"><Fullscreen /></button></div>
          <div className="paper-wrap"><article className="paper" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}><div className="paper-brand"><span>{docTab === "a" ? "SECURECARE" : "HEALTHSHIELD"}</span><span>POLICY SCHEDULE</span></div><h3>{docTab === "a" ? "Essential Health Insurance Plan" : "Student Plus Health Plan"}</h3><p className="paper-meta">Section 3 · Coverage and waiting periods</p><div className="paper-rule" /><h4>3.2 Pre-existing conditions</h4><p>Coverage under this policy includes eligible medical expenses subject to the terms, conditions and limitations outlined below.</p><p className="highlight-green">{docTab === "a" ? "Pre-existing conditions are covered following a continuous twelve-month waiting period." : "Conditions or symptoms existing before the policy commencement date are excluded from coverage."}</p><p>Waiting periods apply to certain treatments and conditions. Please refer to the schedule of benefits for applicable limits.</p><h4>3.3 Waiting period</h4><p className="highlight-brown">{docTab === "a" ? "Full coverage applies after a 30-day waiting window." : "The waiting period for eligible treatment is ninety days from the commencement date."}</p><p className="paper-small">This document is a source representation for review. Always refer to the signed policy for binding terms.</p><div className="paper-footer"><span>VeriPolicy source copy</span><span>{page}</span></div></article></div>
          <div className="doc-footer"><span><GripVertical /> Drag to pan document</span><span>Source: uploaded PDF · hash 8d4c…e91a</span></div>
        </section>

        <section className="comparison-panel panel"><div className="panel-header"><div><p className="panel-kicker">AI evaluation</p><h2>Coverage comparison</h2></div><button className="filter-button"><Plus /> Add category</button></div><div className="matrix-head"><span>Clause / feature</span><span>Policy A · SecureCare</span><span>Policy B · Benchmark</span><span>Difference</span></div><div className="matrix-body">{clauses.map((clause) => <div className="matrix-row" key={clause.name}><div className="clause-name"><span className="category-tag">{clause.category}</span><strong>{clause.name}</strong></div><div className="policy-cell"><strong>{clause.policyA}</strong><QuoteButton quote={clause.quoteA} refText={clause.refA} onClick={() => setSelected(clause)} /></div><div className="policy-cell"><strong className={clause.status ? "muted-value" : ""}>{clause.policyB}</strong><QuoteButton quote={clause.quoteB} refText={clause.refB} muted={clause.status === "blank"} onClick={() => setSelected(clause)} /></div><div className="delta-cell"><div className="delta-bars"><span style={{ height: `${Math.max(22, clause.delta - 18)}%` }} /><span style={{ height: `${Math.max(18, 100 - clause.delta)}%` }} /></div><span className={clause.delta > 70 ? "delta-positive" : "delta-neutral"}>{clause.delta > 70 ? <ArrowUp /> : <ArrowDown />}{clause.delta}%</span></div></div>)}</div><div className="matrix-note"><Info /> Difference scores weigh coverage breadth, waiting periods, exclusions, and provider access. They are not a recommendation.</div></section>
      </div>}

      <footer className="bottom-status"><span><span className="status-dot" /> All evidence grounded in source documents</span><span>Privacy-first · No policy data leaves your workspace</span></footer>
      {selected && <div className="evidence-drawer"><div className="drawer-head"><div><p className="panel-kicker">Grounded evidence</p><h2>{selected.name}</h2></div><button className="icon-button" onClick={() => setSelected(null)}><X /></button></div><div className="drawer-quote"><FileText /><blockquote>“{docTab === "a" ? selected.quoteA : selected.quoteB || "Not stated in this policy."}”</blockquote></div><p className="drawer-ref">{docTab === "a" ? selected.refA : selected.refB || "No source reference available"}</p><button className="primary-button drawer-action" onClick={() => setSelected(null)}>View in document <ChevronRight /></button></div>}
    </main>
  );
}

afterExport();
function afterExport() { /* keeps component exports tree-shake friendly */ }

export default PolicyWorkspace;
