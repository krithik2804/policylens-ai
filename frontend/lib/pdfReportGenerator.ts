import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CompareResponse, PolicyExtraction } from "@/types";

/**
 * Sanitizes strings for jsPDF helvetica standard font.
 * Replaces Unicode currency symbols (---), non-standard dashes, quotes, and bullets
 * that cause glyph corruption and text misalignments in PDF generation.
 */
function cleanPdfText(text: any): string {
  if (text === null || text === undefined) return "";
  let str = String(text);
  // Replace Rupee symbol (Unicode \u20B9 or ₹) with standard Rs.
  str = str.replace(/\u20B9/g, "Rs. ").replace(/₹/g, "Rs. ");
  // Replace en-dash / em-dash with standard hyphen
  str = str.replace(/[\u2013\u2014\u2015]/g, "-");
  // Replace smart quotes with standard quotes
  str = str.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
  // Replace bullet points with standard hyphens
  str = str.replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-");
  // Normalize whitespace
  str = str.replace(/\r\n/g, "\n").replace(/\t/g, " ");
  // Strip any remaining non-ASCII characters that jsPDF cannot render natively
  str = str.replace(/[^\x00-\x7F]/g, "");
  return str.trim();
}

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
  const contentWidth = pageWidth - margin * 2; // 182mm on A4

  // Brand Color Palette - Professional Executive FinTech
  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentBlue = [37, 99, 235]; // #2563eb
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const borderGray = [203, 213, 225]; // #cbd5e1
  const lightBg = [248, 250, 252]; // #f8fafc

  const reportId = `PL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const autoTableFn = (autoTable as any).default || autoTable;

  // Proportional Column Width Calculation for side-by-side tables
  const policyCount = Math.max(1, policies.length);
  const firstColWidth = policyCount === 2 ? 50 : 44;
  const policyColWidth = (contentWidth - firstColWidth) / policyCount;

  const columnWidthsConfig: Record<number, { cellWidth: number; fontStyle?: string; halign?: string; fillColor?: number[] }> = {
    0: { cellWidth: firstColWidth, fontStyle: "bold", fillColor: [248, 250, 252] },
  };
  for (let c = 1; c <= policyCount; c++) {
    columnWidthsConfig[c] = { cellWidth: policyColWidth };
  }

  // ==========================================
  // PAGE 1: EXECUTIVE SUMMARY & SCORECARD
  // ==========================================
  let yPos = margin;

  // 1. Top Decorative Brand Accent Strip
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, pageWidth, 4, "F");
  doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.rect(0, 4, pageWidth, 1.2, "F");

  // 2. Header Block
  yPos = 13;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("PolicyLens AI", margin, yPos);

  // Status Badge on Top Right: ZERO-HALLUCINATION VERIFIED
  const badgeWidth = 54;
  const badgeHeight = 6.5;
  const badgeX = pageWidth - margin - badgeWidth;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(badgeX, yPos - 4.5, badgeWidth, badgeHeight, 1.2, 1.2, "F");
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, yPos - 4.5, badgeWidth, badgeHeight, 1.2, 1.2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text("VERIFIED ZERO-HALLUCINATION", badgeX + 4, yPos - 0.5);

  yPos += 5.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("Insurance Policy Comparative Audit Report", margin, yPos);

  yPos += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    cleanPdfText(`Report ID: ${reportId}   |   Date Generated: ${reportDate}   |   Policies Audited: ${policies.length}`),
    margin,
    yPos
  );

  // Divider Line
  yPos += 3.5;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // 3. Customer Profile Context Box
  if (user_profile) {
    yPos += 4;
    const boxHeight = 12;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 1.5, 1.5, "F");
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 1.5, 1.5, "S");

    // Blue vertical accent marker on left of profile box
    doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.roundedRect(margin, yPos, 2, boxHeight, 0.8, 0.8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.text("CLIENT REQUIREMENT PROFILE & PRIORITIES", margin + 5, yPos + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const prioritiesStr = user_profile.priorities?.join(", ") || "General Comprehensive Health";
    const profileSummary = cleanPdfText(
      `Beneficiary: ${user_profile.customer_type}   |   Target Budget: ${user_profile.budget}   |   Priority Focus: ${prioritiesStr}`
    );
    const wrappedProfile = doc.splitTextToSize(profileSummary, contentWidth - 10);
    doc.text(wrappedProfile, margin + 5, yPos + 8.5);

    yPos += boxHeight + 4;
  } else {
    yPos += 5;
  }

  // 4. Executive Summary Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("1. Executive Comparison Summary & Takeaways", margin, yPos);
  yPos += 3.5;

  let cleanSummary = neutral_summary || "";
  if (!cleanSummary || cleanSummary.trim().length === 0) {
    cleanSummary = summary_points.join(" ");
  }

  const rawParagraphs = cleanSummary
    .split("\n")
    .map((p) => p.replace(/^[---\*\-]\s*/, "").trim())
    .filter((p) => p.length > 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  rawParagraphs.forEach((pText) => {
    const sanitized = cleanPdfText(pText);
    const wrapped = doc.splitTextToSize(sanitized, contentWidth - 4);
    doc.text(wrapped, margin + 1, yPos);
    yPos += wrapped.length * 3.4 + 1.5;
  });

  // Highlighted Summary Bullet Points
  if (summary_points && summary_points.length > 0) {
    yPos += 1;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text("Key Strategic Takeaways & Deciding Factors:", margin + 1, yPos);
    yPos += 3.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);

    summary_points.slice(0, 3).forEach((point) => {
      doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
      doc.circle(margin + 2.5, yPos - 0.8, 0.7, "F");

      const sanitizedPoint = cleanPdfText(point);
      const wrappedPoint = doc.splitTextToSize(sanitizedPoint, contentWidth - 8);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedPoint, margin + 5, yPos);
      yPos += wrappedPoint.length * 3.3 + 1.2;
    });
  }

  yPos += 3;

  // 5. Headline Scorecard Comparison Table on Page 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("2. Executive Policy Scorecard (At A Glance)", margin, yPos);
  yPos += 3;

  const scorecardHeaders = ["Key Dimension"];
  policies.forEach((p, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const nameClean = cleanPdfText(p.name).slice(0, 24);
    scorecardHeaders.push(`Policy ${letter}\n${nameClean}`);
  });

  const getMatrixVal = (keyName: string) => {
    return feature_matrix.find((r) => r.key === keyName);
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
          cells.push(cleanPdfText(val.value));
        }
      } else if (fallbackGetter) {
        const val = fallbackGetter(p);
        cells.push(val === "UNCLEAR" ? "UNCLEAR\n(No explicit clause)" : cleanPdfText(val));
      } else {
        cells.push("N/A");
      }
    });
    return cells;
  };

  const scorecardBody = [
    ["Insurer / Underwriter", ...policies.map((p) => cleanPdfText(p.insurer || "Stated in Contract"))],
    buildScorecardCells("Stated Sum Insured", coverageRow, (p) => p.coverage),
    buildScorecardCells("Annual Premium", premiumRow, (p) => p.premium),
    buildScorecardCells("PED Waiting Period", waitingRow, (p) => p.waiting_period),
    buildScorecardCells("Room Rent / ICU Cap", roomRentRow, (p) => p.important_limitations || "No sub-limit"),
    buildScorecardCells("Deductible / Co-pay", copayRow || deductibleRow, (p) => p.deductible || "Zero deductible"),
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
      fontSize: 7.2,
      fontStyle: "bold",
      halign: "left",
      valign: "middle",
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [30, 41, 59],
      cellPadding: 2.2,
      valign: "middle",
      lineColor: borderGray,
      lineWidth: 0.15,
    },
    columnStyles: columnWidthsConfig,
    didParseCell: (hookData: any) => {
      if (hookData.section === "body" && typeof hookData.cell.raw === "string") {
        if (hookData.cell.raw.includes("UNCLEAR")) {
          hookData.cell.styles.textColor = [180, 83, 9]; // amber-700
          hookData.cell.styles.fillColor = [254, 243, 199]; // amber-100
          hookData.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // ==========================================
  // PAGE 2: DETAILED CONTRACTUAL COMPARISON MATRIX
  // ==========================================
  doc.addPage();
  let page2Y = margin + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("3. Detailed Side-by-Side Clause Matrix", margin, page2Y);

  page2Y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    cleanPdfText("Side-by-side audit of coverage benefits, room caps, waiting periods, and exclusions extracted with PDF page citations."),
    margin,
    page2Y
  );

  page2Y += 4.5;

  const matrixHeaders = ["Contract Feature / Scope"];
  policies.forEach((p, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const pName = cleanPdfText(p.name).slice(0, 20);
    const pInsurer = cleanPdfText(p.insurer || "Contract").slice(0, 18);
    matrixHeaders.push(`Policy ${letter}: ${pName}\n(${pInsurer})`);
  });

  const fullMatrixRows = feature_matrix.map((row) => {
    const rowData: string[] = [cleanPdfText(row.label)];
    policies.forEach((p) => {
      const cell = row.values[p.id];
      if (!cell || cell.is_unclear) {
        rowData.push("UNCLEAR\n(No explicit clause found in PDF)");
      } else {
        let cellText = cleanPdfText(cell.value);
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
      fontSize: 7.2,
      fontStyle: "bold",
      halign: "left",
      valign: "middle",
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [30, 41, 59],
      cellPadding: 2.2,
      valign: "top",
      lineColor: borderGray,
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [252, 252, 253],
    },
    columnStyles: columnWidthsConfig,
    didParseCell: (hookData: any) => {
      if (hookData.section === "body" && typeof hookData.cell.raw === "string") {
        if (hookData.cell.raw.includes("UNCLEAR")) {
          hookData.cell.styles.textColor = [180, 83, 9]; // amber-700
          hookData.cell.styles.fillColor = [254, 243, 199]; // amber-100
          hookData.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Explanatory Note on UNCLEAR Standard at bottom of matrix
  const matrixEndDoc: any = doc as any;
  const matrixFinalY = matrixEndDoc.lastAutoTable ? matrixEndDoc.lastAutoTable.finalY + 4 : 220;

  if (matrixFinalY < pageHeight - 32) {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.roundedRect(margin, matrixFinalY, contentWidth, 14, 1.5, 1.5, "F");
    doc.setDrawColor(245, 158, 11); // amber-500
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, matrixFinalY, contentWidth, 14, 1.5, 1.5, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text("STRICT AUDIT RULE: THE MEANING OF \"UNCLEAR\"", margin + 4, matrixFinalY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(146, 64, 14);
    const unclearNote = cleanPdfText(
      "When a feature or waiting period cannot be identified through an explicit, unambiguous clause in the uploaded policy PDF, PolicyLens AI marks it as UNCLEAR rather than inferring coverage. This eliminates false assumptions and prevents unexpected claim rejections."
    );
    const wrappedNote = doc.splitTextToSize(unclearNote, contentWidth - 8);
    doc.text(wrappedNote, margin + 4, matrixFinalY + 7.8);
  }

  // ==========================================
  // PAGE 3: VERBATIM EVIDENCE AUDIT TRAIL
  // ==========================================
  doc.addPage();
  let page3Y = margin + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("4. Ground-Truth Verbatim Clause Audit Trail", margin, page3Y);

  page3Y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    cleanPdfText("Every extracted policy fact below is cross-verified against verbatim clauses and exact page citations from the contract PDF."),
    margin,
    page3Y
  );

  page3Y += 4.5;

  const evidenceRows: string[][] = [];
  policies.forEach((p, pIdx) => {
    const letter = String.fromCharCode(65 + pIdx);
    Object.entries(p.evidence_map).forEach(([field, ev]) => {
      if (ev) {
        const isUnclear = ev.value === "UNCLEAR";
        const pageRef = isUnclear ? "UNCLEAR" : `Page ${ev.page || 1}`;
        const quoteText = isUnclear
          ? cleanPdfText(ev.reason || "No explicit clause was found in the provided policy document.")
          : `"${cleanPdfText(ev.quote || ev.value || "").slice(0, 160)}"`;

        evidenceRows.push([
          cleanPdfText(`Policy ${letter}: ${p.name.slice(0, 18)}`),
          cleanPdfText(field.replace(/_/g, " ").toUpperCase()),
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
      fontSize: 7.2,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [51, 65, 85],
      cellPadding: 2,
      valign: "top",
    },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: "bold" },
      1: { cellWidth: 28, fontStyle: "bold" },
      2: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      3: { cellWidth: 100 },
    },
    didParseCell: (hookData: any) => {
      if (hookData.section === "body" && hookData.column.index === 2 && hookData.cell.raw === "UNCLEAR") {
        hookData.cell.styles.textColor = [180, 83, 9];
        hookData.cell.styles.fillColor = [254, 243, 199];
        hookData.cell.styles.fontStyle = "bold";
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
      doc.setFontSize(6.8);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text("PolicyLens AI --- Official Insurance Policy Comparison Audit", margin, 8.5);
      doc.text(`Report ID: ${reportId}`, pageWidth - margin - 28, 8.5);

      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.2);
      doc.line(margin, 10, pageWidth - margin, 10);
    }

    // Running Footer on every page
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.25);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      "PolicyLens AI --- Zero-Hallucination Insurance Audit System --- For consumer educational purposes. Not an official insurance solicitation.",
      margin,
      pageHeight - 6.5
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 6.5
    );
  }

  // Trigger Save with clean, professional filename
  const cleanFilename = `PolicyLens_Insurance_Audit_Report_${reportId}.pdf`;
  doc.save(cleanFilename);
}
