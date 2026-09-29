"use client";

import React from "react";
import { CompareResponse, PolicyExtraction } from "../types";
import {
  AlertTriangle,
  FileSearch,
  MessageSquare,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface ComparisonDashboardProps {
  data: CompareResponse;
  onOpenEvidence: (
    fieldName: string,
    fieldLabel: string,
    policy: PolicyExtraction,
    evidence: any
  ) => void;
  onOpenPolicyDetail: (policy: PolicyExtraction) => void;
  onOpenPdfViewer: (policyId: string, page?: number) => void;
  onOpenAskDrawer: () => void;
}

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
  data,
  onOpenEvidence,
  onOpenPolicyDetail,
  onOpenPdfViewer,
  onOpenAskDrawer,
}) => {
  const { policies, user_profile, summary_points, feature_matrix } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Requirement Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
              Side-by-Side Analysis
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {policies.length} Policies Compared
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Policy Comparison Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any extracted figure or clause to inspect its verbatim contract source sentence and page number.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAskDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask About Policies</span>
          </button>
        </div>
      </div>

      {/* User Requirement Profile Banner */}
      {user_profile && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                User Profile Filter Active
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Beneficiary: <strong className="text-slate-900 dark:text-white font-bold">{user_profile.customer_type}</strong> • Target Budget:{" "}
                <strong className="text-slate-900 dark:text-white font-bold">{user_profile.budget}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 font-semibold">Your Priorities:</span>
            {user_profile.priorities.map((pr, i) => (
              <span
                key={i}
                className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800"
              >
                ★ {pr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Policy Summary Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${policies.length} gap-4`}>
        {policies.map((p, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isWaitingUnclear = p.waiting_period === "UNCLEAR";

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Policy {letter}
                    </span>
                  </div>
                  {p.is_demo && (
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Demo PDF
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 mb-1" title={p.name}>
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">{p.insurer}</p>

                {/* Quick stats mini-grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-tight">Sum Insured</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{p.coverage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-tight">Annual Premium</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{p.premium}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">Waiting Period</span>
                    {isWaitingUnclear ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        UNCLEAR
                      </span>
                    ) : (
                      <span className="font-extrabold text-slate-900 dark:text-white">{p.waiting_period}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onOpenPolicyDetail(p)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition text-center"
                >
                  View Policy Details
                </button>
                <button
                  onClick={() => onOpenPdfViewer(p.id, 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title="Open source PDF"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Side-by-Side Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Side-by-Side Contract Comparison</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rows marked <span className="font-bold text-blue-700 dark:text-blue-400">★ PRIORITY</span> match your requirement answers. Click any value to view exact PDF quote.
            </p>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
            Evidence-Grounded Matrix
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/90 text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-extrabold w-1/4">Contract Feature</th>
                {policies.map((p, idx) => (
                  <th key={p.id} className="py-4 px-6 font-extrabold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate max-w-[200px]" title={p.name}>
                        {p.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {feature_matrix.map((row) => {
                const isPriorityRow = row.is_priority;

                return (
                  <tr
                    key={row.key}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                      isPriorityRow ? "bg-blue-50/20 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    {/* Feature Label column */}
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white align-top">
                      <div className="flex items-start gap-1.5">
                        {isPriorityRow && (
                          <span
                            className="text-blue-600 dark:text-blue-400 font-bold text-xs"
                            title="Selected in your requirement profile"
                          >
                            ★
                          </span>
                        )}
                        <div>
                          <div className="text-xs sm:text-sm font-bold">{row.label}</div>
                          {isPriorityRow && (
                            <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-tight">
                              Priority Need
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Policy Values columns */}
                    {policies.map((pol) => {
                      const cell = row.values[pol.id];
                      const isUnclear = cell?.is_unclear;
                      const evidence = cell?.evidence;

                      return (
                        <td
                          key={pol.id}
                          onClick={() =>
                            onOpenEvidence(row.key, row.label, pol, evidence)
                          }
                          className="py-4 px-6 align-top cursor-pointer group"
                        >
                          <div className="relative">
                            {/* Value Display */}
                            {isUnclear ? (
                              /* HACKATHON DEMO MOMENT: POLICY C UNCLEAR BADGE */
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/90 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-700 shadow-2xs group-hover:bg-amber-200 dark:group-hover:bg-amber-900 transition">
                                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                                <span>UNCLEAR</span>
                                <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 underline ml-1">
                                  Why?
                                </span>
                              </div>
                            ) : (
                              <div>
                                <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center justify-between">
                                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    {cell?.value}
                                  </span>
                                  {evidence?.page && (
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                      p.{evidence.page}
                                    </span>
                                  )}
                                </div>

                                {/* Items list for Exclusions */}
                                {cell?.items && cell.items.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {cell.items.map((item, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-1.5 py-0.5 rounded"
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Snippet preview */}
                                {evidence?.quote && (
                                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                                    &ldquo;{evidence.quote}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Hover prompt */}
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition mt-1.5 flex items-center gap-1">
                              <FileSearch className="w-3 h-3" />
                              <span>Click to verify source clause</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Neutral AI Comparison Summary Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Comparison Summary</h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Strictly neutral, factual analysis. No recommendations or sales opinions.
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {summary_points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">•</span>
              <p>{pt}</p>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Educational comparison tool — not insurance advice, a quotation, or a licensed insurance sale.
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">Zero-Hallucination PolicyLens Guard</span>
        </div>
      </div>
    </div>
  );
};
