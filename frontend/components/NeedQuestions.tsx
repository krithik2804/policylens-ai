"use client";

import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Users, GraduationCap, Heart, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface NeedQuestionsProps {
  initialProfile?: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

export const NeedQuestions: React.FC<NeedQuestionsProps> = ({
  initialProfile,
  onComplete,
  onBack,
}) => {
  const [customerType, setCustomerType] = useState<string>(
    initialProfile?.customer_type || "Myself"
  );
  const [priorities, setPriorities] = useState<string[]>(
    initialProfile?.priorities || ["Coverage", "Waiting Period"]
  );
  const [budget, setBudget] = useState<string>(
    initialProfile?.budget || "₹5,000–₹10,000"
  );

  const customerOptions = [
    { label: "Myself", icon: User, desc: "Individual health protection" },
    { label: "Student", icon: GraduationCap, desc: "College/campus tailored plans" },
    { label: "Family", icon: Users, desc: "Floater cover for spouse & kids" },
    { label: "Parents", icon: Heart, desc: "Senior citizen coverage" },
  ];

  const priorityOptions = [
    { label: "Coverage", desc: "High sum insured & room rent ceilings" },
    { label: "Waiting Period", desc: "Shortest delay before pre-existing claims" },
    { label: "Exclusions", desc: "Fewest restrictions on treatments" },
    { label: "Premium", desc: "Low upfront annual cost" },
    { label: "Claim Conditions", desc: "Simple cashless notice & minimal paperwork" },
  ];

  const budgetOptions = [
    "Below ₹5,000",
    "₹5,000–₹10,000",
    "₹10,000–₹20,000",
    "Above ₹20,000",
  ];

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter((item) => item !== p));
      }
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleNext = () => {
    onComplete({
      customer_type: customerType,
      priorities,
      budget,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Step header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Step 1 of 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Your Requirement Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Answer 3 brief questions so PolicyLens can highlight the clauses that matter most to you.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Question 1 */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
            1. Who is this policy for?
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Select the primary beneficiary.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {customerOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = customerType === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setCustomerType(opt.label)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/20 text-blue-950 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              2. What matters most to you?
            </label>
            <span className="text-[11px] font-semibold text-slate-400">Select all that apply</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            We will highlight matching rows in the comparison table.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {priorityOptions.map((opt) => {
              const isSelected = priorities.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => togglePriority(opt.label)}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 font-medium"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 border ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
            3. What is your approximate annual budget?
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Target premium range per policy year.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {budgetOptions.map((opt) => {
              const isSelected = budget === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBudget(opt)}
                  className={`p-3 rounded-xl border text-center transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/20 text-blue-950 dark:text-blue-100 font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-medium"
                  }`}
                >
                  <div className="text-xs sm:text-sm">{opt}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Selected: <span className="font-bold text-slate-800 dark:text-slate-200">{customerType}</span> •{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">{priorities.length} priorities</span> •{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">{budget}</span>
          </div>
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition active:scale-98"
          >
            <span>Continue to Upload</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
