"use client";

import React, { useState } from "react";
import { PolicyExtraction, AskResponse } from "../types";
import { X, Send, Sparkles, MessageSquare, AlertTriangle, CheckCircle2, BookOpen, Loader2 } from "lucide-react";
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
      const res: AskResponse = await askPolicyQuestion(selectedPolicyId, query);
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Ask PolicyLens AI</h3>
            <p className="text-[11px] text-slate-500">Grounded policy Q&amp;A with citations</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Policy Selector Pills */}
      <div className="px-4 py-3 border-b border-slate-100 bg-white">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Target Document
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {policies.map((p) => {
            const isSelected = p.id === selectedPolicyId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{p.name.split(" ")[0]}</span>
                {p.waiting_period === "UNCLEAR" && (
                  <span className="text-[9px] bg-amber-400 text-slate-900 font-bold px-1 rounded">
                    UNCLEAR
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-2xs"
                }`}
              >
                <p>{m.text}</p>

                {/* Evidence Callout if AI answered with citation */}
                {!isUser && m.evidenceQuote && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Source Evidence:
                      </span>
                      {m.page && (
                        <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          Page {m.page}
                        </span>
                      )}
                    </div>
                    <blockquote className="italic bg-slate-50 p-2 rounded-md border border-slate-200 text-slate-800">
                      &ldquo;{m.evidenceQuote}&rdquo;
                    </blockquote>
                    {m.page && (
                      <button
                        onClick={() => onOpenPdf(m.policyId, m.page || 1)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-[10px] font-semibold flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Inspect in PDF</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Warning if clause not found */}
                {!isUser && m.found === false && (
                  <div className="mt-2.5 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>No guessed terms. PolicyLens strictly refuses to fabricate missing clauses.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Scanning {currentPolicy.name} for evidence...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Suggested Inquiries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Ask about ${currentPolicy.name.split(" ")[0]}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={!question.trim() || loading}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
