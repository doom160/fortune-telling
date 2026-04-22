import jsPDF from "jspdf";
import { BaziChart, Element } from "./bazi";
import { ZiWeiChart } from "./ziwei";

// ── Color palette ──────────────────────────────────────────────
const GOLD: [number, number, number] = [180, 136, 46];
const DARK: [number, number, number] = [30, 28, 36];
const MUTED: [number, number, number] = [110, 100, 96];
const LIGHT_BG: [number, number, number] = [250, 248, 244];
const WHITE: [number, number, number] = [255, 255, 255];

const ELEMENT_COLORS: Record<string, [number, number, number]> = {
  Wood: [126, 168, 126],
  Fire: [196, 136, 74],
  Earth: [180, 136, 46],
  Metal: [168, 168, 152],
  Water: [106, 142, 168],
};

// ── Font helpers ───────────────────────────────────────────────
type PDF = jsPDF;

function renderText(pdf: PDF, text: string, x: number, y: number, options?: any) {
  // For Chinese characters, try to render them, but they might not display correctly
  // due to font limitations in jsPDF v4.2.1
  pdf.setFont("helvetica", "normal");
  pdf.text(text, x, y, options);
}

// Helper to add Chinese character support note at bottom of PDF
function addFontNote(pdf: PDF, y: number, ml: number): number {
  const noteText = "Note: Chinese characters may display as boxes due to font limitations in PDF export.";
  pdf.setFontSize(8);
  pdf.setTextColor(110, 100, 96); // MUTED color
  const lines = pdf.splitTextToSize(noteText, 180);
  for (const line of lines) {
    pdf.text(line, ml, y);
    y += 3;
  }
  return y;
}

// ── Shared helpers ─────────────────────────────────────────────

function ensureSpace(pdf: PDF, y: number, needed: number): number {
  const pageHeight = pdf.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    pdf.addPage();
    return 15;
  }
  return y;
}

function drawSectionHeader(pdf: PDF, y: number, title: string, ml: number): number {
  y = ensureSpace(pdf, y, 12);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...GOLD);
  pdf.text(title, ml, y);
  y += 1;
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.4);
  pdf.line(ml, y, ml + pdf.getTextWidth(title), y);
  pdf.setTextColor(...DARK);
  y += 5;
  return y;
}

function drawPageHeader(pdf: PDF, titleZh: string, titleEn: string): number {
  const pw = pdf.internal.pageSize.getWidth();
  // Gold accent bar at top
  pdf.setFillColor(...GOLD);
  pdf.rect(0, 0, pw, 2, "F");

  let y = 16;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(...GOLD);
  renderText(pdf, titleZh, pw / 2, y, { align: "center" });
  y += 6;
  pdf.setFontSize(11);
  pdf.setTextColor(...DARK);
  pdf.text(titleEn, pw / 2, y, { align: "center" });
  y += 3;
  // Divider
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.3);
  pdf.line(pw / 2 - 30, y, pw / 2 + 30, y);
  y += 6;
  return y;
}

function drawWrappedParagraph(
  pdf: PDF,
  y: number,
  text: string,
  ml: number,
  tw: number,
  fontSize: number = 9,
): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...DARK);
  const lines = pdf.splitTextToSize(text, tw);
  const lineH = fontSize * 0.45;
  for (const line of lines) {
    y = ensureSpace(pdf, y, lineH + 1);
    pdf.text(line, ml, y);
    y += lineH;
  }
  y += 2;
  return y;
}

// ── BaZi PDF ──────────────────────────────────────────────────
export function generateTextPDF(chart: BaziChart, name?: string): jsPDF {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ml = 15;
  const mr = 15;
  const tw = pw - ml - mr;

  let y = drawPageHeader(pdf, "八字", "BaZi Reading Report");

  // ── Birth Info Box ──
  pdf.setFillColor(...LIGHT_BG);
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.3);
  const infoBoxH = name ? 22 : 18;
  pdf.roundedRect(ml, y, tw, infoBoxH, 1, 1, "FD");
  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  if (name) {
    pdf.setFont("helvetica", "bold");
    pdf.text(`Name: ${name}`, ml + 4, y);
    y += 4.5;
    pdf.setFont("helvetica", "normal");
  }
  pdf.text(`Birth: ${chart.localBirthDateTime}`, ml + 4, y);
  const dmText = `Day Master: ${chart.dayMaster.pinyin} ${chart.dayMaster.chinese} (${chart.dayMaster.element})`;
  pdf.text(dmText, ml + 4 + tw / 2, y);
  y += 4.5;
  if (chart.solarTermInfo) {
    pdf.setTextColor(...MUTED);
    pdf.text(`Solar Term: ${chart.solarTermInfo.term} (${chart.solarTermInfo.date})`, ml + 4, y);
  }
  y = y + (infoBoxH - (name ? 14 : 10)) + 6;

  // ── Four Pillars Table ──
  y = drawSectionHeader(pdf, y, "Four Pillars", ml);

  const pillars = [
    { title: "Year", pillar: chart.yearPillar, hl: false },
    { title: "Month", pillar: chart.monthPillar, hl: true },
    { title: "Day", pillar: chart.dayPillar, hl: true },
    { title: "Hour", pillar: chart.hourPillar, hl: false },
  ];

  const colW = tw / 4;
  const tableTop = y;
  const rowHeights = [6, 14, 6, 6, 6]; // header, glyph, pinyin, element, animal
  const tableH = rowHeights.reduce((a, b) => a + b, 0);

  y = ensureSpace(pdf, y, tableH + 4);

  for (let col = 0; col < 4; col++) {
    const x = ml + col * colW;
    const p = pillars[col];

    // Column background
    if (p.hl) {
      pdf.setFillColor(255, 250, 240);
    } else {
      pdf.setFillColor(...WHITE);
    }
    pdf.setDrawColor(220, 215, 205);
    pdf.setLineWidth(0.2);
    pdf.rect(x, tableTop, colW, tableH, "FD");

    // Gold left border for highlighted columns
    if (p.hl) {
      pdf.setDrawColor(...GOLD);
      pdf.setLineWidth(0.8);
      pdf.line(x, tableTop, x, tableTop + tableH);
    }

    let ry = tableTop;

    // Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...GOLD);
    pdf.text(p.title, x + colW / 2, ry + 4.5, { align: "center" });
    ry += rowHeights[0];

    if (p.pillar) {
      // Glyph
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(18);
      pdf.setTextColor(...DARK);
      renderText(pdf,
        `${p.pillar.stem.chinese}${p.pillar.branch.chinese}`,
        x + colW / 2,
        ry + 10,
        { align: "center" },
      );
      ry += rowHeights[1];

      // Pinyin
      pdf.setFontSize(8);
      pdf.setTextColor(...MUTED);
      pdf.text(
        `${p.pillar.stem.pinyin} ${p.pillar.branch.pinyin}`,
        x + colW / 2,
        ry + 4.5,
        { align: "center" },
      );
      ry += rowHeights[2];

      // Element
      pdf.setFontSize(8);
      const elemColor = ELEMENT_COLORS[p.pillar.stem.element] || DARK;
      pdf.setTextColor(...elemColor);
      pdf.text(
        `${p.pillar.stem.element} / ${p.pillar.branch.element}`,
        x + colW / 2,
        ry + 4.5,
        { align: "center" },
      );
      ry += rowHeights[3];

      // Animal
      pdf.setFontSize(7.5);
      pdf.setTextColor(...MUTED);
      pdf.text(p.pillar.branch.animal, x + colW / 2, ry + 4.5, { align: "center" });
    } else {
      pdf.setFontSize(9);
      pdf.setTextColor(...MUTED);
      pdf.text("Not provided", x + colW / 2, ry + 10, { align: "center" });
    }
  }
  y = tableTop + tableH + 6;

  // ── Five Elements Bar Chart ──
  y = drawSectionHeader(pdf, y, "Five Elements Balance", ml);
  const barH = 5;
  const barGap = 2;
  const labelW = 22;
  const countW = 10;
  const maxBarW = tw - labelW - countW - 4;

  const elements = Object.entries(chart.elementCounts);
  const maxCount = Math.max(...elements.map(([, c]) => c), 1);

  for (const [elem, count] of elements) {
    y = ensureSpace(pdf, y, barH + barGap + 1);
    // Label
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...DARK);
    pdf.text(elem, ml, y + 3.5);

    // Bar track
    pdf.setFillColor(240, 238, 232);
    pdf.roundedRect(ml + labelW, y, maxBarW, barH, 1, 1, "F");

    // Bar fill
    const fillW = Math.max(4, (count / maxCount) * maxBarW);
    const color = ELEMENT_COLORS[elem] || DARK;
    pdf.setFillColor(...color);
    pdf.roundedRect(ml + labelW, y, fillW, barH, 1, 1, "F");

    // Count
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text(String(count), ml + labelW + maxBarW + 3, y + 3.5);

    y += barH + barGap;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  pdf.text(
    `Dominant: ${chart.dominantElement}  |  Weakest: ${chart.weakElement}`,
    ml,
    y + 2,
  );
  y += 8;

  // ── Major Luck Pillars ──
  y = drawSectionHeader(pdf, y, "Major Luck Pillars (Daiyun)", ml);
  const luckCols = Math.min(8, chart.luckPillars.length);
  const luckColW = tw / luckCols;
  const luckH = 28;

  y = ensureSpace(pdf, y, luckH + 4);
  const luckTop = y;

  for (let i = 0; i < luckCols; i++) {
    const lp = chart.luckPillars[i];
    const x = ml + i * luckColW;

    pdf.setFillColor(...WHITE);
    pdf.setDrawColor(220, 215, 205);
    pdf.setLineWidth(0.2);
    pdf.rect(x, luckTop, luckColW, luckH, "FD");

    let ly = luckTop + 4;

    // Decade label
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(...MUTED);
    pdf.text(`Decade ${lp.decade}`, x + luckColW / 2, ly, { align: "center" });
    ly += 3.5;

    // Age
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(...DARK);
    pdf.text(`${lp.ageStart}-${lp.ageEnd}`, x + luckColW / 2, ly, { align: "center" });
    ly += 5;

    // Glyph
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(...DARK);
    renderText(pdf,
      `${lp.pillar.stem.chinese}${lp.pillar.branch.chinese}`,
      x + luckColW / 2,
      ly,
      { align: "center" },
    );
    ly += 5;

    // Element
    pdf.setFontSize(7);
    const elemColor = ELEMENT_COLORS[lp.pillar.stem.element] || DARK;
    pdf.setTextColor(...elemColor);
    pdf.text(lp.pillar.stem.element, x + luckColW / 2, ly, { align: "center" });
    ly += 3.5;

    // Years
    pdf.setFontSize(5.5);
    pdf.setTextColor(...MUTED);
    pdf.text(lp.yearRange, x + luckColW / 2, ly, { align: "center" });
  }
  y = luckTop + luckH + 6;

  // ── Hidden Stems Table ──
  y = drawSectionHeader(pdf, y, "Hidden Stems (Cang Gan)", ml);
  const hsColW = tw / 4;
  const hsH = 24;

  y = ensureSpace(pdf, y, hsH + 4);
  const hsTop = y;
  const pillarNames = ["Year", "Month", "Day", "Hour"];

  for (let i = 0; i < chart.hiddenStemAnalysis.length; i++) {
    const analysis = chart.hiddenStemAnalysis[i];
    const x = ml + i * hsColW;

    pdf.setFillColor(...WHITE);
    pdf.setDrawColor(220, 215, 205);
    pdf.setLineWidth(0.2);
    pdf.rect(x, hsTop, hsColW, hsH, "FD");

    let hy = hsTop + 4;

    // Pillar label
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(...GOLD);
    pdf.text(pillarNames[i], x + hsColW / 2, hy, { align: "center" });
    hy += 4;

    // Branch glyph
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(...DARK);
    renderText(pdf, analysis.pillar.branch.chinese, x + hsColW / 2, hy, { align: "center" });
    hy += 3;
    pdf.setFontSize(6.5);
    pdf.setTextColor(...MUTED);
    pdf.text(analysis.pillar.branch.pinyin, x + hsColW / 2, hy, { align: "center" });
    hy += 4;

    // Hidden stems
    if (analysis.hiddenStems.length > 0) {
      for (const hs of analysis.hiddenStems) {
        pdf.setFontSize(6.5);
        pdf.setTextColor(...DARK);
        renderText(pdf,
          `${hs.stem.chinese} ${hs.stem.pinyin} (${hs.stem.element})`,
          x + hsColW / 2,
          hy,
          { align: "center" },
        );
        hy += 3;
      }
    } else {
      pdf.setFontSize(6.5);
      pdf.setTextColor(...MUTED);
      pdf.text("Single stem", x + hsColW / 2, hy, { align: "center" });
    }
  }
  y = hsTop + hsH + 6;

  // ── Interpretation Sections ──
  y = drawSectionHeader(pdf, y, "Interpretation", ml);
  y = drawInterpretationSections(pdf, y, chart.interpretation, ml, tw);

  // ── Notes ──
  y = ensureSpace(pdf, y, 10);
  pdf.setDrawColor(220, 215, 205);
  pdf.setLineWidth(0.2);
  pdf.line(ml, y, ml + tw, y);
  y += 4;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  for (const note of chart.notes) {
    const wrapped = pdf.splitTextToSize(note, tw);
    for (const line of wrapped) {
      y = ensureSpace(pdf, y, 4);
      pdf.text(line, ml, y);
      y += 3.5;
    }
  }

  // Add font limitation note
  y = ensureSpace(pdf, y, 15);
  y = addFontNote(pdf, y + 5, ml);

  return pdf;
}

// ── Zi Wei PDF ────────────────────────────────────────────────
export function generateZiWeiTextPDF(chart: ZiWeiChart, name?: string): jsPDF {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ml = 15;
  const mr = 15;
  const tw = pw - ml - mr;

  let y = drawPageHeader(pdf, "紫微斗數", "Zi Wei Dou Shu Reading Report");

  // ── Chart Info Grid (2x4) ──
  if (name) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...DARK);
    pdf.text(`Name: ${name}`, ml, y);
    y += 5;
  }

  const infoItems = [
    { label: "Solar Date", value: chart.solarDateByTrue || chart.solarDate },
    { label: "Lunisolar", value: chart.lunisolarDate },
    { label: "Year Pillar", value: `${chart.birthYearStem}${chart.birthYearBranch}` },
    { label: "Zodiac", value: chart.zodiac },
    { label: "Hour", value: `${chart.hour} · ${chart.hourRange}` },
    { label: "Five Element", value: chart.fiveElementName },
    { label: "Zi Wei", value: chart.ziweiBranch },
    { label: "Luck Flow", value: chart.horoscopeDirection === 1 ? "Forward" : "Reverse" },
  ];

  const infoCols = 4;
  const infoRows = 2;
  const infoColW = tw / infoCols;
  const infoRowH = 12;
  const infoTop = y;

  for (let r = 0; r < infoRows; r++) {
    for (let c = 0; c < infoCols; c++) {
      const idx = r * infoCols + c;
      if (idx >= infoItems.length) break;
      const item = infoItems[idx];
      const x = ml + c * infoColW;
      const cy = infoTop + r * infoRowH;

      pdf.setFillColor(...LIGHT_BG);
      pdf.setDrawColor(220, 215, 205);
      pdf.setLineWidth(0.2);
      pdf.rect(x, cy, infoColW, infoRowH, "FD");

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor(...MUTED);
      pdf.text(item.label, x + 2, cy + 4);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(...DARK);
      pdf.text(item.value, x + 2, cy + 9);
    }
  }
  y = infoTop + infoRows * infoRowH + 6;

  // ── Traditional Palace Grid (4x4 border) ──
  y = drawSectionHeader(pdf, y, "Twelve Palaces", ml);

  const branchOrder = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const gridPositions: Array<{ row: number; col: number; branchIdx: number }> = [
    { row: 0, col: 0, branchIdx: 4 },
    { row: 0, col: 1, branchIdx: 5 },
    { row: 0, col: 2, branchIdx: 6 },
    { row: 0, col: 3, branchIdx: 7 },
    { row: 1, col: 0, branchIdx: 3 },
    { row: 1, col: 3, branchIdx: 8 },
    { row: 2, col: 0, branchIdx: 2 },
    { row: 2, col: 3, branchIdx: 9 },
    { row: 3, col: 0, branchIdx: 1 },
    { row: 3, col: 1, branchIdx: 0 },
    { row: 3, col: 2, branchIdx: 11 },
    { row: 3, col: 3, branchIdx: 10 },
  ];

  const palaceByBranch = new Map<string, (typeof chart.palaces)[number]>();
  for (const p of chart.palaces) {
    palaceByBranch.set(p.branch, p);
  }

  const gridColW = tw / 4;
  const gridRowH = 24;
  const gridH = 4 * gridRowH;

  y = ensureSpace(pdf, y, gridH + 4);
  const gridTop = y;

  // Draw outer border
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.rect(ml, gridTop, tw, gridH);

  // Draw inner grid lines
  pdf.setDrawColor(220, 215, 205);
  pdf.setLineWidth(0.2);
  for (let c = 1; c < 4; c++) {
    pdf.line(ml + c * gridColW, gridTop, ml + c * gridColW, gridTop + gridH);
  }
  for (let r = 1; r < 4; r++) {
    pdf.line(ml, gridTop + r * gridRowH, ml + tw, gridTop + r * gridRowH);
  }

  // Fill palace cells
  for (const pos of gridPositions) {
    const branch = branchOrder[pos.branchIdx];
    const palace = palaceByBranch.get(branch);
    const x = ml + pos.col * gridColW;
    const cy = gridTop + pos.row * gridRowH;

    if (palace) {
      let py = cy + 4;

      // Palace name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(...DARK);
      pdf.text(palace.name, x + 2, py);
      py += 3.5;

      // Stem+Branch and age
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor(...MUTED);
      renderText(pdf,
        `${palace.stem}${palace.branch}  ${palace.horoscopeRanges[0]}-${palace.horoscopeRanges[1]}`,
        x + 2,
        py,
      );
      py += 4;

      // Major stars
      if (palace.majorStars.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...GOLD);
        const starsText = palace.majorStars.map((s) => s.name).join(" ");
        const wrapped = pdf.splitTextToSize(starsText, gridColW - 4);
        for (const line of wrapped.slice(0, 2)) {
          pdf.text(line, x + 2, py);
          py += 3;
        }
      }

      // Minor stars (compact)
      if (palace.minorStars.length > 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(5.5);
        pdf.setTextColor(...MUTED);
        const minorText = palace.minorStars.map((s) => s.name).join(" ");
        const wrapped = pdf.splitTextToSize(minorText, gridColW - 4);
        for (const line of wrapped.slice(0, 1)) {
          pdf.text(line, x + 2, py);
          py += 2.5;
        }
      }

      // Lai Yin badge
      if (palace.isLaiYin) {
        pdf.setFillColor(...GOLD);
        pdf.roundedRect(x + gridColW - 12, cy + 1.5, 10, 3.5, 0.5, 0.5, "F");
        pdf.setFontSize(5);
        pdf.setTextColor(...WHITE);
        pdf.text("Lai Yin", x + gridColW - 7, cy + 4, { align: "center" });
      }
    } else {
      // Empty branch label
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(220, 215, 205);
      renderText(pdf, branch, x + gridColW / 2, cy + gridRowH / 2 + 2, { align: "center" });
    }
  }

  // Label center area
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(7);
  pdf.setTextColor(210, 205, 195);
  pdf.text("Zi Wei Dou Shu", ml + gridColW + (gridColW * 2) / 2, gridTop + gridRowH + gridRowH / 2, {
    align: "center",
  });
  pdf.text("Chart", ml + gridColW + (gridColW * 2) / 2, gridTop + gridRowH + gridRowH / 2 + 4, {
    align: "center",
  });

  y = gridTop + gridH + 8;

  // ── Interpretation Sections ──
  y = drawSectionHeader(pdf, y, "Interpretation", ml);
  y = drawInterpretationSections(pdf, y, chart.interpretation, ml, tw);

  // ── Notes ──
  y = ensureSpace(pdf, y, 10);
  pdf.setDrawColor(220, 215, 205);
  pdf.setLineWidth(0.2);
  pdf.line(ml, y, ml + tw, y);
  y += 4;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  for (const note of chart.notes) {
    const wrapped = pdf.splitTextToSize(note, tw);
    for (const line of wrapped) {
      y = ensureSpace(pdf, y, 4);
      pdf.text(line, ml, y);
      y += 3.5;
    }
  }

  // Add font limitation note
  y = ensureSpace(pdf, y, 15);
  y = addFontNote(pdf, y + 5, ml);

  return pdf;
}

// ── Shared interpretation renderer ────────────────────────────
function drawInterpretationSections(
  pdf: PDF,
  y: number,
  lines: string[],
  ml: number,
  tw: number,
): number {
  for (const line of lines) {
    if (line.startsWith("## ")) {
      const title = line.slice(3);
      y = ensureSpace(pdf, y, 10);
      y += 2;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(...GOLD);
      pdf.text(title, ml, y);
      y += 4;
    } else {
      y = drawWrappedParagraph(pdf, y, line, ml, tw, 8.5);
    }
  }
  return y;
}

// ── Clipboard / shareable text ────────────────────────────────
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

Hidden Stems (Cang Gan):
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

export async function exportReadingAsPDF(
  element: HTMLElement,
  fileName: string = "bazi-reading.pdf",
) {
  // Find all <details> elements and store their current state
  const detailsElements = element.querySelectorAll("details");
  const originalStates = Array.from(detailsElements).map(detail => detail.open);

  // Create a style element for PDF-specific overrides
  const pdfStyles = document.createElement("style");
  pdfStyles.textContent = `
    /* PDF Export Overrides for Better Readability */
    .pdf-export-override {
      background: white !important;
      color: #2d2d2d !important;
    }
    .pdf-export-override h1,
    .pdf-export-override h2,
    .pdf-export-override h3,
    .pdf-export-override h4,
    .pdf-export-override .hero-zh,
    .pdf-export-override .hero-en,
    .pdf-export-override .pillar-title,
    .pdf-export-override .luck-element,
    .pdf-export-override .annual-outlook-area,
    .pdf-export-override .element-name,
    .pdf-export-override [style*="color: var(--gold)"],
    .pdf-export-override [class*="gold"] {
      color: #1a5490 !important; /* Dark blue instead of gold */
    }
    .pdf-export-override .panel,
    .pdf-export-override .pillar-card,
    .pdf-export-override .luck-card,
    .pdf-export-override .hidden-stem-card,
    .pdf-export-override .annual-detail,
    .pdf-export-override .annual-outlook-card,
    .pdf-export-override .element-bar-container,
    .pdf-export-override .ziwei-palace-card,
    .pdf-export-override .ziwei-info-tile {
      background: #f8f9fa !important; /* Light gray background */
      border-color: #dee2e6 !important; /* Light border */
      color: #2d2d2d !important;
    }
    .pdf-export-override .glyph {
      color: #1a5490 !important; /* Dark blue for Chinese characters */
      font-weight: bold !important;
    }
    .pdf-export-override .current-year-badge,
    .pdf-export-override .ziwei-badge {
      background: #1a5490 !important;
      color: white !important;
    }
    .pdf-export-override .divider {
      background: linear-gradient(90deg, transparent, #1a5490, transparent) !important;
    }
  `;

  try {
    // Add PDF styles to document
    document.head.appendChild(pdfStyles);

    // Add PDF override class to element
    element.classList.add('pdf-export-override');

    // Expand all details elements for full content capture
    detailsElements.forEach(detail => {
      detail.open = true;
    });

    // Wait a bit for the expansion and style changes to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Clean white background
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    // Clean up: remove PDF styles and classes
    element.classList.remove('pdf-export-override');
    document.head.removeChild(pdfStyles);

    // Restore original states of details elements
    detailsElements.forEach((detail, index) => {
      detail.open = originalStates[index];
    });
  }
}
