"use client";

import React, { useState } from "react";
import { PolicyExtraction, AskResponse } from "../types";
import { X, Send, MessageSquare, AlertTriangle, CheckCircle2, BookOpen, Loader2 } from "lucide-react";
import { askPolicyQuestion } from "../lib/api";

interface AskPolicyDrawerProps {
  policies: PolicyExtraction[];
  isOpen: boolean;
  onClose: () => void;
  onOpenPdf: (policyId: string, page?: number) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  policyId: string;
  evidenceQuote?: string | null;
  page?: number | null;
  section?: string | null;
  found?: boolean;
}

export const AskPolicyDrawer: React.FC<AskPolicyDrawerProps> = ({
  policies,
  isOpen,
  onClose,
  onOpenPdf,
}) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    policies[0]?.id || "policy_a"
  );
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "ai",
      text: "Hello! Ask me any question about the selected policy document. Every answer is verified against the original text with exact page citations. If a clause is missing, I will state that directly.",
      policyId: policies[0]?.id || "policy_a",
      found: true,
    },
  ]);

  if (!isOpen) return null;

  const currentPolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  const suggestedQuestions = [
    "What is the waiting period?",
    "Does this policy cover hospitalization?",
    "What are the major exclusions?",
    "What is the deductible?",
  ];

  const handleSend = async (qText?: string) => {
    const query = (qText || question).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      policyId: selectedPolicyId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res: AskResponse = await askPolicyQuestion(selectedPolicyId, query, currentPolicy);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: res.answer,
        policyId: selectedPolicyId,
        evidenceQuote: res.evidence_quote,
        page: res.page,
        section: res.section,
        found: res.found,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: "An error occurred while querying the document. Please try again.",
        policyId: selectedPolicyId,
        found: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-[#111726] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Ask PolicyLens AI</h3>
            <p className="text-[10px] text-slate-500">Grounded policy Q&amp;A with citations</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Policy Selector Pills */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111726]">
        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Select Document
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {policies.map((p) => {
            const isSelected = p.id === selectedPolicyId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80"
                }`}
              >
                <span className="truncate max-w-[120px]">{p.name.split(" ")[0]}</span>
                {p.waiting_period === "UNCLEAR" && (
                  <span className="text-[9px] bg-amber-400 text-black font-bold px-1 rounded">
                    UNCLEAR
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-[#0b0f19]">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-white dark:bg-[#151d2f] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs shadow-2xs"
                }`}
              >
                <p>{m.text}</p>

                {/* Evidence citation pill for AI responses */}
                {!isUser && m.evidenceQuote && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Source Verified</span>
                      </div>
                      {m.page && (
                        <button
                          onClick={() => onOpenPdf(m.policyId, m.page || 1)}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                        >
                          <span>Page {m.page}</span>
                          <BookOpen className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <div className="italic text-slate-500 dark:text-slate-400 font-serif bg-slate-50 dark:bg-[#111726] p-1.5 rounded border border-slate-200/80 dark:border-slate-800 text-[10px]">
                      &ldquo;{m.evidenceQuote}&rdquo;
                    </div>
                  </div>
                )}

                {/* Missing / Unclear tag in AI answer */}
                {!isUser && m.found === false && (
                  <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-[10px] flex items-start gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.2" />
                    <span>No guessed terms. Missing clauses are strictly reported as unfound.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white dark:bg-[#151d2f] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 w-fit">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Scanning document...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="p-2.5 bg-white dark:bg-[#111726] border-t border-slate-100 dark:border-slate-800">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Suggestions
        </div>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-2 py-0.5 rounded-full transition cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-2.5 bg-white dark:bg-[#111726] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Ask about ${currentPolicy.name.split(" ")[0]}...`}
          className="flex-1 bg-slate-50 dark:bg-[#151d2f] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={!question.trim() || loading}
          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition cursor-pointer"
          title="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
