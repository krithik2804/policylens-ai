"use client";

import React from "react";
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle, FileSearch, ShieldCheck, Scale, FileText } from "lucide-react";

interface LandingHeroProps {
  onStartComparison: () => void;
  onViewDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartComparison, onViewDemo }) => {
  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/50 via-slate-50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium mb-8 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Evidence-backed comparison. No guessed coverage.</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
          Understand your insurance policy <br className="hidden sm:inline" />
          <span className="text-blue-600">before you pay.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-10">
          Compare coverage, waiting periods, exclusions and premiums using evidence directly from your policy documents.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartComparison}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md shadow-blue-500/25 transition active:scale-98"
          >
            <span>Compare Policies</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs transition active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>View Demo (3 Mock Policies)</span>
          </button>
        </div>

        {/* Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Verifiable Citations</h3>
            <p className="text-sm text-slate-600 leading-normal">
              Every single extracted fact is tied to an exact verbatim sentence and specific page number in the original contract PDF.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-base">Strict &ldquo;UNCLEAR&rdquo; Logic</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">CRITICAL</span>
            </div>
            <p className="text-sm text-slate-600 leading-normal">
              If an exclusion or waiting period is omitted from the contract, our AI marks it <strong className="text-amber-700">UNCLEAR</strong>. It will never guess or hallucinate.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Side-by-Side Comparison</h3>
            <p className="text-sm text-slate-600 leading-normal">
              Evaluate 2 to 3 policies across room rent caps, waiting durations, deductibles, and hidden exclusions at a glance.
            </p>
          </div>
        </div>

        {/* Demo Highlight Callout */}
        <div className="mt-12 bg-slate-100/80 border border-slate-200 rounded-2xl p-5 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Preloaded Hackathon Demo Suite Available</p>
              <p className="text-xs text-slate-500">
                Test Policy A (30-day wait), Policy B (15-day student wait), and Policy C (which has NO waiting clause and returns UNCLEAR).
              </p>
            </div>
          </div>
          <button
            onClick={onViewDemo}
            className="text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-200 shadow-2xs whitespace-nowrap transition"
          >
            Launch Instant Demo →
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Educational comparison tool — not insurance advice, a quotation, or a licensed insurance sale.
        </div>
      </div>
    </div>
  );
};
