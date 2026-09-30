"use client";

import React from "react";
import { CompareResponse, PolicyExtraction } from "../types";
import {
  AlertTriangle,
  FileSearch,
  MessageSquare,
  Sparkles,
  BookOpen,
  Download,
} from "lucide-react";
import { generateComparisonPdfReport } from "../lib/pdfReportGenerator";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
      {/* Top Header & Requirement Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700 uppercase tracking-wider">
              Comparison Active
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {policies.length} Policies Analyzed
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Policy Comparison Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any extracted figure or clause to inspect its verbatim contract source sentence and page number.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateComparisonPdfReport(data)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition active:scale-98 cursor-pointer"
            title="Export official vector PDF audit report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>

          <button
            onClick={onOpenAskDrawer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition active:scale-98 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Policy AI</span>
          </button>
        </div>
      </div>

      {/* User Requirement Profile Banner */}
      {user_profile && (
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Profile Focus
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Beneficiary: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{user_profile.customer_type}</strong> • Budget:{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">{user_profile.budget}</strong>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold mr-1">Priorities:</span>
            {user_profile.priorities.map((p) => (
              <span
                key={p}
                className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Policy Summary Header Cards */}
      <div className={`grid ${gridClass} gap-3.5`}>
        {policies.map((p, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isWaitingUnclear = p.waiting_period === "UNCLEAR";

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {letter}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Policy {letter}
                    </span>
                  </div>
                  {p.is_demo ? (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Demo Document
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                      Uploaded PDF
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mb-0.5" title={p.name}>
                  {p.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">{p.insurer}</p>

                {/* Quick stats mini-grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#151d2f] border border-slate-100 dark:border-slate-800 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Sum Insured</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{p.coverage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Annual Premium</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{p.premium}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Waiting Period</span>
                    {isWaitingUnclear ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800/80">
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        UNCLEAR
                      </span>
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{p.waiting_period}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onOpenPolicyDetail(p)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-medium transition text-center cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenPdfViewer(p.id, 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition cursor-pointer"
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
      <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#151d2f] flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Side-by-Side Contract Comparison</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Click any value to inspect exact PDF quotation and page number.
            </p>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
            Evidence-Backed Matrix
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-5 font-bold w-1/4">Contract Feature</th>
                {policies.map((p, idx) => (
                  <th key={p.id} className="py-3 px-4 sm:px-5 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate max-w-[160px]">{p.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {feature_matrix.map((row, rowIdx) => {
                const isPriorityRow = user_profile?.priorities.some(
                  (p) => row.label.toLowerCase().includes(p.toLowerCase()) || row.key.toLowerCase().includes(p.toLowerCase())
                );

                return (
                  <tr
                    key={row.key}
                    className={`transition ${
                      isPriorityRow
                        ? "bg-blue-50/20 dark:bg-blue-950/10 hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                        : rowIdx % 2 === 1
                        ? "bg-slate-50/40 dark:bg-[#131b2c]/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    }`}
                  >
                    {/* Feature Label Column */}
                    <td className="py-3 px-4 sm:px-5 font-semibold text-slate-900 dark:text-slate-100 align-top">
                      <div className="flex items-center gap-1.5">
                        <span>{row.label}</span>
                        {isPriorityRow && (
                          <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                            PRIORITY
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Policy Values Columns */}
                    {policies.map((p) => {
                      const cell = row.values[p.id];
                      if (!cell) return <td key={p.id} className="py-3 px-4 text-slate-400">N/A</td>;

                      return (
                        <td
                          key={p.id}
                          onClick={() => onOpenEvidence(row.key, row.label, p, cell.evidence)}
                          className="py-3 px-4 sm:px-5 align-top cursor-pointer group hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition"
                        >
                          <div>
                            {cell.is_unclear ? (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-bold text-[11px]">
                                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>UNCLEAR</span>
                              </div>
                            ) : (
                              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                                {cell.value}
                              </div>
                            )}

                            {/* Evidence Citation Tag */}
                            {cell.evidence && (
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                {cell.evidence.page ? (
                                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                                    p. {cell.evidence.page}
                                  </span>
                                ) : (
                                  <span className="text-amber-600 dark:text-amber-400 font-mono">
                                    No Clause
                                  </span>
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
      <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">AI Factual Summary</h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Strictly neutral, non-opinionated contract comparison.
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#151d2f] border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-normal">
          {summary_points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
              <p>{pt}</p>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Comparison tool for informational evaluation — not a licensed insurance solicitation.
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-400">PolicyLens Evidence Engine</span>
        </div>
      </div>
    </div>
  );
};
