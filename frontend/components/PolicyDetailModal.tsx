"use client";

import React from "react";
import { PolicyExtraction } from "../types";
import { X, AlertTriangle, BookOpen, FileText, Ban } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-black">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-blue-200 dark:border-neutral-800">
                Policy Overview
              </span>
              <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px]">
                {policy.filename}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">{policy.name}</h2>
            <p className="text-[11px] text-neutral-500 font-medium">{policy.insurer} • {policy.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
              <div className="text-[10px] font-semibold text-neutral-400 uppercase">Coverage</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{policy.coverage}</div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Sum Insured</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
              <div className="text-[10px] font-semibold text-neutral-400 uppercase">Annual Premium</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{policy.premium}</div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Base per year</div>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                isWaitingPeriodUnclear
                  ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-neutral-900"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black"
              }`}
            >
              <div className="text-[10px] font-semibold text-neutral-400 uppercase">Waiting Period</div>
              <div
                className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${
                  isWaitingPeriodUnclear ? "text-amber-700 dark:text-amber-400" : "text-neutral-900 dark:text-white"
                }`}
              >
                {isWaitingPeriodUnclear && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                {policy.waiting_period}
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                {isWaitingPeriodUnclear ? "No clause in PDF" : "Pre-existing ailments"}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
              <div className="text-[10px] font-semibold text-neutral-400 uppercase">Deductible</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{policy.deductible}</div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Cost sharing</div>
            </div>
          </div>

          {/* Section: Grounded Clauses with Exact Evidence */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Extracted Policy Terms &amp; Verified Evidence</span>
            </h3>

            <div className="space-y-2">
              {Object.entries(policy.evidence_map).map(([key, ev]) => {
                const isFieldUnclear = ev.value === "UNCLEAR";
                return (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900 dark:text-white capitalize">
                        {key.replace("_", " ")}
                      </span>
                      {isFieldUnclear ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-neutral-900 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          UNCLEAR
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-neutral-900 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-900/60">
                          Page {ev.page || 1}
                        </span>
                      )}
                    </div>

                    {isFieldUnclear ? (
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 italic">
                        {ev.reason || "No explicit clause was found in the provided policy document."}
                      </p>
                    ) : (
                      <>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
                          &ldquo;{ev.quote}&rdquo;
                        </p>
                        {ev.section && (
                          <span className="text-[10px] text-neutral-400 block mt-1 font-mono">
                            Section: {ev.section}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Exclusions */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Ban className="w-3.5 h-3.5 text-red-500" />
              <span>Standard Exclusions</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {policy.exclusions.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-black">
          <button
            onClick={() => onOpenPdf(policy.id, 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Source Document</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
