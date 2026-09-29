"use client";

import React from "react";
import { ArrowRight, Sparkles, AlertCircle, FileSearch, ShieldCheck, Scale, FileText } from "lucide-react";

interface LandingHeroProps {
  onStartComparison: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartComparison, onViewDemo }) => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Background ambient accents - subtle pure black friendly */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-neutral-900/40 dark:via-black/80 dark:to-transparent pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-neutral-900 border border-blue-200/80 dark:border-neutral-800 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-6 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Evidence-backed comparison. Zero guessed coverage.</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.18] mb-4">
          Understand your insurance policy <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">before you pay.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-8">
          Compare coverage limits, waiting periods, room rent caps, and hidden exclusions using verified verbatim quotes extracted directly from original policy documents.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm border border-neutral-300 dark:border-neutral-800 shadow-2xs transition active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>View Demo (3 Mock Policies)</span>
          </button>
        </div>

        {/* Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <FileSearch className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">Verifiable Citations</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every extracted fact links to an exact verbatim clause sentence and specific page number in the contract PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-neutral-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Strict UNCLEAR Rule</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                STRICT
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If a clause or waiting period is omitted, our AI flags it as <strong className="text-amber-600 dark:text-amber-400 font-medium">UNCLEAR</strong>. It will never guess or hallucinate.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">Side-by-Side Matrix</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Evaluate 2 to 3 policies across room rent caps, waiting durations, deductibles, and exclusions in a clean matrix.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-8 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">Preloaded Demo Suite Available</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Includes Policy A (SecureCare), Policy B (HealthShield), and Policy C (which has no waiting period to trigger the strict UNCLEAR guard).
              </p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Launch Demo →
          </button>
        </div>
      </div>
    </div>
  );
};
