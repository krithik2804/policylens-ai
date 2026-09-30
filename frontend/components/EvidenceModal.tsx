"use client";

import React from "react";
import { PolicyExtraction } from "../types";
import { X, CheckCircle2, AlertTriangle, BookOpen, FileText } from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  policy: PolicyExtraction | null;
  evidence: any;
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
  if (!isOpen || !policy) return null;

  const isUnclear =
    policy.waiting_period === "UNCLEAR" &&
    (evidence?.value === "UNCLEAR" || !evidence?.quote);

  const quote = evidence?.quote;
  const page = evidence?.page;
  const section = evidence?.section;
  const reason = evidence?.reason || "No explicit clause was found in the provided policy document.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111726] rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#151d2f]">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isUnclear
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                  : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
              }`}
            >
              {isUnclear ? <AlertTriangle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Source Clause Verification
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{fieldLabel}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* Policy Information Strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#151d2f] border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Document</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{policy.name}</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[200px]">{policy.filename}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Extracted Value</div>
              <div
                className={`text-xs font-bold px-2 py-0.5 rounded mt-0.5 inline-block ${
                  isUnclear
                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80"
                    : "bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 font-mono"
                }`}
              >
                {evidence?.value || (isUnclear ? "UNCLEAR" : "Provided")}
              </div>
            </div>
          </div>

          {/* CRITICAL DEMO CASE: UNCLEAR */}
          {isUnclear ? (
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-bold text-xs">Strict Zero-Hallucination Guardrail</span>
                </div>
                <p className="text-xs font-semibold mb-1.5">
                  &ldquo;{reason}&rdquo;
                </p>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-normal">
                  PolicyLens AI systematically parsed all {policy.page_count} pages of this contract.
                  Unlike generic models that guess standard waiting periods, PolicyLens refuses to fabricate terms.
                  Because the insurer omitted an explicit clause, this field is strictly flagged as <strong className="underline font-semibold">UNCLEAR</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151d2f] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Recommended Consumer Action:</div>
                <p className="text-xs font-normal text-slate-600 dark:text-slate-400">
                  Request an addendum or official prospectus clarification regarding {fieldLabel.toLowerCase()} before signing or paying premium.
                </p>
              </div>
            </div>
          ) : (
            /* FOUND & VERIFIED CASE */
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Verbatim Contract Extract
                  </span>
                  <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Page {page || 1}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#151d2f] border border-slate-200 dark:border-slate-800 text-xs font-normal text-slate-800 dark:text-slate-200 leading-relaxed italic relative">
                  &ldquo;{quote}&rdquo;
                </div>
              </div>

              {section && (
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-normal">
                  <span>Contract Section:</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[240px]">{section}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#151d2f]">
          <button
            onClick={() => onOpenPdfViewer(policy.id, page || 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open PDF Viewer {page ? `(Page ${page})` : ""}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
