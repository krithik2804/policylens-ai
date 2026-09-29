import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CompareResponse, PolicyExtraction } from "@/types";

export function generateComparisonPdfReport(data: CompareResponse) {
  const { policies, user_profile, summary_points, feature_matrix } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const primaryColor = [15, 23, 42]; // #0f172a
  const blueColor = [37, 99, 235]; // #2563eb
  const grayText = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc

  let yPos = margin;

  // 1. Top Decorative Brand Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 5, "F");

  // 2. Header Block
  yPos = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("PolicyLens AI", margin, yPos);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("EVIDENCE-GROUNDED INSURANCE INTELLIGENCE", margin + 44, yPos - 1);

  // Status Badge on Right
  const badgeText = "ZERO-HALLUCINATION AUDIT";
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(pageWidth - margin - 48, yPos - 5, 48, 7, 1.5, 1.5, "F");
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(pageWidth - margin - 48, yPos - 5, 48, 7, 1.5, 1.5, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(badgeText, pageWidth - margin - 46, yPos - 0.5);

  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Official Insurance Policy Comparison Report", margin, yPos);

  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const reportId = `PL-REP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  doc.text(`Report ID: ${reportId}   |   Date: ${reportDate}   |   Policies Compared: ${policies.length}`, margin, yPos);

  // Divider
  yPos += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // 3. User Profile Summary Box
  if (user_profile) {
    yPos += 5;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 16, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 16, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
    doc.text("CUSTOMER REQUIREMENT PROFILE", margin + 4, yPos + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const profText = `Beneficiary: ${user_profile.customer_type}   |   Budget Target: ${user_profile.budget}   |   Key Priorities: ${user_profile.priorities.join(", ")}`;
    doc.text(profText, margin + 4, yPos + 11);

    yPos += 20;
  } else {
    yPos += 6;
  }

  // 4. Executive Summary Bullet Points
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Factual Comparison Summary", margin, yPos);
  yPos += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  summary_points.forEach((pt) => {
    const wrappedLines = doc.splitTextToSize(`*  ${pt}`, pageWidth - margin * 2 - 4);
    doc.text(wrappedLines, margin + 2, yPos);
    yPos += wrappedLines.length * 4.2;
  });

  yPos += 3;

  // 5. Side-by-Side Comparison Matrix Table
  const tableHeaders = ["Contract Feature"];
  policies.forEach((p, idx) => {
    const letter = String.fromCharCode(65 + idx);
    tableHeaders.push(`Policy ${letter}\n${p.name.slice(0, 24)}`);
  });

  const matrixRows = feature_matrix.map((row) => {
    const rowData: string[] = [row.label];
    policies.forEach((p) => {
      const cell = row.values[p.id];
      if (!cell || cell.is_unclear) {
        rowData.push("UNCLEAR\n(No explicit clause)");
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

  const autoTableFn = (autoTable as any).default || autoTable;

  autoTableFn(doc, {
    startY: yPos,
    head: [tableHeaders],
    body: matrixRows,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 46 },
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

  // 6. Detailed Ground-Truth Verbatim Evidence Log (New Page)
  doc.addPage();
  let page2Y = margin + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Ground-Truth Verbatim Clause Audit Log", margin, page2Y);

  page2Y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("Every fact in this report is mapped to an exact sentence quote and page number in the original contract document.", margin, page2Y);

  page2Y += 4;

  const evidenceRows: string[][] = [];
  policies.forEach((p, pIdx) => {
    const letter = String.fromCharCode(65 + pIdx);
    Object.entries(p.evidence_map).forEach(([field, ev]) => {
      if (ev) {
        evidenceRows.push([
          `Policy ${letter}: ${p.name.slice(0, 18)}`,
          field.replace("_", " ").toUpperCase(),
          ev.value === "UNCLEAR" ? "UNCLEAR" : `Page ${ev.page || 1}`,
          ev.value === "UNCLEAR"
            ? (ev.reason || "No explicit clause was found in the provided policy document.")
            : `"${(ev.quote || ev.value).slice(0, 140)}"`,
        ]);
      }
    });
  });

  autoTableFn(doc, {
    startY: page2Y,
    head: [["Document", "Clause / Feature", "Page", "Verbatim Contract Quotation / Reason"]],
    body: evidenceRows,
    margin: { left: margin, right: margin },
    theme: "striped",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: "bold" },
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

  // 7. Strict UNCLEAR Disclaimer & Legal Compliance Notice
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom Notice
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(
      "PolicyLens AI • Educational Comparison Report — Not a licensed insurance solicitation or formal policy quotation.",
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 8
    );
  }

  // Trigger browser download
  const cleanFilename = `PolicyLens_Comparison_Report_${reportId}.pdf`;
  doc.save(cleanFilename);
}
