import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BaziChart } from "./bazi";
import { ZiWeiChart } from "./ziwei";

export async function exportReadingAsPDF(
  element: HTMLElement,
  fileName: string = "bazi-reading.pdf",
) {
  try {
    // Capture the canvas from the HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#f4efe3",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF, creating new pages if needed
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Check console for details.");
  }
}

export function generateTextPDF(chart: BaziChart, name?: string): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;
  const lineHeight = 5;
  const marginLeft = 15;
  const marginRight = 15;
  const textWidth = pageWidth - marginLeft - marginRight;

  // Set default font
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  // Title
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("BaZi Reading Report", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Birth info
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  if (name) {
    pdf.text(`Name: ${name}`, marginLeft, yPosition);
    yPosition += lineHeight;
  }
  pdf.text(`Birth: ${chart.localBirthDateTime}`, marginLeft, yPosition);
  yPosition += lineHeight;
  if (chart.solarTermInfo) {
    pdf.text(
      `Solar Term: ${chart.solarTermInfo.term} (${chart.solarTermInfo.date})`,
      marginLeft,
      yPosition,
    );
    yPosition += lineHeight;
  }
  yPosition += 3;

  // Four Pillars
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Four Pillars", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const pillars = [
    { title: "Year", pillar: chart.yearPillar },
    { title: "Month", pillar: chart.monthPillar, highlight: true },
    { title: "Day", pillar: chart.dayPillar },
    { title: "Hour", pillar: chart.hourPillar, missing: !chart.hourPillar },
  ];

  for (const p of pillars) {
    const prefix = p.highlight ? "→ " : "  ";
    if (p.missing) {
      pdf.text(
        `${prefix}${p.title}: (Not provided)`,
        marginLeft,
        yPosition,
      );
    } else if (p.pillar) {
      pdf.text(
        `${prefix}${p.title}: ${p.pillar.stem.pinyin} ${p.pillar.stem.chinese} / ${p.pillar.branch.pinyin} ${p.pillar.branch.chinese} (${p.pillar.branch.animal})`,
        marginLeft,
        yPosition,
      );
    }
    yPosition += lineHeight;
  }

  yPosition += 3;

  // Element Analysis
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Element Analysis", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const elements = Object.entries(chart.elementCounts);
  for (const [element, count] of elements) {
    pdf.text(`${element}: ${"●".repeat(count)} (${count})`, marginLeft, yPosition);
    yPosition += lineHeight;
  }
  pdf.text(
    `Dominant: ${chart.dominantElement} | Weakest: ${chart.weakElement}`,
    marginLeft,
    yPosition,
  );
  yPosition += 6;

  // Luck Pillars (first 4 decades)
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Major Luck Pillars (Daiyun)", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  for (let i = 0; i < Math.min(4, chart.luckPillars.length); i++) {
    const lp = chart.luckPillars[i];
    pdf.text(
      `Decade ${i}: Age ${lp.ageStart}-${lp.ageEnd} (${lp.yearRange}) — ${lp.pillar.stem.pinyin} ${lp.pillar.stem.chinese} / ${lp.pillar.branch.pinyin} ${lp.pillar.branch.chinese} (${lp.pillar.stem.element})`,
      marginLeft,
      yPosition,
    );
    yPosition += lineHeight;
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 15;
    }
  }

  yPosition += 3;

  // Hidden Stems Analysis
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Hidden Stems Analysis (Nayin)", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  const pillarNames = ["Year", "Month", "Day", "Hour"];
  for (let i = 0; i < chart.hiddenStemAnalysis.length; i++) {
    const analysis = chart.hiddenStemAnalysis[i];
    const hiddenText = analysis.hiddenStems
      .map((hs) => `${hs.stem.pinyin} (${hs.stem.element})`)
      .join(", ");
    pdf.text(
      `${pillarNames[i]}: ${analysis.pillar.branch.pinyin} ${analysis.pillar.branch.chinese} → ${hiddenText || "Single stem"}`,
      marginLeft,
      yPosition,
    );
    yPosition += lineHeight * 0.9;
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 15;
    }
  }

  yPosition += 3;

  // Annual Luck Pillars (first 10 years)
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Annual Luck Pillars (Xiaoyun) – First Decade", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  for (let i = 0; i < Math.min(10, chart.annualLuckPillars.length); i++) {
    const annual = chart.annualLuckPillars[i];
    const monthSample = annual.monthlyPillars
      .slice(0, 3)
      .map(
        (m) =>
          `${m.monthName}: ${m.pillar.stem.pinyin}${m.pillar.branch.pinyin}`,
      )
      .join(" | ");
    pdf.text(
      `${annual.yearLabel} → ${annual.pillar.stem.pinyin} ${annual.pillar.branch.pinyin} (${annual.pillar.stem.element}) | Months: ${monthSample}...`,
      marginLeft,
      yPosition,
    );
    yPosition += lineHeight * 0.85;
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 15;
    }
  }

  yPosition += 5;

  // Interpretation
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Interpretation", marginLeft, yPosition);
  yPosition += 6;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  for (const line of chart.interpretation) {
    const wrapped = pdf.splitTextToSize(line, textWidth);
    pdf.text(wrapped, marginLeft, yPosition);
    yPosition += wrapped.length * lineHeight;

    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 15;
    }
  }

  yPosition += 5;

  // Notes
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  for (const note of chart.notes) {
    const wrapped = pdf.splitTextToSize(note, textWidth);
    pdf.text(wrapped, marginLeft, yPosition);
    yPosition += wrapped.length * (lineHeight * 0.8);

    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 15;
    }
  }

  return pdf;
}

export function copyToClipboard(text: string): boolean {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function generateShareableText(chart: BaziChart, name?: string): string {
  return `
BaZi Reading Report
${"=".repeat(40)}
${name ? `Name: ${name}` : ""}
Birth: ${chart.localBirthDateTime}
Day Master: ${chart.dayMaster.pinyin} ${chart.dayMaster.chinese} (${chart.dayMaster.element})

Four Pillars:
- Year: ${chart.yearPillar.stem.pinyin} ${chart.yearPillar.branch.pinyin}
- Month: ${chart.monthPillar.stem.pinyin} ${chart.monthPillar.branch.pinyin}
- Day: ${chart.dayPillar.stem.pinyin} ${chart.dayPillar.branch.pinyin}
${chart.hourPillar ? `- Hour: ${chart.hourPillar.stem.pinyin} ${chart.hourPillar.branch.pinyin}` : ""}

Element Balance:
${Object.entries(chart.elementCounts)
  .map(([elem, count]) => `- ${elem}: ${"●".repeat(count)}`)
  .join("\n")}
Dominant: ${chart.dominantElement} | Weakest: ${chart.weakElement}

Hidden Stems (Nayin):
${chart.hiddenStemAnalysis
  .map(
    (analysis, idx) =>
      `- ${["Year", "Month", "Day", "Hour"][idx]}: ${analysis.pillar.branch.pinyin} contains ${analysis.hiddenStems.map((hs) => hs.stem.pinyin).join(", ") || "single stem"}`,
  )
  .join("\n")}

Life Luck Overview:
${chart.luckPillars
  .slice(0, 4)
  .map(
    (lp) =>
      `- Decade ${lp.decade} (Age ${lp.ageStart}-${lp.ageEnd}): ${lp.pillar.stem.pinyin} ${lp.pillar.branch.pinyin}`,
  )
  .join("\n")}

Annual Luck Sample (First 5 Years):
${chart.annualLuckPillars
  .slice(0, 5)
  .map(
    (annual) =>
      `- ${annual.yearLabel}: ${annual.pillar.stem.pinyin} ${annual.pillar.branch.pinyin}`,
  )
  .join("\n")}

Interpretation:
${chart.interpretation.join("\n\n")}
`;
}

export function generateZiWeiTextPDF(chart: ZiWeiChart, name?: string): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;
  const textWidth = pageWidth - marginLeft - marginRight;
  const lineHeight = 5;
  let y = 15;

  const ensureSpace = (requiredHeight = 10) => {
    if (y + requiredHeight > pageHeight - 15) {
      pdf.addPage();
      y = 15;
    }
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Zi Wei Dou Shu Reading Report", pageWidth / 2, y, { align: "center" });
  y += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  if (name) {
    pdf.text(`Name: ${name}`, marginLeft, y);
    y += lineHeight;
  }
  pdf.text(`Solar Date: ${chart.solarDateByTrue || chart.solarDate}`, marginLeft, y);
  y += lineHeight;
  pdf.text(`Lunisolar Date: ${chart.lunisolarDate}`, marginLeft, y);
  y += lineHeight;
  pdf.text(
    `Year Pillar: ${chart.birthYearStem}${chart.birthYearBranch} | Zodiac: ${chart.zodiac}`,
    marginLeft,
    y,
  );
  y += lineHeight;
  pdf.text(
    `Hour: ${chart.hour} (${chart.hourRange}) | Luck Flow: ${chart.horoscopeDirection === 1 ? "Forward" : "Reverse"}`,
    marginLeft,
    y,
  );
  y += lineHeight + 2;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Interpretation", marginLeft, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  for (const line of chart.interpretation) {
    const wrapped = pdf.splitTextToSize(`- ${line}`, textWidth);
    ensureSpace(wrapped.length * lineHeight + 2);
    pdf.text(wrapped, marginLeft, y);
    y += wrapped.length * lineHeight;
  }

  y += 3;
  ensureSpace(12);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Twelve Palaces", marginLeft, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  for (const palace of chart.palaces) {
    const major =
      palace.majorStars.length > 0
        ? palace.majorStars.map((star) => star.name).join(", ")
        : "None listed";
    const line = `${palace.name} (${palace.stem}${palace.branch}) Ages ${palace.horoscopeRanges[0]}-${palace.horoscopeRanges[1]} | Major: ${major}`;
    const wrapped = pdf.splitTextToSize(line, textWidth);
    ensureSpace(wrapped.length * lineHeight + 1);
    pdf.text(wrapped, marginLeft, y);
    y += wrapped.length * lineHeight;
  }

  y += 3;
  ensureSpace(10);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  for (const note of chart.notes) {
    const wrapped = pdf.splitTextToSize(note, textWidth);
    ensureSpace(wrapped.length * (lineHeight * 0.8) + 1);
    pdf.text(wrapped, marginLeft, y);
    y += wrapped.length * (lineHeight * 0.8);
  }

  return pdf;
}

export function generateZiWeiShareableText(chart: ZiWeiChart, name?: string): string {
  const corePalaces = chart.palaces
    .filter((palace) => ["MING", "GUAN_LU", "CAI_BO", "FU_QI", "FU_DE"].includes(palace.key))
    .map((palace) => {
      const major =
        palace.majorStars.length > 0
          ? palace.majorStars.map((star) => star.name).join(", ")
          : "None listed";
      return `- ${palace.name} (${palace.stem}${palace.branch}) Ages ${palace.horoscopeRanges[0]}-${palace.horoscopeRanges[1]} | Major: ${major}`;
    })
    .join("\n");

  return `
Zi Wei Dou Shu Reading Report
${"=".repeat(40)}
${name ? `Name: ${name}` : ""}
Solar Date: ${chart.solarDateByTrue || chart.solarDate}
Lunisolar Date: ${chart.lunisolarDate}
Year Pillar: ${chart.birthYearStem}${chart.birthYearBranch}
Zodiac: ${chart.zodiac}
Hour: ${chart.hour} (${chart.hourRange})
Five Element Bureau: ${chart.fiveElementName}
Zi Wei Position: ${chart.ziweiBranch}
Luck Flow: ${chart.horoscopeDirection === 1 ? "Forward" : "Reverse"}

Core Palace Snapshot:
${corePalaces}

Interpretation:
${chart.interpretation.join("\n\n")}
`;
}
