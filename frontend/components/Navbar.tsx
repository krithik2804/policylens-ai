"use client";

import React from "react";
import { ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface NavbarProps {
  onReset: () => void;
  onOpenDemo: () => void;
  currentStep: "landing" | "questions" | "upload" | "analysis" | "comparison";
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onOpenDemo, currentStep }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">PolicyLens AI</span>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Understand your insurance policy before you pay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Zero-Hallucination Engine Active</span>
          </div>

          {currentStep !== "comparison" ? (
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Try Demo Mode
            </button>
          ) : (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              New Comparison
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
