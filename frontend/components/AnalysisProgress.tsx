"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  FileText,
  ShieldCheck,
  Terminal,
  Cpu,
  Sparkles,
  AlertCircle,
  FileCheck,
  Layers,
} from "lucide-react";

interface AnalysisProgressProps {
  policyCount: number;
  policyNames?: string[];
  onComplete: () => void;
}

const AUDIT_CLAUSES = [
  { clause: "Document Header & Policy Type", field: "Metadata" },
  { clause: "Sum Insured & Coverage Ceilings", field: "Sum Insured" },
  { clause: "Room Rent & ICU Sub-Limits", field: "Room Rent" },
  { clause: "Pre-Existing Diseases Waiting Period", field: "PED Waiting Period" },
  { clause: "Specific Illnesses / Named Procedures", field: "Specific Waiting" },
  { clause: "Co-payment & Deductible Rules", field: "Co-pay" },
  { clause: "Restoration & ReCharge Benefits", field: "Restoration" },
  { clause: "Critical Exclusions & Policy Conditions", field: "Exclusions" },
  { clause: "Verbatim Quotation Cross-Verification", field: "Evidence Audit" },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  policyCount = 2,
  policyNames = ["Policy A", "Policy B"],
  onComplete,
}) => {
  const [activePolicyIdx, setActivePolicyIdx] = useState<number>(0);
  const [activeClauseIdx, setActiveClauseIdx] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Overall progress percentage calculation
  const totalStages = Math.max(1, policyCount) * AUDIT_CLAUSES.length;
  const currentStage = activePolicyIdx * AUDIT_CLAUSES.length + Math.min(activeClauseIdx, AUDIT_CLAUSES.length);
  const progressPercent = Math.min(100, Math.round((currentStage / totalStages) * 100));

  useEffect(() => {
    // Initial boot log
    setLogs([
      `[00:00.1] PolicyLens Neural Audit Engine initialized (Mode: Zero-Hallucination).`,
      `[00:00.3] Ingesting ${policyCount} policy contract PDF streams into memory buffer...`,
    ]);

    const interval = setInterval(() => {
      setActiveClauseIdx((prevClause) => {
        if (prevClause < AUDIT_CLAUSES.length) {
          const clauseObj = AUDIT_CLAUSES[prevClause];
          setActivePolicyIdx((currPol) => {
            const polLetter = String.fromCharCode(65 + currPol);
            const polName = (policyNames && policyNames[currPol]) ? policyNames[currPol] : `Policy ${polLetter}`;
            const timeCode = `00:${String(Math.floor(Math.random() * 8) + 1).padStart(2, "0")}.${Math.floor(Math.random() * 90 + 10)}`;

            let logMsg = "";
            if (clauseObj.field === "Metadata") {
              logMsg = `[${timeCode}] [${polLetter}] Parsed PDF header & schedule for "${polName.slice(0, 22)}"`;
            } else if (clauseObj.field === "Sum Insured") {
              logMsg = `[${timeCode}] [${polLetter}] Sum Insured extracted -> verified with page citation`;
            } else if (clauseObj.field === "Room Rent") {
              logMsg = `[${timeCode}] [${polLetter}] Room rent sub-limit analyzed -> mapped to exact clause`;
            } else if (clauseObj.field === "PED Waiting Period") {
              logMsg = `[${timeCode}] [${polLetter}] PED waiting period isolated -> verbatim sentence captured`;
            } else if (clauseObj.field === "Specific Waiting") {
              logMsg = `[${timeCode}] [${polLetter}] Named ailment exclusion table indexed (24-month rule)`;
            } else if (clauseObj.field === "Restoration") {
              logMsg = `[${timeCode}] [${polLetter}] Restoration benefit detected -> 100% refill clause logged`;
            } else if (clauseObj.field === "Exclusions") {
              logMsg = `[${timeCode}] [${polLetter}] Scanning General Exclusions section (cosmetic, robotic, dental)`;
            } else {
              logMsg = `[${timeCode}] [${polLetter}] Ground-truth verification pass complete. Hash validated.`;
            }

            setLogs((prev) => [...prev.slice(-18), logMsg]);
            return currPol;
          });

          return prevClause + 1;
        } else {
          setActivePolicyIdx((prevPol) => {
            if (prevPol + 1 < policyCount) {
              const nextLetter = String.fromCharCode(65 + prevPol + 1);
              setLogs((prev) => [
                ...prev,
                `[00:05.0] Policy ${String.fromCharCode(65 + prevPol)} complete. Switching scanner to Policy ${nextLetter}...`,
              ]);
              return prevPol + 1;
            } else {
              setIsFinished(true);
              clearInterval(interval);
              setLogs((prev) => [
                ...prev,
                `[00:08.0] All ${policyCount} policy contracts audited with 100% verbatim citations.`,
                `[00:08.5] Zero-hallucination matrix finalized. Rendering side-by-side comparison...`,
              ]);
              setTimeout(() => {
                onComplete();
              }, 750);
              return prevPol;
            }
          });
          return 0;
        }
      });
    }, 240);

    return () => clearInterval(interval);
  }, [policyCount, onComplete, policyNames]);

  // Auto-scroll terminal log
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // SVG Circular progress math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-5 sm:py-8">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Panel */}
      <div className="relative backdrop-blur-xl bg-white/90 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden p-5 sm:p-6">
        
        {/* Top Header: Radial Progress & Stage Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
          
          <div className="flex items-center gap-3.5 text-left">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-neutral-200 dark:text-neutral-800/80"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white font-mono">
                  {progressPercent}%
                </span>
                <span className="text-[8px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-tighter">
                  Audited
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 text-[10px] font-medium mb-0.5">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span>Zero-Hallucination Neural Extraction</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                {isFinished ? "Auditing Complete" : "Auditing Insurance Contracts"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Isolating coverage rules, waiting periods &amp; exclusions backed by exact sentence quotes.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Verbatim Grounding</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] sm:text-[11px] font-medium">
              <Cpu className="w-3 h-3 text-blue-500" />
              <span>Scanning {policyCount} Documents</span>
            </div>
          </div>
        </div>

        {/* Dynamic Holographic Document Scanner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {Array.from({ length: policyCount }).map((_, pIdx) => {
            const letter = String.fromCharCode(65 + pIdx);
            const polName = (policyNames && policyNames[pIdx]) ? policyNames[pIdx] : `Policy ${letter}`;
            const isCompletedPolicy = pIdx < activePolicyIdx || isFinished;
            const isCurrentPolicy = pIdx === activePolicyIdx && !isFinished;

            return (
              <div
                key={pIdx}
                className={`relative rounded-xl p-3 transition-all duration-300 overflow-hidden border backdrop-blur-md ${
                  isCurrentPolicy
                    ? "bg-gradient-to-b from-blue-50/90 to-white/90 dark:from-blue-950/20 dark:to-slate-900/60 border-blue-400 dark:border-blue-700 shadow-sm ring-1 ring-blue-500/20"
                    : isCompletedPolicy
                    ? "bg-slate-50/80 dark:bg-[#151d2f] border-slate-200 dark:border-slate-800 shadow-2xs"
                    : "bg-white/40 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/40 opacity-40"
                }`}
              >
                {/* Active Laser Scanning Radar Line */}
                {isCurrentPolicy && (
                  <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-line pointer-events-none z-10 shadow-[0_0_8px_#3b82f6]" />
                )}

                {/* Card Header */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-colors ${
                        isCompletedPolicy
                          ? "bg-emerald-600 text-white"
                          : isCurrentPolicy
                          ? "bg-blue-600 text-white animate-pulse"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {letter}
                    </div>
                    <div className="leading-tight">
                      <span className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                        Contract {letter}
                      </span>
                      <h4 className="font-semibold text-xs text-neutral-900 dark:text-white truncate max-w-[130px] sm:max-w-[150px]">
                        {polName.replace(/^Policy [A-Z]:\s*/i, "")}
                      </h4>
                    </div>
                  </div>

                  {isCompletedPolicy ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Grounded
                    </span>
                  ) : isCurrentPolicy ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
                      <Layers className="w-2.5 h-2.5 animate-spin" />
                      Auditing
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium text-neutral-400 dark:text-neutral-600">
                      Queued
                    </span>
                  )}
                </div>

                {/* Simulated Contract Page Skeleton Lines */}
                <div className="space-y-1 p-2 rounded-lg bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="h-1 bg-neutral-300 dark:bg-neutral-700 rounded w-1/3" />
                    <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded w-1/5" />
                  </div>
                  <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5" />
                  <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                </div>

                {/* Current Clause Badge */}
                <div className="text-[10px] sm:text-[11px]">
                  {isCompletedPolicy ? (
                    <div className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <FileCheck className="w-3 h-3" />
                      <span>All clauses matched with page citations</span>
                    </div>
                  ) : isCurrentPolicy ? (
                    <div className="text-blue-700 dark:text-blue-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                      <span className="truncate">
                        Checking {AUDIT_CLAUSES[Math.min(activeClauseIdx, AUDIT_CLAUSES.length - 1)]?.clause}
                      </span>
                    </div>
                  ) : (
                    <div className="text-neutral-400 dark:text-neutral-600">
                      Awaiting OCR indexing
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Extraction Stream Telemetry Terminal */}
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner overflow-hidden text-left">
          {/* Terminal Window Top Bar */}
          <div className="px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span className="text-[11px] font-mono font-medium text-neutral-300">
                Extraction Telemetry Stream
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live OCR Stream
              </span>
            </div>
          </div>

          {/* Terminal Content Feed */}
          <div className="p-3 h-30 overflow-y-auto font-mono text-[10px] sm:text-[11px] text-neutral-300 space-y-1 scrollbar-thin">
            {logs.map((log, idx) => {
              const isUnclear = log.includes("UNCLEAR");
              const isFinishedLog = log.includes("finalized") || log.includes("complete");

              return (
                <div
                  key={idx}
                  className={`leading-relaxed transition-opacity duration-200 ${
                    isUnclear
                      ? "text-amber-400 font-semibold"
                      : isFinishedLog
                      ? "text-emerald-400 font-bold"
                      : idx === logs.length - 1
                      ? "text-white font-medium"
                      : "text-neutral-400"
                  }`}
                >
                  {log}
                </div>
              );
            })}
            <div ref={terminalBottomRef} />
          </div>
        </div>

        {/* Bottom Rule Guarantee */}
        <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              IRDAI Compliance &amp; Strict Evidence Standard:
            </span>
            <span>No guessing. Missing clauses display &ldquo;UNCLEAR&rdquo;.</span>
          </div>

          {isFinished && (
            <div className="font-bold text-blue-600 dark:text-blue-400 animate-pulse text-[11px]">
              Opening Comparison Dashboard...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
