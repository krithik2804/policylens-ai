"use client";

import React from "react";
import { ShieldCheck, Sparkles, BookOpen, Sun, Moon } from "lucide-react";

interface NavbarProps {
  onReset: () => void;
  onOpenDemo: () => void;
  currentStep: "landing" | "questions" | "upload" | "analysis" | "comparison";
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenDemo,
  currentStep,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                PolicyLens AI
              </span>
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Understand your insurance policy before you pay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Zero-hallucination trust indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold tracking-tight">Zero-Hallucination Active</span>
          </div>

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Black Dark Theme"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                <span className="hidden sm:inline text-xs font-semibold">Dark</span>
              </>
            )}
          </button>

          {currentStep !== "comparison" ? (
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-white" />
              <span>Try Demo</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-xl transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>New Comparison</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
