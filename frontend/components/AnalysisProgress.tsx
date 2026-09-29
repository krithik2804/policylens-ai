"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles, FileText, ShieldAlert } from "lucide-react";

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
  // Current active policy index (0, 1, 2)
  const [currentPolicyIdx, setCurrentPolicyIdx] = useState<number>(0);
  // Current active step index for current policy (0 to STEPS.length)
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prevStep) => {
        if (prevStep < STEPS.length) {
          return prevStep + 1;
        } else {
          // Finished steps for current policy
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Step 3 of 3</span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Grounding Verification
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {isFinished ? "Analysis Complete" : "Extracting Evidence"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              PyMuPDF is isolating contract clauses and cross-referencing verbatim evidence.
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            {isFinished ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
        </div>

        {/* Progress List for each policy */}
        <div className="space-y-6">
          {Array.from({ length: policyCount }).map((_, pIdx) => {
            const letter = String.fromCharCode(65 + pIdx);
            const name = policyNames[pIdx] || `Policy ${letter}`;
            const isCompletedPolicy = pIdx < currentPolicyIdx || isFinished;
            const isCurrentPolicy = pIdx === currentPolicyIdx && !isFinished;
            const isPendingPolicy = pIdx > currentPolicyIdx && !isFinished;

            return (
              <div
                key={pIdx}
                className={`p-4 rounded-xl border transition ${
                  isCurrentPolicy
                    ? "border-blue-400 bg-blue-50/30"
                    : isCompletedPolicy
                    ? "border-slate-200 bg-slate-50/40"
                    : "border-slate-100 bg-white opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isCompletedPolicy
                          ? "bg-emerald-100 text-emerald-800"
                          : isCurrentPolicy
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {letter}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">{name}</span>
                      {isCurrentPolicy && (
                        <span className="ml-2 text-xs font-medium text-blue-600 animate-pulse">
                          Reading &amp; verifying...
                        </span>
                      )}
                    </div>
                  </div>

                  {isCompletedPolicy && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : stepStatus === "active" ? (
                          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span
                          className={`${
                            stepStatus === "done"
                              ? "text-slate-800 font-medium"
                              : stepStatus === "active"
                              ? "text-blue-700 font-bold"
                              : "text-slate-400"
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
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-blue-500" />
            <span>Strict anti-hallucination verification active</span>
          </div>
          {isFinished && (
            <span className="font-semibold text-emerald-600">
              Launching comparison dashboard...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
