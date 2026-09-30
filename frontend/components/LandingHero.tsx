"use client";

import React from "react";
import { ArrowRight, Sparkles, AlertCircle, FileSearch, ShieldCheck, Scale, FileText } from "lucide-react";

interface LandingHeroProps {
  onStartComparison: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartComparison, onViewDemo }) => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Background ambient accents - subtle dark slate glow */}
      <div className="absolute inset-0 bg-radial from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Feature Pill - Evidence Backed */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-700/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Zero-Hallucination Policy Comparison - Verbatim Citations</span>
          </div>
        </div>

        {/* Refined Main Hero Title - Sleek, Balanced, Premium FinTech Typography */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Decode your insurance policy instantly
          <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400 ml-1.5 sm:ml-0 sm:block mt-2">Zero-hallucination, evidence-backed.</span>
        </h1>

        {/* Subtitle - Sleek & Compact */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-8">
          Compare coverage limits, waiting periods, room rent caps, and hidden exclusions using verified verbatim quotes extracted directly from original policy contracts.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-600 shadow-sm transform hover:scale-[1.02] transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Load 3 Demo Policies</span>
          </button>
        </div>

        {/* Interactive Feature Cards - Refined & Balanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Verifiable Citations</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Every fact links to an exact verbatim clause sentence and specific page number in the contract PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Strict UNCLEAR Rule</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 uppercase">
                STRICT
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              If a clause or waiting period is omitted, our AI flags it as <strong className="text-amber-600 dark:text-amber-400 font-semibold">UNCLEAR</strong>. Zero hallucination.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Side-by-Side Matrix</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Evaluate 2 to 3 policies across room rent, waiting times, deductibles, and exclusions in a clean matrix.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-8 bg-slate-50/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Preloaded Demo Suite Available</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Includes Policy A (SecureCare), Policy B (HealthShield), and Policy C (which triggers the strict UNCLEAR guard).
              </p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 cursor-pointer"
          >
            Launch Demo -{'>'}
          </button>
        </div>
      </div>
    </div>
  );
};
