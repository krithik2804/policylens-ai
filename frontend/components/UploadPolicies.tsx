"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, X, Sparkles, ArrowRight, ArrowLeft, RefreshCw, FileX } from "lucide-react";

interface UploadPoliciesProps {
  onStartAnalysis: (files: File[]) => void;
  onUseDemoData: () => void;
  onBack: () => void;
  uploadError?: string | null;
  onClearError?: () => void;
}

export const UploadPolicies: React.FC<UploadPoliciesProps> = ({
  onStartAnalysis,
  onUseDemoData,
  onBack,
  uploadError,
  onClearError,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external uploadError from server validation
  useEffect(() => {
    if (uploadError) {
      setErrorMessage(uploadError);
    }
  }, [uploadError]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndAddFiles = (incoming: FileList | File[]) => {
    setErrorMessage(null);
    if (onClearError) onClearError();
    const validPdfs: File[] = [];

    Array.from(incoming).forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage(`"${file.name}" is not a PDF. Only official PDF contracts are supported.`);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds maximum allowed file size of 25MB.`);
        return;
      }
      validPdfs.push(file);
    });

    const combined = [...selectedFiles, ...validPdfs].slice(0, 3);
    setSelectedFiles(combined);

    if ([...selectedFiles, ...validPdfs].length > 3) {
      setErrorMessage("Maximum 3 policies can be compared simultaneously.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const removeFile = (idx: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
    setErrorMessage(null);
    if (onClearError) onClearError();
  };

  const handleAnalyzeClick = () => {
    if (selectedFiles.length < 2) {
      setErrorMessage("Please upload at least 2 policy documents to begin comparison.");
      return;
    }
    setErrorMessage(null);
    if (onClearError) onClearError();
    onStartAnalysis(selectedFiles);
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Step Header */}
      <div className="mb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Preferences</span>
        </button>
        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase block">
          Step 2 of 3
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
          Upload Policy Documents
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Upload 2 or 3 health insurance policy PDFs for side-by-side evidence extraction.
        </p>
      </div>

      {/* Prominent Error Alert if Invalid Document Uploaded */}
      {errorMessage && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-neutral-900/90 border border-red-200 dark:border-red-900/60 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileX className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                  Document Validation Error
                </h4>
                <button
                  onClick={() => {
                    setErrorMessage(null);
                    if (onClearError) onClearError();
                  }}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1 leading-relaxed">
                {errorMessage}
              </p>
              <div className="mt-2.5 pt-2 border-t border-red-200/60 dark:border-red-900/40 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" />
                <span>Please select a valid health or motor insurance contract or brochure with readable text.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-5 sm:p-7 text-center transition ${
          dragActive
            ? "border-blue-600 bg-blue-50/50 dark:bg-neutral-900/50"
            : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-white dark:bg-[#0a0a0a]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
          <UploadCloud className="w-4 h-4" />
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">
          Drag &amp; drop policy PDFs here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
        </h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
          Accepts 2 to 3 official insurance policy PDFs (up to 25MB each).
        </p>

        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[10px] font-medium border border-neutral-200 dark:border-neutral-800">
          <span>Min: 2 policies • Max: 3 policies</span>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span>Staged Documents ({selectedFiles.length} / 3)</span>
          {selectedFiles.length < 2 && (
            <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
              Add {2 - selectedFiles.length} more to compare
            </span>
          )}
        </div>

        {selectedFiles.length === 0 ? (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0a0a0a] text-center text-xs text-neutral-400 dark:text-neutral-500">
            No policies uploaded yet. Drag files above or click the button below to test with demo policies.
          </div>
        ) : (
          selectedFiles.map((file, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0a0a0a] p-2.5 sm:p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                    {letter}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-white">{`Policy ${letter}`}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">({formatSize(file.size)})</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[220px] sm:max-w-md">
                      {file.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Ready</span>
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded transition"
                    title="Remove document"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onUseDemoData}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold shadow-2xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Try Preloaded Demo Policies</span>
        </button>

        <button
          onClick={handleAnalyzeClick}
          disabled={selectedFiles.length < 2}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4.5 py-2 rounded-lg font-semibold text-xs transition active:scale-98 ${
            selectedFiles.length >= 2
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              : "bg-neutral-200 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-transparent dark:border-neutral-800"
          }`}
        >
          <span>Analyze Policies ({selectedFiles.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
