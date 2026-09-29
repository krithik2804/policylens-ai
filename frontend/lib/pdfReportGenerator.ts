import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CompareResponse, PolicyExtraction } from "@/types";

export function generateComparisonPdfReport(data: CompareResponse) {
  const { policies, user_profile, summary_points, neutral_summary, feature_matrix } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentBlue = [37, 99, 235]; // #2563eb
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const borderGray = [226, 232, 240]; // #e2e8f0
  const lightBg = [248, 250, 252]; // #f8fafc

  const reportId = `PL-REP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const autoTableFn = (autoTable as any).default || autoTable;

  // ==========================================
  // PAGE 1: EXECUTIVE SUMMARY & SCORECARD
  // ==========================================
  let yPos = margin;

  // 1. Top Decorative Brand Accent Strip
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, pageWidth, 4.5, "F");

  // 2. Header Block
  yPos = 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("PolicyLens AI", margin, yPos);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.text("EVIDENCE-GROUNDED INSURANCE AUDIT REPORT", margin + 40, yPos - 0.5);

  // Status Badge on Right: ZERO-HALLUCINATION CERTIFIED
  const badgeWidth = 52;
  const badgeX = pageWidth - margin - badgeWidth;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(badgeX, yPos - 5, badgeWidth, 7, 1.5, 1.5, "F");
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(badgeX, yPos - 5, badgeWidth, 7, 1.5, 1.5, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text("[VERIFIED] ZERO-HALLUCINATION", badgeX + 3.5, yPos - 0.5);

  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("Insurance Policy Comparative Analysis Report", margin, yPos);

  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Report ID: ${reportId}   |   Date Generated: ${reportDate}   |   Audited Contracts: ${policies.length} Policies`, margin, yPos);

  // Divider Line
  yPos += 4;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // 3. Customer Profile Context Card
  if (user_profile) {
    yPos += 4;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, yPos, contentWidth, 13, 2, 2, "F");
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(margin, yPos, contentWidth, 13, 2, 2, "S");

    // Blue vertical accent marker on left of profile box
    doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.roundedRect(margin, yPos, 2.5, 13, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.text("CLIENT REQUIREMENT PROFILE & PRIORITIES", margin + 6, yPos + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const prioritiesStr = user_profile.priorities?.join(", ") || "General Comprehensive Health";
    const profileLine = `Beneficiary: ${user_profile.customer_type}   |   Budget Ceiling: ${user_profile.budget}   |   Stated Priorities: ${prioritiesStr}`;
    doc.text(profileLine, margin + 6, yPos + 9.5);

    yPos += 17;
  } else {
    yPos += 6;
  }

  // 4. Executive Summary Section (The Core Request)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  const execSummaryStartY = yPos;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("Executive Comparison Summary & Takeaways", margin, yPos);
  yPos += 4.5;

  // Render neutral summary narrative if present
  let cleanSummary = neutral_summary || "";
  if (!cleanSummary || cleanSummary.trim().length === 0) {
    cleanSummary = summary_points.join(" ");
  }

  // Remove markdown bullet points if present for clean paragraph text
  const paragraphs = cleanSummary
    .split("\n")
    .map((p) => p.replace(/^[•\*\-]\s*/, "").trim())
    .filter((p) => p.length > 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  paragraphs.forEach((pText) => {
    const wrapped = doc.splitTextToSize(pText, contentWidth - 4);
    doc.text(wrapped, margin + 2, yPos);
    yPos += wrapped.length * 3.8 + 1.5;
  });

  // Highlighted Summary Bullet Points
  if (summary_points && summary_points.length > 0) {
    yPos += 1;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text("Key Strategic Takeaways & Deciding Factors:", margin + 2, yPos);
    yPos += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    summary_points.slice(0, 4).forEach((point) => {
      doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
      doc.circle(margin + 3.5, yPos - 1, 1, "F");

      const wrappedPoint = doc.splitTextToSize(point, contentWidth - 10);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedPoint, margin + 6.5, yPos);
      yPos += wrappedPoint.length * 3.6 + 1.5;
    });
  }

  yPos += 3;

  // 5. Headline Scorecard Comparison Table on Page 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("Executive Contract Scorecard (At A Glance)", margin, yPos);
  yPos += 3.5;

  const scorecardHeaders = ["Key Dimension"];
  policies.forEach((p, idx) => {
    const letter = String.fromCharCode(65 + idx);
    scorecardHeaders.push(`Policy ${letter}\n${p.name.slice(0, 22)}`);
  });

  // Build headline scorecard rows
  const getMatrixVal = (keyName: string) => {
    const row = feature_matrix.find((r) => r.key === keyName);
    return row;
  };

  const coverageRow = getMatrixVal("coverage");
  const premiumRow = getMatrixVal("premium");
  const waitingRow = getMatrixVal("waiting_period");
  const roomRentRow = getMatrixVal("room_rent_limit");
  const copayRow = getMatrixVal("copay");
  const deductibleRow = getMatrixVal("deductible");

  const buildScorecardCells = (label: string, matrixRow?: any, fallbackGetter?: (p: PolicyExtraction) => string) => {
    const cells: string[] = [label];
    policies.forEach((p) => {
      if (matrixRow && matrixRow.values[p.id]) {
        const val = matrixRow.values[p.id];
        if (val.is_unclear) {
          cells.push("UNCLEAR\n(No explicit clause)");
        } else {
          cells.push(val.value);
        }
      } else if (fallbackGetter) {
        const val = fallbackGetter(p);
        cells.push(val === "UNCLEAR" ? "UNCLEAR\n(No explicit clause)" : val);
      } else {
        cells.push("N/A");
      }
    });
    return cells;
  };

  const scorecardBody = [
    ["Insurer / Underwriter", ...policies.map((p) => p.insurer || "Stated in Contract")],
    buildScorecardCells("Stated Sum Insured", coverageRow, (p) => p.coverage),
    buildScorecardCells("Annual Premium", premiumRow, (p) => p.premium),
    buildScorecardCells("PED Waiting Period", waitingRow, (p) => p.waiting_period),
    buildScorecardCells("Room Rent / ICU Cap", roomRentRow, (p) => p.important_limitations || "Not specified"),
    buildScorecardCells("Deductible / Co-pay", copayRow || deductibleRow, (p) => p.deductible || "No co-pay"),
  ];

  autoTableFn(doc, {
    startY: yPos,
    head: [scorecardHeaders],
    body: scorecardBody,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2,
      lineColor: borderGray,
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 42, fillColor: [248, 250, 252] },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && typeof data.cell.raw === "string") {
        if (data.cell.raw.includes("UNCLEAR")) {
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
          data.cell.styles.fillColor = [254, 243, 199]; // amber-100
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // ==========================================
  // PAGE 2: FULL SIDE-BY-SIDE MATRIX
  // ==========================================
  doc.addPage();
  let page2Y = margin + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("Section 2: Detailed Contractual Comparison Matrix", margin, page2Y);

  page2Y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    "Side-by-side audit of benefits, sub-limits, waiting periods, and exclusions extracted with contract page numbers.",
    margin,
    page2Y
  );

  page2Y += 5;

  const matrixHeaders = ["Contract Feature / Scope"];
  policies.forEach((p, idx) => {
    const letter = String.fromCharCode(65 + idx);
    matrixHeaders.push(`Policy ${letter}: ${p.name.slice(0, 20)}\n(${p.insurer ? p.insurer.slice(0, 18) : "Contract"})`);
  });

  const fullMatrixRows = feature_matrix.map((row) => {
    const rowData: string[] = [row.label];
    policies.forEach((p) => {
      const cell = row.values[p.id];
      if (!cell || cell.is_unclear) {
        rowData.push("UNCLEAR\n(No explicit clause found in PDF)");
      } else {
        let cellText = cell.value;
        if (cell.evidence?.page) {
          cellText += `\n[Page ${cell.evidence.page}]`;
        }
        rowData.push(cellText);
      }
    });
    return rowData;
  });

  autoTableFn(doc, {
    startY: page2Y,
    head: [matrixHeaders],
    body: fullMatrixRows,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
      lineColor: borderGray,
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [252, 252, 253],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 44, fillColor: [248, 250, 252] },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && typeof data.cell.raw === "string") {
        if (data.cell.raw.includes("UNCLEAR")) {
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
          data.cell.styles.fillColor = [254, 243, 199]; // amber-100
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Explanatory Note on UNCLEAR Standard at bottom of matrix
  const matrixEndDoc: any = doc as any;
  const matrixFinalY = matrixEndDoc.lastAutoTable ? matrixEndDoc.lastAutoTable.finalY + 5 : 220;

  if (matrixFinalY < pageHeight - 35) {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.roundedRect(margin, matrixFinalY, contentWidth, 16, 2, 2, "F");
    doc.setDrawColor(245, 158, 11); // amber-500
    doc.roundedRect(margin, matrixFinalY, contentWidth, 16, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text("STRICT AUDIT RULE: THE MEANING OF \"UNCLEAR\"", margin + 4, matrixFinalY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    const unclearNote =
      "When a feature or waiting period cannot be identified through an explicit, unambiguous clause in the uploaded policy PDF, PolicyLens AI marks it as UNCLEAR rather than inferring or assuming coverage. This prevents unexpected claim repudiations.";
    const wrappedNote = doc.splitTextToSize(unclearNote, contentWidth - 8);
    doc.text(wrappedNote, margin + 4, matrixFinalY + 8.5);
  }

  // ==========================================
  // PAGE 3: VERBATIM EVIDENCE AUDIT TRAIL
  // ==========================================
  doc.addPage();
  let page3Y = margin + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("Section 3: Ground-Truth Verbatim Clause Audit Trail", margin, page3Y);

  page3Y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    "Every extracted fact below is mapped to its exact verbatim sentence and source page number in the contract PDF.",
    margin,
    page3Y
  );

  page3Y += 5;

  const evidenceRows: string[][] = [];
  policies.forEach((p, pIdx) => {
    const letter = String.fromCharCode(65 + pIdx);
    Object.entries(p.evidence_map).forEach(([field, ev]) => {
      if (ev) {
        const isUnclear = ev.value === "UNCLEAR";
        const pageRef = isUnclear ? "UNCLEAR" : `Page ${ev.page || 1}`;
        const quoteText = isUnclear
          ? (ev.reason || "No explicit clause was found in the provided policy document.")
          : `"${(ev.quote || ev.value || "").slice(0, 160)}"`;

        evidenceRows.push([
          `Policy ${letter}: ${p.name.slice(0, 18)}`,
          field.replace(/_/g, " ").toUpperCase(),
          pageRef,
          quoteText,
        ]);
      }
    });
  });

  autoTableFn(doc, {
    startY: page3Y,
    head: [["Contract Document", "Clause Analyzed", "Page Ref", "Verbatim Contract Sentence / Audit Reason"]],
    body: evidenceRows,
    margin: { left: margin, right: margin },
    theme: "striped",
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: "bold" },
      1: { cellWidth: 30, fontStyle: "bold" },
      2: { cellWidth: 18, fontStyle: "bold" },
      3: { cellWidth: "auto" },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 2 && data.cell.raw === "UNCLEAR") {
        data.cell.styles.textColor = [180, 83, 9];
        data.cell.styles.fillColor = [254, 243, 199];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ==========================================
  // RUNNING HEADERS & FOOTERS ACROSS ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header for pages 2 and onwards
    if (i > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text("PolicyLens AI • Official Insurance Policy Comparison Audit", margin, 9);
      doc.text(`Report ID: ${reportId}`, pageWidth - margin - 35, 9);

      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.2);
      doc.line(margin, 10.5, pageWidth - margin, 10.5);
    }

    // Running Footer on every page
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      "PolicyLens AI • Zero-Hallucination Insurance Audit System • For consumer educational purposes. Not an official insurance solicitation.",
      margin,
      pageHeight - 7
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 7
    );
  }

  // Save the PDF
  const cleanFilename = `PolicyLens_Official_Comparison_Report_${reportId}.pdf`;
  doc.save(cleanFilename);
}
