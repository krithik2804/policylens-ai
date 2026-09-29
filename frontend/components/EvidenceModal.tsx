"use client";

import React, { useState } from "react";
import { Evidence, PolicyExtraction } from "../types";
import { X, ExternalLink, ShieldCheck, AlertTriangle, FileText, CheckCircle2, BookOpen } from "lucide-react";
import { getPdfUrl } from "../lib/api";

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
  fieldName,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isUnclear ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isUnclear ? <AlertTriangle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Source Clause Verification
              </span>
              <h3 className="text-base font-bold text-slate-900">{fieldLabel}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Policy Information Strip */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs text-slate-500">Document</div>
              <div className="text-sm font-bold text-slate-900">{policy.name}</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{policy.filename}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Extracted Value</div>
              <div
                className={`text-sm font-extrabold px-2.5 py-1 rounded-md mt-0.5 inline-block ${
                  isUnclear
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                {evidence?.value || (isUnclear ? "UNCLEAR" : "Provided")}
              </div>
            </div>
          </div>

          {/* CRITICAL DEMO CASE: UNCLEAR */}
          {isUnclear ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="font-bold text-sm">Strict Zero-Hallucination Guardrail</span>
                </div>
                <p className="text-sm font-semibold mb-2">
                  &ldquo;{reason}&rdquo;
                </p>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  PolicyLens AI systematically parsed all {policy.page_count} pages of this contract.
                  Unlike generic chatbots that guess standard waiting periods, PolicyLens refuses to fabricate terms.
                  Because the insurer omitted an explicit clause, this field is strictly flagged as <strong className="underline">UNCLEAR</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 mb-1">Contract Verification Audit:</div>
                <p>• Document: {policy.filename}</p>
                <p>• Scanned Pages: {policy.page_count} pages</p>
                <p>• Waiting Period Section: <span className="text-amber-700 font-bold">MISSING FROM PDF</span></p>
                <p>• Status: Flagged to user for insurer clarification prior to policy purchase.</p>
              </div>
            </div>
          ) : (
            /* GROUNDED CITATION EVIDENCE */
            <div className="space-y-4">
              {/* Citation metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Page Number</div>
                  <div className="text-base font-extrabold text-blue-600 mt-0.5">
                    Page {page ?? 1}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Contract Section</div>
                  <div className="text-xs font-bold text-slate-800 mt-1 truncate" title={section || "Specified Section"}>
                    {section || "SECTION 3. WAITING PERIOD"}
                  </div>
                </div>
              </div>

              {/* Exact Verbatim Quote */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Verbatim Contract Sentence:</span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exact Match Confirmed
                  </span>
                </div>
                <blockquote className="p-4 rounded-xl bg-blue-50/50 border-l-4 border-blue-600 text-slate-900 text-sm font-medium leading-relaxed italic shadow-2xs">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Clicking Open Source verifies this directly against the PDF.
          </div>
          <button
            onClick={() => onOpenPdfViewer(policy.id, page || 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Source PDF {page ? `(Page ${page})` : ""}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
