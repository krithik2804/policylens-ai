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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl w-full max-w-5xl h-[90vh] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-black">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                  {policyName || "Policy Contract PDF"}
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 px-1.5 py-0.2 rounded border border-blue-200 dark:border-neutral-800">
                  Page {page} Target
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Ground-truth contract document parsed by PolicyLens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 px-2.5 py-1 rounded-lg transition"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 bg-neutral-100 dark:bg-black relative">
          <iframe
            src={pdfUrl}
            title="Policy Contract PDF Document"
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-2 bg-neutral-50 dark:bg-black border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Verifying contract clauses directly in the original PDF.</span>
          <span className="font-mono text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">PolicyLens Grounding Guard</span>
        </div>
      </div>
    </div>
  );
};
