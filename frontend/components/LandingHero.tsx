"use client";

import React from "react";
import { ArrowRight, Sparkles, AlertCircle, FileSearch, ShieldCheck, Scale, FileText } from "lucide-react";

interface LandingHeroProps {
  onStartComparison: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartComparison, onViewDemo }) => {
  return (
    <div className="relative overflow-hidden py-8 sm:py-12 lg:py-14">
      {/* Background ambient accents - subtle dark slate glow */}
      <div className="absolute inset-0 bg-radial from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Feature Pill - Evidence Backed */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-700/80 text-blue-700 dark:text-blue-300 text-[11px] font-medium shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Zero-Hallucination Policy Comparison • Verbatim Citations</span>
          </div>
        </div>

        {/* Refined Main Hero Title - Balanced, Premium SaaS Proportion */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug mb-3">
          Decode your insurance policy instantly
          <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400 ml-1.5 sm:ml-0 sm:block">Zero-hallucination, evidence-backed.</span>
        </h1>

        {/* Subtitle - Clean & Proportionate */}
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-7">
          Compare coverage limits, waiting periods, room rent caps, and hidden exclusions using verified verbatim quotes extracted directly from original policy contracts.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-sm transition transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#111726] dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm border border-slate-300 dark:border-slate-700/80 shadow-xs transform hover:scale-[1.02] transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Load 3 Demo Policies</span>
          </button>
        </div>

        {/* Interactive Feature Cards - Legible & Refined Proportion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#111726] p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <FileSearch className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">Verifiable Citations</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every fact links to an exact verbatim clause sentence and specific page number in the contract PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111726] p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">Strict UNCLEAR Rule</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                STRICT
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              If a clause or waiting period is omitted, our AI flags it as <strong className="text-amber-600 dark:text-amber-400 font-semibold">UNCLEAR</strong>. Zero hallucination.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111726] p-4 rounded-xl border border-slate-200 dark:border-slate-800/90 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5">
              <Scale className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">Side-by-Side Matrix</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Evaluate 2 to 3 policies across room rent, waiting times, deductibles, and exclusions in a clean matrix.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-6 bg-slate-50/80 dark:bg-[#111726] border border-slate-200 dark:border-slate-800/90 rounded-xl p-3.5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-left">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Preloaded Demo Suite Available</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
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
