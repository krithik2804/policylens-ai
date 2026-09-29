"use client";

import React from "react";
import { Evidence, PolicyExtraction } from "../types";
import { X, AlertTriangle, FileText, CheckCircle2, BookOpen } from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  policy: PolicyExtraction;
  evidence: Evidence | null | undefined;
  onOpenPdfViewer: (policyId: string, page?: number) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  fieldLabel,
  policy,
  evidence,
  onOpenPdfViewer,
}) => {
  if (!isOpen) return null;

  const isUnclear = !evidence || evidence.value === "UNCLEAR" || !evidence.quote;
  const quote = evidence?.quote;
  const page = evidence?.page;
  const section = evidence?.section;
  const reason = evidence?.reason || "No explicit clause was found in the provided policy document.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-black">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isUnclear
                  ? "bg-amber-100 dark:bg-neutral-900 text-amber-700 dark:text-amber-400"
                  : "bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400"
              }`}
            >
              {isUnclear ? <AlertTriangle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Source Clause Verification
              </span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{fieldLabel}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Policy Information Strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-black border border-neutral-200/80 dark:border-neutral-800">
            <div>
              <div className="text-[10px] text-neutral-400">Document</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white">{policy.name}</div>
              <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate max-w-[220px]">{policy.filename}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-neutral-400">Extracted Value</div>
              <div
                className={`text-xs font-bold px-2 py-0.5 rounded mt-0.5 inline-block ${
                  isUnclear
                    ? "bg-amber-100 dark:bg-neutral-900 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-blue-100 dark:bg-neutral-900 text-blue-900 dark:text-blue-300 font-mono"
                }`}
              >
                {evidence?.value || (isUnclear ? "UNCLEAR" : "Provided")}
              </div>
            </div>
          </div>

          {/* CRITICAL DEMO CASE: UNCLEAR */}
          {isUnclear ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-bold text-xs">Strict Zero-Hallucination Guardrail</span>
                </div>
                <p className="text-xs font-bold mb-1.5">
                  &ldquo;{reason}&rdquo;
                </p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed font-normal">
                  PolicyLens AI systematically parsed all {policy.page_count} pages of this contract.
                  Unlike generic models that guess standard waiting periods, PolicyLens refuses to fabricate terms.
                  Because the insurer omitted an explicit clause, this field is strictly flagged as <strong className="underline">UNCLEAR</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-white text-[11px]">Recommended Consumer Action:</div>
                <p className="text-[11px]">
                  Request an addendum or official prospectus clarification regarding {fieldLabel.toLowerCase()} before signing or paying premium.
                </p>
              </div>
            </div>
          ) : (
            /* FOUND & VERIFIED CASE */
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Verbatim Contract Extract
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Page {page || 1}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-black border border-neutral-200/90 dark:border-neutral-800 font-serif text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed italic relative">
                  &ldquo;{quote}&rdquo;
                </div>
              </div>

              {section && (
                <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                  <span>Contract Section:</span>
                  <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[260px]">{section}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-black">
          <button
            onClick={() => onOpenPdfViewer(policy.id, page || 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open PDF Viewer {page ? `(Page ${page})` : ""}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
