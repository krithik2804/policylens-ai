"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, X, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface UploadPoliciesProps {
  onStartAnalysis: (files: File[]) => void;
  onUseDemoData: () => void;
  onBack: () => void;
}

export const UploadPolicies: React.FC<UploadPoliciesProps> = ({
  onStartAnalysis,
  onUseDemoData,
  onBack,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const validPdfs: File[] = [];

    Array.from(incoming).forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage(`"${file.name}" is not a PDF. Only PDF contracts are supported.`);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" is too large. Max file size is 25MB.`);
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
  };

  const handleAnalyzeClick = () => {
    if (selectedFiles.length < 2) {
      setErrorMessage("Please upload at least 2 policy documents to begin comparison.");
      return;
    }
    onStartAnalysis(selectedFiles);
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Step Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Requirements</span>
        </button>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
          Step 2 of 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Upload Policy Documents
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload 2 or 3 health insurance policy PDFs for side-by-side evidence extraction.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition ${
          dragActive
            ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40"
            : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
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

        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Drag &amp; drop policy PDFs here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Accepts 2 to 3 official insurance policy PDFs (up to 25MB each).
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
          <span>Min: 2 policies • Max: 3 policies</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Staged Documents ({selectedFiles.length} / 3)</span>
          {selectedFiles.length < 2 && (
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Add {2 - selectedFiles.length} more to compare</span>
          )}
        </div>

        {selectedFiles.length === 0 ? (
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-400 dark:text-slate-500">
            No policies uploaded yet. Drag files above or click the button below to test with demo policies.
          </div>
        ) : (
          selectedFiles.map((file, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {letter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{`Policy ${letter}`}</span>
                      <span className="text-xs text-slate-400 font-mono">({formatSize(file.size)})</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-md">
                      {file.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>PDF ready</span>
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition"
                    title="Remove document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onUseDemoData}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Load 3 Hackathon Demo Policies (A, B, C)</span>
        </button>

        <button
          onClick={handleAnalyzeClick}
          disabled={selectedFiles.length < 2}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition active:scale-98 ${
            selectedFiles.length >= 2
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
          }`}
        >
          <span>Analyze Policies ({selectedFiles.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
