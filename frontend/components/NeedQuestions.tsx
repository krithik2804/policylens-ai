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
    { label: "Student", icon: GraduationCap, desc: "Campus/study tailored cover" },
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
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {/* Step header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase block">
          Step 1 of 3
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
          Your Requirement Profile
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Answer 3 brief questions so PolicyLens can highlight the clauses that matter most to you.
        </p>
      </div>

      <div className="space-y-6 bg-white dark:bg-[#0a0a0a] p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        {/* Question 1 */}
        <div>
          <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-0.5 uppercase tracking-wider">
            1. Who is this policy for?
          </label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Select the primary beneficiary.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {customerOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = customerType === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setCustomerType(opt.label)}
                  className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 dark:bg-neutral-900 ring-1 ring-blue-600"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-black"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-neutral-500"}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">{opt.label}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="block text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              2. What matters most to you?
            </label>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Select one or more</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            Policies will highlight matching contract clauses in the side-by-side view.
          </p>

          <div className="space-y-2">
            {priorityOptions.map((opt) => {
              const isSelected = priorities.includes(opt.label);
              return (
                <div
                  key={opt.label}
                  onClick={() => togglePriority(opt.label)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 dark:bg-neutral-900"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-black"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">{opt.label}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{opt.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black"
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
          <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-0.5 uppercase tracking-wider">
            3. Target Annual Budget
          </label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Expected premium range per year.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {budgetOptions.map((b) => {
              const isSelected = budget === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition text-center ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 dark:bg-neutral-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-black"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next CTA */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition active:scale-98"
          >
            <span>Continue to Upload</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
