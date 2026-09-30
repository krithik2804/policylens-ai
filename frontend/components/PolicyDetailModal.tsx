"use client";

import React from "react";
import { PolicyExtraction } from "../types";
import { X, BookOpen, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111726] rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#151d2f]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                Policy Overview
              </span>
              <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                {policy.filename}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">{policy.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{policy.insurer} â€¢ {policy.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2f]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Coverage</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{policy.coverage}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sum Insured</div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2f]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Annual Premium</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{policy.premium}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Estimated Cost</div>
            </div>

            <div
              className={`p-2.5 rounded-lg border ${
                isWaitingPeriodUnclear
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2f]"
              }`}
            >
              <div className="text-[10px] font-semibold uppercase flex items-center justify-between">
                <span>Waiting Period</span>
                {isWaitingPeriodUnclear && <AlertTriangle className="w-3 h-3 text-amber-600" />}
              </div>
              <div
                className={`text-xs sm:text-sm font-bold mt-0.5 ${
                  isWaitingPeriodUnclear ? "text-amber-800 dark:text-amber-400 font-mono" : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {policy.waiting_period}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Initial / PED</div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2f]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Deductible</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{policy.deductible}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Per Claim / Co-pay</div>
            </div>
          </div>

          {/* Major Exclusions Breakdown */}
          {policy.major_exclusions_detailed && policy.major_exclusions_detailed.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Major Exclusions with Citations</span>
              </h3>
              <div className="space-y-2">
                {policy.major_exclusions_detailed.map((exc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151d2f] text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      <span>{exc.item}</span>
                      <button
                        onClick={() => onOpenPdf(policy.id, exc.page)}
                        className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Page {exc.page}</span>
                        <BookOpen className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      &ldquo;{exc.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard Exclusions Tags */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Standard Exclusions</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {policy.exclusions.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#151d2f]">
          <button
            onClick={() => onOpenPdf(policy.id, 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Source Document</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
