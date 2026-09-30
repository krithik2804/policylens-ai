"use client";

import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Users, GraduationCap, Heart, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface NeedQuestionsProps {
  initialProfile?: UserProfile | null;
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
    { label: "Myself", icon: User, desc: "Individual health cover" },
    { label: "Student", icon: GraduationCap, desc: "Cost-sensitive, low waiting" },
    { label: "Family", icon: Users, desc: "Floater with pediatric limits" },
    { label: "Parents", icon: Heart, desc: "Senior citizen, pre-existing focus" },
  ];

  const priorityOptions = [
    { label: "Coverage", desc: "Highest sum insured" },
    { label: "Waiting Period", desc: "Shortest PED waiting time" },
    { label: "Exclusions", desc: "Fewest treatment restrictions" },
    { label: "Premium", desc: "Lowest annual cost" },
    { label: "Claim Conditions", desc: "Fast cashless approvals" },
  ];

  const budgetOptions = [
    "Under ₹5,000",
    "₹5,000–₹10,000",
    "₹10,000–₹20,000",
    "₹20,000+",
  ];

  const togglePriority = (item: string) => {
    if (priorities.includes(item)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter((p) => p !== item));
      }
    } else {
      setPriorities([...priorities, item]);
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
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {/* Step header */}
      <div className="mb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block">
          Step 1 of 3
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
          Your Requirement Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Answer 3 brief questions so PolicyLens can highlight the clauses that matter most to you.
        </p>
      </div>

      <div className="space-y-5 bg-white dark:bg-[#111726] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Question 1 */}
        <div>
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-0.5 uppercase tracking-wider">
            1. Who is this policy for?
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">Select the primary beneficiary.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {customerOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = customerType === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setCustomerType(opt.label)}
                  className={`p-3 rounded-lg border text-left transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 dark:bg-slate-800 ring-1 ring-blue-600"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#151d2f]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-500"}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-0.5 uppercase tracking-wider">
            2. Your Priorities
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">Select all factors you want prioritized.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {priorityOptions.map((opt) => {
              const isSelected = priorities.includes(opt.label);
              return (
                <div
                  key={opt.label}
                  onClick={() => togglePriority(opt.label)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#151d2f]"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151d2f]"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-0.5 uppercase tracking-wider">
            3. Target Annual Budget
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">Expected premium range per year.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {budgetOptions.map((b) => {
              const isSelected = budget === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition text-center cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 dark:bg-slate-800 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#151d2f]"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition active:scale-98 cursor-pointer"
          >
            <span>Continue to Upload</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
