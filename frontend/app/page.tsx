"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { LandingHero } from "../components/LandingHero";
import { NeedQuestions } from "../components/NeedQuestions";
import { UploadPolicies } from "../components/UploadPolicies";
import { AnalysisProgress } from "../components/AnalysisProgress";
import { ComparisonDashboard } from "../components/ComparisonDashboard";
import { EvidenceModal } from "../components/EvidenceModal";
import { PolicyDetailModal } from "../components/PolicyDetailModal";
import { PdfViewerModal } from "../components/PdfViewerModal";
import { AskPolicyDrawer } from "../components/AskPolicyDrawer";
import { UserProfile, CompareResponse, PolicyExtraction, Evidence } from "../types";
import { fetchDemoData, uploadPolicies, comparePolicies } from "../lib/api";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<
    "landing" | "questions" | "upload" | "analysis" | "comparison"
  >("landing");

  // User Profile from Screen 2
  const [userProfile, setUserProfile] = useState<UserProfile>({
    customer_type: "Myself",
    priorities: ["Coverage", "Waiting Period"],
    budget: "₹5,00,0–₹10,000",
  });

  // Staged files or policy IDs
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [policyNames, setPolicyNames] = useState<string[]>([
    "Policy A (SecureCare)",
    "Policy B (HealthShield)",
    "Policy C (MediSure)",
  ]);

  // Comparison response data
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);

  // Modals state
  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    fieldName: string;
    fieldLabel: string;
    policy: PolicyExtraction | null;
    evidence: Evidence | null | undefined;
  }>({
    isOpen: false,
    fieldName: "",
    fieldLabel: "",
    policy: null,
    evidence: null,
  });

  const [policyDetailModal, setPolicyDetailModal] = useState<{
    isOpen: boolean;
    policy: PolicyExtraction | null;
  }>({
    isOpen: false,
    policy: null,
  });

  const [pdfViewerModal, setPdfViewerModal] = useState<{
    isOpen: boolean;
    policyId: string | null;
    policyName?: string;
    page: number;
  }>({
    isOpen: false,
    policyId: null,
    policyName: "",
    page: 1,
  });

  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState<boolean>(false);

  // Quick Reset to Home
  const handleReset = () => {
    setCurrentStep("landing");
    setCompareData(null);
    setStagedFiles([]);
  };

  // Trigger Demo Mode directly
  const handleTriggerDemo = async () => {
    setPolicyNames([
      "Policy A: SecureCare Essential",
      "Policy B: HealthShield Student Plus",
      "Policy C: MediSure Basic Care",
    ]);
    setCurrentStep("analysis");

    try {
      const demoRes = await fetchDemoData();
      setCompareData(demoRes);
    } catch (err) {
      console.error("Failed to fetch demo data:", err);
    }
  };

  // Start regular flow from hero
  const handleStartComparison = () => {
    setCurrentStep("questions");
  };

  // Step 1 -> Step 2
  const handleQuestionsComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep("upload");
  };

  // Step 2: Upload policies and trigger analysis
  const handleStartAnalysis = async (files: File[]) => {
    setStagedFiles(files);
    setPolicyNames(files.map((f, i) => `Policy ${String.fromCharCode(65 + i)}: ${f.name}`));
    setCurrentStep("analysis");

    try {
      const uploadRes = await uploadPolicies(files);
      const policyIds = uploadRes.policies.map((p) => p.id);
      const compRes = await comparePolicies(policyIds, userProfile);
      setCompareData(compRes);
    } catch (err: any) {
      alert(`Error during analysis: ${err.message}`);
      setCurrentStep("upload");
    }
  };

  // Step 3: Analysis complete callback
  const handleAnalysisComplete = () => {
    if (compareData) {
      setCurrentStep("comparison");
    } else {
      // In case network was slightly slower, fetch demo fallback
      fetchDemoData().then((res) => {
        setCompareData(res);
        setCurrentStep("comparison");
      });
    }
  };

  // Open Evidence Modal
  const handleOpenEvidence = (
    fieldName: string,
    fieldLabel: string,
    policy: PolicyExtraction,
    evidence: any
  ) => {
    setEvidenceModal({
      isOpen: true,
      fieldName,
      fieldLabel,
      policy,
      evidence,
    });
  };

  // Open PDF Viewer Modal
  const handleOpenPdfViewer = (policyId: string, page: number = 1) => {
    const policy = compareData?.policies.find((p) => p.id === policyId);
    setPdfViewerModal({
      isOpen: true,
      policyId,
      policyName: policy?.name,
      page,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentStep={currentStep}
        onReset={handleReset}
        onOpenDemo={handleTriggerDemo}
      />

      {/* Main Container Views */}
      <main className="flex-1">
        {currentStep === "landing" && (
          <LandingHero
            onStartComparison={handleStartComparison}
            onViewDemo={handleTriggerDemo}
          />
        )}

        {currentStep === "questions" && (
          <NeedQuestions
            initialProfile={userProfile}
            onComplete={handleQuestionsComplete}
            onBack={() => setCurrentStep("landing")}
          />
        )}

        {currentStep === "upload" && (
          <UploadPolicies
            onStartAnalysis={handleStartAnalysis}
            onUseDemoData={handleTriggerDemo}
            onBack={() => setCurrentStep("questions")}
          />
        )}

        {currentStep === "analysis" && (
          <AnalysisProgress
            policyCount={stagedFiles.length > 0 ? stagedFiles.length : 3}
            policyNames={policyNames}
            onComplete={handleAnalysisComplete}
          />
        )}

        {currentStep === "comparison" && compareData && (
          <ComparisonDashboard
            data={compareData}
            onOpenEvidence={handleOpenEvidence}
            onOpenPolicyDetail={(pol) =>
              setPolicyDetailModal({ isOpen: true, policy: pol })
            }
            onOpenPdfViewer={handleOpenPdfViewer}
            onOpenAskDrawer={() => setIsAskDrawerOpen(true)}
          />
        )}
      </main>

      {/* Evidence Modal */}
      {evidenceModal.policy && (
        <EvidenceModal
          isOpen={evidenceModal.isOpen}
          onClose={() =>
            setEvidenceModal((prev) => ({ ...prev, isOpen: false }))
          }
          fieldName={evidenceModal.fieldName}
          fieldLabel={evidenceModal.fieldLabel}
          policy={evidenceModal.policy}
          evidence={evidenceModal.evidence}
          onOpenPdfViewer={handleOpenPdfViewer}
        />
      )}

      {/* Policy Detail Modal */}
      <PolicyDetailModal
        policy={policyDetailModal.policy}
        isOpen={policyDetailModal.isOpen}
        onClose={() => setPolicyDetailModal({ isOpen: false, policy: null })}
        onOpenPdf={handleOpenPdfViewer}
      />

      {/* Ground-Truth PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfViewerModal.isOpen}
        policyId={pdfViewerModal.policyId}
        policyName={pdfViewerModal.policyName}
        page={pdfViewerModal.page}
        onClose={() =>
          setPdfViewerModal({ isOpen: false, policyId: null, page: 1 })
        }
      />

      {/* Grounded Policy Q&A Drawer */}
      {compareData && (
        <AskPolicyDrawer
          policies={compareData.policies}
          isOpen={isAskDrawerOpen}
          onClose={() => setIsAskDrawerOpen(false)}
          onOpenPdf={handleOpenPdfViewer}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} <strong>PolicyLens AI</strong> — Hackathon Prototype.
          </p>
          <p className="text-slate-400">
            Educational comparison tool — not insurance advice, a quotation, or a licensed insurance sale.
          </p>
        </div>
      </footer>
    </div>
  );
}
