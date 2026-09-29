"use client";

import React from "react";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { getPdfUrl } from "../lib/api";

interface PdfViewerModalProps {
  policyId: string | null;
  policyName?: string;
  page?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  policyId,
  policyName,
  page = 1,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !policyId) return null;

  const pdfUrl = `${getPdfUrl(policyId)}#page=${page}&view=FitH`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[92vh] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {policyName || "Policy Contract PDF"}
                </span>
                <span className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Page {page} Target
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ground-truth original contract document parsed with PyMuPDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
          <iframe
            src={pdfUrl}
            title="Policy Contract PDF Document"
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Verifying authentic contract clauses directly in the original PDF.</span>
          <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">PolicyLens Zero-Hallucination Grounding</span>
        </div>
      </div>
    </div>
  );
};
