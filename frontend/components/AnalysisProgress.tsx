"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";

interface AnalysisProgressProps {
  policyCount: number;
  policyNames?: string[];
  onComplete: () => void;
}

const STEPS = [
  "Document parsed",
  "Extracting text",
  "Finding sum insured",
  "Finding waiting periods",
  "Finding exclusions",
  "Finding premium",
  "Verifying verbatim evidence",
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
              }, 500);
              return prevPol;
            }
          });
          return 0;
        }
      });
    }, 240);

    return () => clearInterval(timer);
  }, [policyCount, onComplete]);

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white dark:bg-[#0a0a0a] p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                Step 3 of 3
              </span>
              <span className="text-[10px] font-medium bg-emerald-50 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 px-2 py-0.2 rounded border border-emerald-200 dark:border-emerald-900/60">
                Evidence Grounding
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {isFinished ? "Extraction Complete" : "Extracting Evidence"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              PolicyLens is isolating contract clauses and cross-referencing verbatim evidence.
            </p>
          </div>

          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            {isFinished ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </div>
        </div>

        {/* Progress List for each policy */}
        <div className="space-y-3.5">
          {Array.from({ length: policyCount }).map((_, pIdx) => {
            const letter = String.fromCharCode(65 + pIdx);
            const name = policyNames[pIdx] || `Policy ${letter}`;
            const isCompletedPolicy = pIdx < currentPolicyIdx || isFinished;
            const isCurrentPolicy = pIdx === currentPolicyIdx && !isFinished;

            return (
              <div
                key={pIdx}
                className={`p-3.5 rounded-lg border transition ${
                  isCurrentPolicy
                    ? "border-blue-400 dark:border-neutral-700 bg-blue-50/30 dark:bg-neutral-900/60"
                    : isCompletedPolicy
                    ? "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black"
                    : "border-neutral-100 dark:border-neutral-850 bg-white dark:bg-[#0a0a0a] opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                        isCompletedPolicy
                          ? "bg-emerald-100 dark:bg-neutral-900 text-emerald-800 dark:text-emerald-400"
                          : isCurrentPolicy
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {letter}
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">{name}</span>
                      {isCurrentPolicy && (
                        <span className="ml-2 text-[11px] font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                          Verifying clauses...
                        </span>
                      )}
                    </div>
                  </div>

                  {isCompletedPolicy && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Steps checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-8">
                  {STEPS.map((step, sIdx) => {
                    let stepStatus = "pending";
                    if (isCompletedPolicy) {
                      stepStatus = "done";
                    } else if (isCurrentPolicy) {
                      if (sIdx < currentStepIdx) stepStatus = "done";
                      else if (sIdx === currentStepIdx) stepStatus = "active";
                    }

                    return (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[11px]">
                        {stepStatus === "done" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : stepStatus === "active" ? (
                          <Loader2 className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-700 shrink-0" />
                        )}
                        <span
                          className={`${
                            stepStatus === "done"
                              ? "text-neutral-800 dark:text-neutral-300 font-medium"
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

        {/* Status Callout */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
            <span>Anti-hallucination verification active</span>
          </div>
          {isFinished && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Launching dashboard...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
