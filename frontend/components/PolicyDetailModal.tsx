"use client";

import React from "react";
import { PolicyExtraction } from "../types";
import { X, ShieldCheck, AlertTriangle, BookOpen, CheckCircle2, FileText, Ban } from "lucide-react";

interface PolicyDetailModalProps {
  policy: PolicyExtraction | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPdf: (policyId: string, page?: number) => void;
}

export const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  policy,
  isOpen,
  onClose,
  onOpenPdf,
}) => {
  if (!isOpen || !policy) return null;

  const isWaitingPeriodUnclear = policy.waiting_period === "UNCLEAR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Detailed Policy Breakdown
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {policy.filename}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{policy.name}</h2>
            <p className="text-xs text-slate-600">{policy.insurer} • {policy.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Coverage</div>
              <div className="text-base font-extrabold text-slate-900 mt-1">{policy.coverage}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Sum Insured</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Annual Premium</div>
              <div className="text-base font-extrabold text-slate-900 mt-1">{policy.premium}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Base per year</div>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isWaitingPeriodUnclear
                  ? "border-amber-300 bg-amber-50/60"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Waiting Period</div>
              <div
                className={`text-base font-extrabold mt-1 flex items-center gap-1.5 ${
                  isWaitingPeriodUnclear ? "text-amber-700" : "text-slate-900"
                }`}
              >
                {isWaitingPeriodUnclear && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {policy.waiting_period}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isWaitingPeriodUnclear ? "No clause in PDF" : "Pre-existing ailments"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Deductible</div>
              <div className="text-base font-extrabold text-slate-900 mt-1">{policy.deductible}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Cost sharing</div>
            </div>
          </div>

          {/* Section: Grounded Clauses with Exact Evidence */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Extracted Policy Terms &amp; Verified Evidence</span>
            </h3>

            <div className="space-y-3">
              {/* Coverage Evidence */}
              {policy.evidence_map.coverage && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">Sum Insured &amp; Scope:</span>
                    <span className="text-slate-500 font-medium">
                      Page {policy.evidence_map.coverage.page} • {policy.evidence_map.coverage.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    &ldquo;{policy.evidence_map.coverage.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Waiting Period Evidence */}
              <div
                className={`p-3.5 rounded-xl border ${
                  isWaitingPeriodUnclear
                    ? "border-amber-200 bg-amber-50/40"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {isWaitingPeriodUnclear && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                    Waiting Period Clause:
                  </span>
                  <span className="text-slate-500 font-medium">
                    {isWaitingPeriodUnclear
                      ? "Status: MISSING"
                      : `Page ${policy.evidence_map.waiting_period?.page} • ${policy.evidence_map.waiting_period?.section}`}
                  </span>
                </div>
                {isWaitingPeriodUnclear ? (
                  <p className="text-xs text-amber-900 bg-white/90 p-2.5 rounded-lg border border-amber-200 font-medium">
                    No explicit clause was found in the provided policy document. PolicyLens does not assume or infer a default waiting period.
                  </p>
                ) : (
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    &ldquo;{policy.evidence_map.waiting_period?.quote}&rdquo;
                  </p>
                )}
              </div>

              {/* Deductible Evidence */}
              {policy.evidence_map.deductible && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">Deductible &amp; Co-Payment:</span>
                    <span className="text-slate-500 font-medium">
                      Page {policy.evidence_map.deductible.page} • {policy.evidence_map.deductible.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    &ldquo;{policy.evidence_map.deductible.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Claim Conditions */}
              {policy.evidence_map.claim_conditions && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">Claim Intimation Procedure:</span>
                    <span className="text-slate-500 font-medium">
                      Page {policy.evidence_map.claim_conditions.page} • {policy.evidence_map.claim_conditions.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    &ldquo;{policy.evidence_map.claim_conditions.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Itemized Major Exclusions with Evidence (CORE REQUIREMENT) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-500" />
                <span>Major Exclusions ({policy.major_exclusions_detailed.length} identified)</span>
              </h3>
              <span className="text-xs text-slate-500">Each with individual citation</span>
            </div>

            <div className="space-y-3">
              {policy.major_exclusions_detailed.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">
                      {idx + 1}. {ex.item}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Page {ex.page}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    &ldquo;{ex.quote}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Source: <span className="font-semibold text-slate-700">{policy.filename}</span> ({policy.page_count} pages)
          </div>
          <button
            onClick={() => onOpenPdf(policy.id, 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Full Policy PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
