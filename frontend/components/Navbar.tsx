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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <div
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
                PolicyLens
              </span>
              <span className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                AI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zero-hallucination trust indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-neutral-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium tracking-tight">Zero-Hallucination Guard</span>
          </div>

          {/* Pure Pitch Black / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-xs font-medium"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Black Dark Theme"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span className="hidden sm:inline">Black</span>
              </>
            )}
          </button>

          {currentStep !== "comparison" ? (
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
              <span>Demo</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 px-3 py-1.5 rounded-lg transition"
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
