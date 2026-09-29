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

  const gridClass =
    policies.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Requirement Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-blue-200 dark:border-neutral-800 uppercase tracking-wider">
              Comparison Active
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {policies.length} Policies Analyzed
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Policy Comparison Dashboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Click any extracted figure or clause to inspect its verbatim contract source sentence and page number.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAskDrawer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition active:scale-98"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Policy AI</span>
          </button>
        </div>
      </div>

      {/* User Requirement Profile Banner */}
      {user_profile && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Profile Focus
              </div>
              <div className="text-xs text-neutral-700 dark:text-neutral-300">
                Beneficiary: <strong className="text-neutral-900 dark:text-white font-semibold">{user_profile.customer_type}</strong> • Budget:{" "}
                <strong className="text-neutral-900 dark:text-white font-semibold">{user_profile.budget}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Priorities:</span>
            {user_profile.priorities.map((pr, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800"
              >
                ★ {pr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Policy Summary Cards Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {policies.map((p, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isWaitingUnclear = p.waiting_period === "UNCLEAR";

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Policy {letter}
                    </span>
                  </div>
                  {p.is_demo ? (
                    <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                      Demo Document
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                      Uploaded PDF
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white line-clamp-1 mb-0.5" title={p.name}>
                  {p.name}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-3">{p.insurer}</p>

                {/* Quick stats mini-grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800/80 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-semibold">Sum Insured</span>
                    <span className="font-bold text-neutral-900 dark:text-white text-xs">{p.coverage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-semibold">Annual Premium</span>
                    <span className="font-bold text-neutral-900 dark:text-white text-xs">{p.premium}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">Waiting Period</span>
                    {isWaitingUnclear ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        UNCLEAR
                      </span>
                    ) : (
                      <span className="font-bold text-neutral-900 dark:text-white text-xs">{p.waiting_period}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => onOpenPolicyDetail(p)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenPdfViewer(p.id, 1)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition"
                  title="Open source PDF"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Side-by-Side Comparison Table */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-black flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Side-by-Side Contract Comparison</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Click any value to inspect exact PDF quotation and page number.
            </p>
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono hidden sm:block">
            Evidence-Backed Matrix
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-5 font-bold w-1/4">Contract Feature</th>
                {policies.map((p, idx) => (
                  <th key={p.id} className="py-3 px-4 sm:px-5 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
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
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80 text-xs text-neutral-800 dark:text-neutral-200">
              {feature_matrix.map((row) => {
                const isPriorityRow = row.is_priority;

                return (
                  <tr
                    key={row.key}
                    className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition ${
                      isPriorityRow ? "bg-blue-50/20 dark:bg-neutral-900/30" : ""
                    }`}
                  >
                    {/* Feature Label column */}
                    <td className="py-3 px-4 sm:px-5 font-medium text-neutral-900 dark:text-white align-top">
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
                          <div className="text-xs font-semibold">{row.label}</div>
                          {isPriorityRow && (
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
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
                          className="py-3 px-4 sm:px-5 align-top cursor-pointer group"
                        >
                          <div className="relative">
                            {/* Value Display */}
                            {isUnclear ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-neutral-900 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-800 group-hover:bg-amber-100 dark:group-hover:bg-neutral-850 transition">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>UNCLEAR</span>
                                <span className="text-[10px] font-normal text-amber-700 dark:text-amber-400 underline ml-1">
                                  Why?
                                </span>
                              </div>
                            ) : (
                              <div>
                                <div className="font-bold text-neutral-900 dark:text-white text-xs flex items-center justify-between">
                                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    {cell?.value}
                                  </span>
                                  {evidence?.page && (
                                    <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition ml-2">
                                      p.{evidence.page}
                                    </span>
                                  )}
                                </div>

                                {/* Items list for Exclusions */}
                                {cell?.items && cell.items.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {cell.items.map((item, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-medium px-1.5 py-0.2 rounded border border-neutral-200 dark:border-neutral-800"
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Snippet preview */}
                                {evidence?.quote && (
                                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 italic line-clamp-2 leading-relaxed">
                                    &ldquo;{evidence.quote}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Hover prompt */}
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition mt-1 flex items-center gap-1">
                              <FileSearch className="w-3 h-3" />
                              <span>Verify clause quote</span>
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
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">AI Factual Summary</h2>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Strictly neutral, non-opinionated contract comparison.
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-black border border-neutral-200/80 dark:border-neutral-800 space-y-2 text-xs text-neutral-800 dark:text-neutral-300 leading-relaxed font-normal">
          {summary_points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
              <p>{pt}</p>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>
            Comparison tool for informational evaluation — not a licensed insurance solicitation.
          </span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-400">PolicyLens Evidence Engine</span>
        </div>
      </div>
    </div>
  );
};
