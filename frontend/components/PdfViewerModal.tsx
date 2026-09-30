"use client";

import React from "react";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { getPdfUrl } from "../lib/api";

interface PdfViewerModalProps {
  isOpen: boolean;
  policyId: string | null;
  policyName?: string;
  page?: number;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  policyId,
  policyName,
  page = 1,
  onClose,
}) => {
  if (!isOpen || !policyId) return null;

  const pdfUrl = `${getPdfUrl(policyId)}#page=${page}&view=FitH`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111726] rounded-xl w-full max-w-5xl h-[90vh] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#151d2f]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {policyName || "Policy Contract PDF"}
                </span>
                <span className="text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded border border-blue-200 dark:border-slate-700">
                  Page {page} Target
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ground-truth contract document parsed by PolicyLens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg transition"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 bg-slate-100 dark:bg-[#0b0f19] relative">
          <iframe
            src={pdfUrl}
            title="Policy Contract PDF Document"
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-2 bg-slate-50 dark:bg-[#151d2f] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Verifying contract clauses directly in the original PDF.</span>
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">PolicyLens Grounding Guard</span>
        </div>
      </div>
    </div>
  );
};
