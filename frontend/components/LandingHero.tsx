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
        {/* Official Brand Logo Presentation */}
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="p-2 rounded-2xl bg-white/50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 shadow-sm backdrop-blur-xs mb-3">
            <img
              src="/logo.png"
              alt="PolicyLens AI"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-neutral-900 border border-blue-200/80 dark:border-neutral-800 text-blue-700 dark:text-blue-400 text-[10px] font-semibold shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Evidence-backed comparison. Zero guessed clauses.</span>
          </div>
        </div>

        {/* Refined Main Hero Title - Crisp & Proportioned */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight leading-snug mb-2.5">
          Understand your insurance policy <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">before you pay.</span>
        </h1>

        {/* Subtitle - Compact & Clear */}
        <p className="max-w-lg mx-auto text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal mb-6">
          Compare coverage limits, waiting periods, room rent caps, and hidden exclusions using verified verbatim quotes extracted directly from original policy contracts.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-10">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition active:scale-98"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs border border-neutral-300 dark:border-neutral-800 shadow-2xs transition active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Load 3 Demo Policies</span>
          </button>
        </div>

        {/* Interactive Feature Cards - Refined & Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <FileSearch className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-xs mb-1">Verifiable Citations</h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every fact links to an exact verbatim clause sentence and specific page number in the contract PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-neutral-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white text-xs">Strict UNCLEAR Rule</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                STRICT
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If a clause or waiting period is omitted, our AI flags it as <strong className="text-amber-600 dark:text-amber-400 font-medium">UNCLEAR</strong>. Zero hallucination.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-xs mb-1">Side-by-Side Matrix</h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Evaluate 2 to 3 policies across room rent, waiting times, deductibles, and exclusions in a clean matrix.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-6 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-left">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">Preloaded Demo Suite Available</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Includes Policy A (SecureCare), Policy B (HealthShield), and Policy C (which triggers the strict UNCLEAR guard).
              </p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Launch Demo →
          </button>
        </div>
      </div>
    </div>
  );
};
