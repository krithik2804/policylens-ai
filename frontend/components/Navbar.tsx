"use client";

import React from "react";
import { Sparkles, BookOpen, Sun, Moon } from "lucide-react";

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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 sm:h-14 flex items-center justify-between">
        {/* Brand with official Logo at top left corner */}
        <div
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="PolicyLens AI - Return to Home"
        >
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs group-hover:border-blue-500/50 transition">
            <img
              src="/logo.png"
              alt="PolicyLens AI Logo"
              className="h-7 sm:h-8 w-auto object-contain rounded-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
              PolicyLens <span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded border border-blue-200 dark:border-slate-700 uppercase tracking-wider">
              Auditor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Zero-hallucination trust indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Zero-Hallucination Guard</span>
          </div>

          {/* Theme Toggle - Dark Slate / Clean Light */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium cursor-pointer"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            )}
          </button>

          {currentStep !== "comparison" ? (
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-blue-300 dark:text-blue-200" />
              <span>Demo</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
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
