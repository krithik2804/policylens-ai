"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";

interface AnalysisProgressProps {
  policyCount: number;
  policyNames?: string[];
  onComplete: () => void;
}

const STEPS = [
  "Document loaded",
  "Extracting text",
  "Finding coverage",
  "Finding waiting periods",
  "Finding exclusions",
  "Finding premium",
  "Verifying evidence",
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  policyCount = 3,
  policyNames = ["Policy A (SecureCare)", "Policy B (HealthShield)", "Policy C (MediSure)"],
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
    }, 280);

    return () => clearInterval(timer);
  }, [policyCount, onComplete]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                Step 3 of 3
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Grounding Verification
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {isFinished ? "Analysis Complete" : "Extracting Evidence"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PyMuPDF is isolating contract clauses and cross-referencing verbatim evidence.
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isFinished ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
        </div>

        {/* Progress List for each policy */}
        <div className="space-y-5">
          {Array.from({ length: policyCount }).map((_, pIdx) => {
            const letter = String.fromCharCode(65 + pIdx);
            const name = policyNames[pIdx] || `Policy ${letter}`;
            const isCompletedPolicy = pIdx < currentPolicyIdx || isFinished;
            const isCurrentPolicy = pIdx === currentPolicyIdx && !isFinished;

            return (
              <div
                key={pIdx}
                className={`p-4 rounded-xl border transition ${
                  isCurrentPolicy
                    ? "border-blue-400 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/30"
                    : isCompletedPolicy
                    ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                    : "border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isCompletedPolicy
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : isCurrentPolicy
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {letter}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{name}</span>
                      {isCurrentPolicy && (
                        <span className="ml-2 text-xs font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
                          Reading &amp; verifying...
                        </span>
                      )}
                    </div>
                  </div>

                  {isCompletedPolicy && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Steps checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-9">
                  {STEPS.map((step, sIdx) => {
                    let stepStatus = "pending";
                    if (isCompletedPolicy) {
                      stepStatus = "done";
                    } else if (isCurrentPolicy) {
                      if (sIdx < currentStepIdx) stepStatus = "done";
                      else if (sIdx === currentStepIdx) stepStatus = "active";
                    }

                    return (
                      <div key={sIdx} className="flex items-center gap-2 text-xs">
                        {stepStatus === "done" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : stepStatus === "active" ? (
                          <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                        )}
                        <span
                          className={`${
                            stepStatus === "done"
                              ? "text-slate-800 dark:text-slate-200 font-semibold"
                              : stepStatus === "active"
                              ? "text-blue-700 dark:text-blue-300 font-extrabold"
                              : "text-slate-400 dark:text-slate-600"
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
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-4 h-4 text-blue-500" />
            <span>Strict anti-hallucination verification active</span>
          </div>
          {isFinished && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Launching comparison dashboard...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
