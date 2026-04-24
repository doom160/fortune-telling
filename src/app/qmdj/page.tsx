"use client";

import { FormEvent, useRef, useState } from "react";
import {
  calculateTimeQmdj,
  calculateYearQmdj,
  QmdjChart,
  QmdjFocus,
  QmdjMode,
  Palace,
  Formation,
} from "@/lib/qmdj";
import { copyToClipboard, exportReadingAsPDF } from "@/lib/pdf-export";
import { MethodologyModal } from "@/components/MethodologyModal";

type FormState = {
  mode: QmdjMode;
  birthDate: string;
  birthTime: string;
  timeZone: string;
  year: string;
  question: string;
  focus: QmdjFocus;
};

const TIMEZONE_OPTIONS = [
  { label: "Kuala Lumpur (UTC+08)", value: "Asia/Kuala_Lumpur" },
  { label: "Singapore (UTC+08)", value: "Asia/Singapore" },
  { label: "Jakarta (UTC+07)", value: "Asia/Jakarta" },
  { label: "Bangkok (UTC+07)", value: "Asia/Bangkok" },
  { label: "Shanghai (UTC+08)", value: "Asia/Shanghai" },
  { label: "Hong Kong (UTC+08)", value: "Asia/Hong_Kong" },
  { label: "Taipei (UTC+08)", value: "Asia/Taipei" },
  { label: "Seoul (UTC+09)", value: "Asia/Seoul" },
  { label: "Tokyo (UTC+09)", value: "Asia/Tokyo" },
  { label: "Sydney (UTC+10)", value: "Australia/Sydney" },
  { label: "London (UTC+00/01)", value: "Europe/London" },
  { label: "New York (UTC-05/04)", value: "America/New_York" },
  { label: "Los Angeles (UTC-08/07)", value: "America/Los_Angeles" },
  { label: "UTC", value: "UTC" },
];

const FOCUS_OPTIONS: { label: string; value: QmdjFocus }[] = [
  { label: "General / 綜合", value: "general" },
  { label: "Career / 事業", value: "career" },
  { label: "Wealth / 財運", value: "wealth" },
  { label: "Relationship / 感情", value: "relationship" },
  { label: "Health / 健康", value: "health" },
  { label: "Travel / 出行", value: "travel" },
  { label: "Legal / 訴訟", value: "legal" },
];

const EMPTY_FORM: FormState = {
  mode: "time",
  birthDate: "",
  birthTime: "",
  timeZone: "Asia/Kuala_Lumpur",
  year: "",
  question: "",
  focus: "general",
};

// Palace grid display order: top-left to bottom-right matching traditional layout
// 巽4 | 離9 | 坤2
// 震3 | 中5 | 兌7
// 艮8 | 坎1 | 乾6
const GRID_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export default function QmdjPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [chart, setChart] = useState<QmdjChart | null>(null);
  const [error, setError] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const resultPanelRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (form.mode === "time") {
        if (!form.birthDate || !form.birthTime) {
          throw new Error("Time-based mode requires both date and time.");
        }
        const result = calculateTimeQmdj({
          mode: "time",
          dateTime: `${form.birthDate}T${form.birthTime}`,
          timeZone: form.timeZone,
          question: form.question.trim() || undefined,
          focus: form.focus,
        });
        setChart(result);
      } else {
        if (!form.year) {
          throw new Error("Year-based mode requires a year.");
        }
        const result = calculateYearQmdj({
          mode: "year",
          year: parseInt(form.year, 10),
          question: form.question.trim() || undefined,
          focus: form.focus,
        });
        setChart(result);
      }
    } catch (submitError) {
      setChart(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating the chart.",
      );
    }
  }

  async function handleExportPDF() {
    if (!chart || !resultPanelRef.current) return;
    try {
      const fileName = "qmdj-reading.pdf";
      await exportReadingAsPDF(resultPanelRef.current, fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  }

  function handleShareText() {
    if (!chart) return;
    const lines: string[] = [
      "═══════════════════════════════════",
      "  奇門遁甲 · Qi Men Dun Jia",
      "═══════════════════════════════════",
      "",
      `Mode: ${chart.mode === "time" ? "Time-Based" : "Year-Based"}`,
      `${chart.isYangDun ? "Yang Dun (陽遁)" : "Yin Dun (陰遁)"} · Ju ${chart.juNumber}`,
      `Solar Term: ${chart.solarTerm.nameZh} (${chart.solarTerm.name})`,
      `Yuan: ${chart.yuan === "upper" ? "Upper (上元)" : chart.yuan === "middle" ? "Middle (中元)" : "Lower (下元)"}`,
      `Duty Star: ${chart.dutyStarName} · Duty Gate: ${chart.dutyGateName}`,
      "",
      "── Nine Palaces ──",
    ];
    for (const pNum of GRID_ORDER) {
      const p = chart.palaces.find((palace) => palace.palaceNumber === pNum);
      if (p) {
        lines.push(`  ${p.trigramZh}${p.palaceNumber}(${p.direction}): ${p.star.nameZh} | ${p.gate?.nameZh ?? "—"} | ${p.heavenStem}/${p.earthStem} | ${p.deity?.nameZh ?? "—"}`);
      }
    }
    if (chart.formations.length > 0) {
      lines.push("");
      lines.push("── Formations ──");
      for (const f of chart.formations) {
        lines.push(`  ${f.nameZh} (${f.name}) ${f.palace > 0 ? `P${f.palace}` : ""} [${f.type}]`);
      }
    }
    lines.push("");
    for (const line of chart.interpretation) {
      if (line.startsWith("## ")) {
        lines.push("");
        lines.push(`── ${line.slice(3)} ──`);
      } else {
        lines.push(line);
      }
    }
    lines.push("");
    lines.push("───────────────────────────────────");
    lines.push("Generated by 天機 Heavenly Secrets");

    const success = copyToClipboard(lines.join("\n"));
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-zh">奇門遁甲</div>
        <div className="divider" />
        <div className="hero-en">Qi Men Dun Jia</div>
        <p>
          The supreme strategic divination system — mapping cosmic forces onto nine palaces for timing, direction, and decision-making.
        </p>
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
      </section>

      <section className="workspace-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Chart Setup / 起盤設定</h2>

          {/* Mode Toggle */}
          <div className="qmdj-mode-toggle">
            <button
              type="button"
              className={`qmdj-mode-btn ${form.mode === "time" ? "qmdj-mode-btn--active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, mode: "time" }))}
            >
              時家 Time-Based
            </button>
            <button
              type="button"
              className={`qmdj-mode-btn ${form.mode === "year" ? "qmdj-mode-btn--active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, mode: "year" }))}
            >
              年家 Year-Based
            </button>
          </div>

          {form.mode === "time" ? (
            <>
              <label>
                Date / 日期
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                  required
                />
              </label>
              <label>
                Time / 時間
                <input
                  type="time"
                  value={form.birthTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, birthTime: e.target.value }))}
                  required
                />
              </label>
              <label>
                Timezone / 時區
                <select
                  value={form.timeZone}
                  onChange={(e) => setForm((prev) => ({ ...prev, timeZone: e.target.value }))}
                  required
                >
                  {TIMEZONE_OPTIONS.map((z) => (
                    <option key={z.value} value={z.value}>{z.label}</option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <label>
              Year / 年份
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="e.g. 2026"
                min={1900}
                max={2200}
                required
              />
            </label>
          )}

          <label>
            Focus Area / 問事類別
            <select
              value={form.focus}
              onChange={(e) => setForm((prev) => ({ ...prev, focus: e.target.value as QmdjFocus }))}
            >
              {FOCUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label>
            Question / 問題 (optional)
            <textarea
              value={form.question}
              onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Describe your question or situation..."
              rows={2}
            />
          </label>

          <button type="submit">Generate Chart / 起盤</button>
          {error ? <p className="error-msg">{error}</p> : null}
        </form>

        <section className="panel result-panel" ref={resultPanelRef}>
          <h2>Reading Output</h2>

          {!chart ? (
            <p className="placeholder">
              Set up the chart parameters and generate to reveal the Qi Men formation.
            </p>
          ) : (
            <>
              <div className="action-bar">
                <button type="button" onClick={handleExportPDF} className="action-btn export-btn">
                  ↓ Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleShareText}
                  className={`action-btn share-btn ${copySuccess ? "copied" : ""}`}
                >
                  {copySuccess ? "✓ Copied to Clipboard" : "⧉ Copy & Share"}
                </button>
              </div>

              <div className="meta-row">
                <p>
                  <span>{chart.isYangDun ? "Yang Dun (陽遁)" : "Yin Dun (陰遁)"}</span> · Ju {chart.juNumber}
                </p>
                <p>
                  <span>Solar Term:</span> {chart.solarTerm.nameZh} ({chart.solarTerm.name})
                </p>
                <p>
                  <span>Yuan:</span> {chart.yuan === "upper" ? "Upper (上元)" : chart.yuan === "middle" ? "Middle (中元)" : "Lower (下元)"}
                </p>
                <p>
                  <span>Duty Star:</span> {chart.dutyStarName} (P{chart.dutyStarPalace})
                </p>
                <p>
                  <span>Duty Gate:</span> {chart.dutyGateName} (P{chart.dutyGatePalace})
                </p>
                {chart.dayPillar ? (
                  <p>
                    <span>Day Pillar:</span> {chart.dayPillar.stem}{chart.dayPillar.branch}
                  </p>
                ) : null}
                {chart.hourPillar ? (
                  <p>
                    <span>Hour Pillar:</span> {chart.hourPillar.stem}{chart.hourPillar.branch}
                  </p>
                ) : null}
              </div>

              {/* Nine Palace Grid */}
              <div className="qmdj-palace-grid">
                {GRID_ORDER.map((pNum) => {
                  const palace = chart.palaces.find((p) => p.palaceNumber === pNum);
                  if (!palace) return null;
                  return <PalaceCell key={pNum} palace={palace} formations={chart.formations} />;
                })}
              </div>

              {/* Formations */}
              {chart.formations.length > 0 ? (
                <div className="qmdj-formations-section">
                  <h3>Key Formations / 格局</h3>
                  <div className="qmdj-formations-list">
                    {chart.formations.map((f, idx) => (
                      <span
                        key={idx}
                        className={`qmdj-formation-badge ${f.type === "auspicious" ? "is-auspicious" : f.type === "inauspicious" ? "is-inauspicious" : ""}`}
                        title={f.description}
                      >
                        {f.nameZh} {f.name}
                        {f.palace > 0 ? ` (P${f.palace})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Interpretation */}
              <div className="interpretation">
                <h3>Full Reading</h3>
                <ReadingSections lines={chart.interpretation} />
              </div>

              {/* Notes */}
              <div className="note-box">
                {chart.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </>
          )}
        </section>
      </section>

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How Qi Men Dun Jia Works / 奇門遁甲計算原理">
        <h3>Overview</h3>
        <p>
          Qi Men Dun Jia (奇門遁甲), literally &quot;Mysterious Gates Escaping Techniques,&quot; is considered
          the most complex Chinese metaphysical system. Originally developed for military strategy, it maps
          cosmic forces onto a 3×3 grid of Nine Palaces to assess timing, direction, and decision-making.
        </p>

        <h3>The Nine Palaces / 九宮</h3>
        <p>
          The chart is based on the Lo Shu magic square, with nine palaces arranged in a 3×3 grid. Each palace
          corresponds to a direction, trigram, and number:
        </p>
        <table>
          <thead>
            <tr><th>Palace</th><th>Direction</th><th>Trigram</th></tr>
          </thead>
          <tbody>
            <tr><td>1 坎</td><td>North</td><td>☵</td></tr>
            <tr><td>2 坤</td><td>Southwest</td><td>☷</td></tr>
            <tr><td>3 震</td><td>East</td><td>☳</td></tr>
            <tr><td>4 巽</td><td>Southeast</td><td>☴</td></tr>
            <tr><td>5 中</td><td>Center</td><td>—</td></tr>
            <tr><td>6 乾</td><td>Northwest</td><td>☰</td></tr>
            <tr><td>7 兌</td><td>West</td><td>☱</td></tr>
            <tr><td>8 艮</td><td>Northeast</td><td>☶</td></tr>
            <tr><td>9 離</td><td>South</td><td>☲</td></tr>
          </tbody>
        </table>

        <h3>Yang Dun vs. Yin Dun / 陽遁陰遁</h3>
        <p>
          The year is divided into two halves at the solstices. From the <strong>Winter Solstice (冬至)</strong> to
          the <strong>Summer Solstice (夏至)</strong>, it is Yang Dun (陽遁) — palaces are traversed in ascending order.
          From Summer Solstice to Winter Solstice, it is Yin Dun (陰遁) — descending order.
        </p>

        <h3>Solar Terms &amp; Ju Number / 節氣與局數</h3>
        <p>
          The current solar term determines the base Ju (局) number. Each of the 24 solar terms maps to specific
          Ju numbers for Upper, Middle, and Lower Yuan. The Yuan is determined using the <strong>拆補法
          (Split-Supplement Method)</strong>: the first 5 days of a solar term are Upper Yuan (上元), days 6–10
          are Middle Yuan (中元), and the remainder are Lower Yuan (下元).
        </p>

        <h3>The Four Layers</h3>
        <h4>Earth Plate / 地盤</h4>
        <p>
          Nine instrument stems (戊己庚辛壬癸丁丙乙) are placed on the palaces in a fixed sequence starting from
          the Ju palace number. This represents the stable, earthly foundation of the chart.
        </p>
        <h4>Heaven Plate / 天盤</h4>
        <p>
          The Earth Plate stems are rotated along the Lo Shu perimeter path based on the hour pillar&apos;s
          relationship to the Duty Officer palace. This rotating layer represents heavenly, dynamic forces.
        </p>
        <h4>Nine Stars / 九星</h4>
        <p>
          Nine celestial stars rotate with the Heaven Plate: 天蓬, 天芮, 天沖, 天輔, 天禽, 天心, 天柱, 天任, 天英.
          Each carries an auspicious or inauspicious nature. The star 天禽 (Palace 5) always follows 天芮 since
          Palace 5 has no position on the Lo Shu perimeter.
        </p>
        <h4>Eight Gates / 八門</h4>
        <p>
          Eight strategic gates rotate independently from the stars: 休門, 死門, 傷門, 杜門, 開門, 驚門, 生門, 景門.
          Gates represent human-level opportunities and obstacles. Palace 5 (center) has no gate.
        </p>

        <h3>Eight Deities / 八神</h3>
        <p>
          Eight spiritual deities are placed starting from the Duty Star&apos;s final palace, moving clockwise
          (Yang Dun) or counter-clockwise (Yin Dun): 值符, 騰蛇, 太陰, 六合, 白虎, 玄武, 九地, 九天.
          They represent cosmic-level influences beyond human control.
        </p>

        <h3>Duty Officers / 值符值使</h3>
        <p>
          The <strong>值符 (Duty Star)</strong> is the star that originally resides in the palace containing the
          hour&apos;s 旬首 (Xun leader) on the Earth Plate. The <strong>值使 (Duty Gate)</strong> is the gate
          native to that same palace. These are the most important elements in the chart for answering questions.
        </p>

        <h3>Formations / 格局</h3>
        <p>
          Special combinations of stars, gates, stems, and palaces form named patterns:
        </p>
        <ul>
          <li><strong>Auspicious (吉格):</strong> 天遁 (Heaven Escape), 地遁 (Earth Escape), 人遁 (Human Escape), 風遁, 雲遁, 神遁, 奇門相會</li>
          <li><strong>Inauspicious (凶格):</strong> 門迫 (Gate Pressed), 入墓 (Entombed), 大格, 刑格, 鬼遁</li>
          <li><strong>Structural:</strong> 伏吟 (Hidden Chant — stars return to home palaces), 反吟 (Returning Chant — stars are opposite to home)</li>
        </ul>

        <h3>Year-Based Mode / 年家奇門</h3>
        <p>
          A simplified variant that uses only the year stem to determine the Ju number (甲/己→1, 乙/庚→2,
          丙/辛→3, 丁/壬→4, 戊/癸→5). Useful for assessing the broad energy and direction of an entire year
          rather than a specific moment.
        </p>

        <div className="note-box">
          <strong>Note:</strong> Solar term boundaries are calculated astronomically using the astronomy-engine
          library for precise results. The 拆補法 (Split-Supplement) method is used for Yuan determination,
          which is the most widely adopted approach in modern QMDJ practice.
        </div>
      </MethodologyModal>
    </main>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────

function PalaceCell({ palace, formations }: { palace: Palace; formations: Formation[] }) {
  const hasAuspicious = palace.star.nature === "auspicious" && palace.gate?.nature === "auspicious";
  const hasInauspicious = palace.star.nature === "inauspicious" && palace.gate?.nature === "inauspicious";
  const hasFormation = formations.some((f) => f.palace === palace.palaceNumber);

  let cellClass = "qmdj-palace-cell";
  if (hasAuspicious || formations.some((f) => f.palace === palace.palaceNumber && f.type === "auspicious")) {
    cellClass += " is-auspicious";
  } else if (hasInauspicious || formations.some((f) => f.palace === palace.palaceNumber && f.type === "inauspicious")) {
    cellClass += " is-inauspicious";
  }

  return (
    <div className={cellClass}>
      <div className="qmdj-palace-header">
        <span className="qmdj-palace-trigram">{palace.trigramZh}</span>
        <span>{palace.palaceNumber} · {palace.direction}</span>
      </div>
      <div className="qmdj-star-row">
        <NatureDot nature={palace.star.nature} />
        <span>{palace.star.nameZh}</span>
      </div>
      {palace.gate ? (
        <div className="qmdj-gate-row">
          <NatureDot nature={palace.gate.nature} />
          <span>{palace.gate.nameZh}</span>
        </div>
      ) : (
        <div className="qmdj-gate-row">
          <span className="qmdj-muted">—</span>
        </div>
      )}
      <div className="qmdj-stem-row">
        <span className="qmdj-heaven-stem">{palace.heavenStem}</span>
        <span className="qmdj-stem-divider">/</span>
        <span className="qmdj-earth-stem">{palace.earthStem}</span>
      </div>
      {palace.deity ? (
        <div className="qmdj-deity-row">
          <span>{palace.deity.nameZh}</span>
        </div>
      ) : (
        <div className="qmdj-deity-row">
          <span className="qmdj-muted">—</span>
        </div>
      )}
    </div>
  );
}

function NatureDot({ nature }: { nature: "auspicious" | "inauspicious" | "neutral" }) {
  const cls = nature === "auspicious" ? "is-good" : nature === "inauspicious" ? "is-bad" : "is-neutral";
  return <span className={`qmdj-nature-dot ${cls}`} />;
}

function ReadingSections({ lines }: { lines: string[] }) {
  const sections: Array<{ title?: string; paragraphs: string[] }> = [];
  let current: { title?: string; paragraphs: string[] } = { paragraphs: [] };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current.title || current.paragraphs.length > 0) {
        sections.push(current);
      }
      current = { title: line.slice(3), paragraphs: [] };
    } else {
      current.paragraphs.push(line);
    }
  }
  if (current.title || current.paragraphs.length > 0) {
    sections.push(current);
  }

  return (
    <div className="reading-sections">
      {sections.map((section, idx) => (
        <div key={idx} className="reading-section">
          {section.title ? <h4 className="reading-section-title">{section.title}</h4> : null}
          {section.paragraphs.map((p, pIdx) => (
            <p key={pIdx} className="reading-section-text">{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
