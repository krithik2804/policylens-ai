"use client";

import React from "react";
import { ArrowRight, Sparkles, AlertCircle, FileSearch, ShieldCheck, Scale, FileText } from "lucide-react";

interface LandingHeroProps {
  onStartComparison: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartComparison, onViewDemo }) => {
  return (
    <div className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Background ambient accents - subtle pure black friendly */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Feature Pill - Evidence Backed */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-neutral-900 border border-blue-200/80 dark:border-neutral-800 text-blue-700 dark:text-blue-400 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Zero-Hallucination Policy Comparison • Verbatim Citations</span>
          </div>
        </div>

        {/* Refined Main Hero Title - Clear, Bold & Commanding */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.18] mb-4">
          Understand your insurance policy <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">before you pay.</span>
        </h1>

        {/* Subtitle - Readable & Clear */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal mb-8">
          Compare coverage limits, waiting periods, room rent caps, and hidden exclusions using verified verbatim quotes extracted directly from original policy contracts.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-md transition active:scale-95 cursor-pointer"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5.5 py-3 rounded-xl bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm sm:text-base border border-neutral-300 dark:border-neutral-800 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Load 3 Demo Policies</span>
          </button>
        </div>

        {/* Interactive Feature Cards - Legible & Well Proportioned */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <FileSearch className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base mb-1.5">Verifiable Citations</h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every fact links to an exact verbatim clause sentence and specific page number in the contract PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-neutral-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">Strict UNCLEAR Rule</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                STRICT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If a clause or waiting period is omitted, our AI flags it as <strong className="text-amber-600 dark:text-amber-400 font-semibold">UNCLEAR</strong>. Zero hallucination.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Scale className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base mb-1.5">Side-by-Side Matrix</h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Evaluate 2 to 3 policies across room rent, waiting times, deductibles, and exclusions in a clean matrix.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-8 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Preloaded Demo Suite Available</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Includes Policy A (SecureCare), Policy B (HealthShield), and Policy C (which triggers the strict UNCLEAR guard).
              </p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0 cursor-pointer"
          >
            Launch Demo →
          </button>
        </div>
      </div>
    </div>
  );
};
