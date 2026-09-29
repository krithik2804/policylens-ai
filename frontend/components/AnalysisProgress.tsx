"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Sparkles, FileText } from "lucide-react";

interface AnalysisProgressProps {
  policyCount: number;
  policyNames?: string[];
  onComplete: () => void;
}

const STEPS = [
  "Document structure parsed",
  "Extracting text streams",
  "Isolating sum insured & limits",
  "Verifying waiting period clauses",
  "Detecting policy exclusions",
  "Checking deductibles & copay",
  "Cross-referencing verbatim citations",
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  policyCount = 3,
  policyNames = ["Policy A", "Policy B", "Policy C"],
  onComplete,
}) => {
  const [currentPolicyIdx, setCurrentPolicyIdx] = useState<number>(0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prevStep) => {
        if (prevStep < STEPS.length) {
          return prevStep + 1;
        } else {
          setCurrentPolicyIdx((prevPol) => {
            if (prevPol + 1 < policyCount) {
              return prevPol + 1;
            } else {
              setIsFinished(true);
              clearInterval(timer);
              setTimeout(() => {
                onComplete();
              }, 600);
              return prevPol;
            }
          });
          return 0;
        }
      });
    }, 250);

    return () => clearInterval(timer);
  }, [policyCount, onComplete]);

  // Overall progress percentage
  const totalSteps = policyCount * STEPS.length;
  const completedSteps = currentPolicyIdx * STEPS.length + Math.min(currentStepIdx, STEPS.length);
  const progressPercent = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

  return (
    <div className="relative max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Ambient background glow for Glassmorphism */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Container */}
      <div className="relative backdrop-blur-2xl bg-white/75 dark:bg-[#0a0a0a]/80 border border-white/60 dark:border-neutral-800/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden p-5 sm:p-7 text-left">
        {/* Animated Laser Scanning Line */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-line pointer-events-none z-20 shadow-[0_0_8px_#3b82f6]" />

        {/* Brand Header with Glowing Logo Emblem */}
        <div className="flex flex-col items-center justify-center text-center pb-5 mb-5 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="relative mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 shadow-md backdrop-blur-md flex items-center justify-center p-1.5">
              <img
                src="/logo.png"
                alt="PolicyLens AI"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm -z-10 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-neutral-900 border border-blue-200/80 dark:border-neutral-800 text-blue-700 dark:text-blue-400 text-[10px] font-semibold mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>AI Evidence Extraction Active</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
            {isFinished ? "Analysis Complete" : "Auditing Policy Documents"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-sm">
            Strict clause isolation: extracting page-by-page quotes with zero hallucination.
          </p>

          {/* Progress bar */}
          <div className="w-full mt-3.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 mb-1">
              <span>Extracting Clauses</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Policy Checklist Cards */}
        <div className="space-y-3">
          {Array.from({ length: policyCount }).map((_, pIdx) => {
            const letter = String.fromCharCode(65 + pIdx);
            const name = policyNames[pIdx] || `Policy ${letter}`;
            const isCompletedPolicy = pIdx < currentPolicyIdx || isFinished;
            const isCurrentPolicy = pIdx === currentPolicyIdx && !isFinished;

            return (
              <div
                key={pIdx}
                className={`relative rounded-xl p-3 sm:p-3.5 transition backdrop-blur-md ${
                  isCurrentPolicy
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-900/60 shadow-xs"
                    : isCompletedPolicy
                    ? "bg-neutral-50/70 dark:bg-black/50 border border-neutral-200/80 dark:border-neutral-800"
                    : "bg-white/40 dark:bg-neutral-900/30 border border-neutral-200/40 dark:border-neutral-800/40 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                        isCompletedPolicy
                          ? "bg-emerald-600 text-white"
                          : isCurrentPolicy
                          ? "bg-blue-600 text-white animate-pulse"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate max-w-[220px] sm:max-w-xs">
                      {name}
                    </span>
                  </div>

                  {isCompletedPolicy ? (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Grounded
                    </span>
                  ) : isCurrentPolicy ? (
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Inspecting
                    </span>
                  ) : null}
                </div>

                {/* Steps Micro Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-7">
                  {STEPS.map((step, sIdx) => {
                    let stepStatus = "pending";
                    if (isCompletedPolicy) {
                      stepStatus = "done";
                    } else if (isCurrentPolicy) {
                      if (sIdx < currentStepIdx) stepStatus = "done";
                      else if (sIdx === currentStepIdx) stepStatus = "active";
                    }

                    return (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[10px]">
                        {stepStatus === "done" ? (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                        ) : stepStatus === "active" ? (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-neutral-300 dark:border-neutral-700 shrink-0" />
                        )}
                        <span
                          className={`truncate ${
                            stepStatus === "done"
                              ? "text-neutral-700 dark:text-neutral-300 font-medium"
                              : stepStatus === "active"
                              ? "text-blue-600 dark:text-blue-400 font-bold"
                              : "text-neutral-400 dark:text-neutral-600"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strict Zero-Hallucination Protocol</span>
          </div>
          {isFinished && (
            <span className="font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
              Opening Comparison...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
