"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnnualLuckPillar, BaziChart, calculateBazi } from "@/lib/bazi";
import { generateShareableText, copyToClipboard, exportReadingAsPDF } from "@/lib/pdf-export";

type FormState = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "Female" | "Male";
  timeZone: string;
};

type OutlookLabel = "Favorable" | "Neutral" | "Challenging";

type OutlookItem = {
  area: "Career" | "Finance" | "Love" | "Health";
  label: OutlookLabel;
  note: string;
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

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "var(--wood)",
  Fire: "var(--fire)",
  Earth: "var(--earth)",
  Metal: "var(--metal)",
  Water: "var(--water)",
};

const EMPTY_FORM: FormState = {
  name: "",
  birthDate: "",
  birthTime: "",
  gender: "Female",
  timeZone: "Asia/Kuala_Lumpur",
};

export default function BaziPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [error, setError] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const resultPanelRef = useRef<HTMLDivElement>(null);

  const elementRows = useMemo(() => {
    if (!chart) {
      return [];
    }

    return Object.entries(chart.elementCounts).map(([element, count]) => ({
      element,
      count,
      percent: Math.max(8, (count / 8) * 100),
    }));
  }, [chart]);

  const currentAge = useMemo(() => calculateCurrentAge(form.birthDate), [form.birthDate]);

  const focusedAnnualPillars = useMemo(() => {
    if (!chart || currentAge === null || currentAge < 3) {
      return [];
    }

    return selectFocusedAnnualPillars(chart.annualLuckPillars, currentAge);
  }, [chart, currentAge]);

  const currentYear = new Date().getFullYear();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const result = calculateBazi({
        name: form.name.trim() || undefined,
        gender: form.gender,
        birthDate: form.birthDate,
        birthTime: form.birthTime || undefined,
        timeZone: form.timeZone,
      });
      setChart(result);
    } catch (submitError) {
      setChart(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating your chart.",
      );
    }
  }

  async function handleExportPDF() {
    if (!chart || !resultPanelRef.current) return;
    try {
      const fileName = form.name.trim() ? `${form.name.trim()}-bazi.pdf` : "bazi-reading.pdf";
      await exportReadingAsPDF(resultPanelRef.current, fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      setCopySuccess(false);
    }
  }

  function handleShareText() {
    if (!chart) return;
    const text = generateShareableText(chart, form.name.trim() || undefined);
    const success = copyToClipboard(text);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-zh">八字</div>
        <div className="divider" />
        <div className="hero-en">BaZi Reading</div>
        <p>
          Enter birth details to generate your Four Pillars, element balance, hidden stems, and life luck cycles.
        </p>
      </section>

      <section className="workspace-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Birth Profile / 出生资料</h2>
          <label>
            Name / 姓名 (optional)
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Mei Ling"
            />
          </label>

          <label>
            Date of Birth / 生日
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, birthDate: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Time of Birth / 出生时间 (optional)
            <input
              type="time"
              value={form.birthTime}
              onChange={(event) => setForm((prev) => ({ ...prev, birthTime: event.target.value }))}
            />
          </label>

          <label>
            Gender / 性别
            <select
              value={form.gender}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, gender: event.target.value as "Female" | "Male" }))
              }
              required
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </label>

          <label>
            Birth Timezone / 时区
            <select
              value={form.timeZone}
              onChange={(event) => setForm((prev) => ({ ...prev, timeZone: event.target.value }))}
              required
            >
              {TIMEZONE_OPTIONS.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Generate BaZi Reading / 排八字</button>
          {error ? <p className="error-msg">{error}</p> : null}
        </form>

        <section className="panel result-panel" ref={resultPanelRef}>
          <h2>Reading Output</h2>

          {!chart ? (
            <p className="placeholder">
              Submit the form to reveal your BaZi pillars and interpretation.
            </p>
          ) : (
            <>
              <div className="action-bar">
                <button type="button" onClick={handleExportPDF} className="action-btn export-btn">
                  📥 Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleShareText}
                  className={`action-btn share-btn ${copySuccess ? "copied" : ""}`}
                >
                  {copySuccess ? "✓ Copied to Clipboard" : "📋 Copy & Share"}
                </button>
              </div>

              <div className="meta-row">
                <p>
                  <span>Birth Moment:</span> {chart.localBirthDateTime}
                </p>
                <p>
                  <span>Day Master:</span> {chart.dayMaster.pinyin} {chart.dayMaster.chinese} (
                  {chart.dayMaster.element})
                </p>
                {chart.solarTermInfo ? (
                  <p>
                    <span>Solar Term:</span> {chart.solarTermInfo.term} ({chart.solarTermInfo.date})
                  </p>
                ) : null}
              </div>

              <div className="pillar-grid">
                <PillarCard title="Year" pillar={chart.yearPillar} />
                <PillarCard title="Month" pillar={chart.monthPillar} highlight />
                <PillarCard title="Day" pillar={chart.dayPillar} highlight />
                <PillarCard
                  title="Hour"
                  pillar={chart.hourPillar}
                  note={chart.isHourEstimated ? "Not provided" : undefined}
                />
              </div>

              <div className="luck-pillars-section">
                <h3>Major Luck Pillars (Daiyun) – 10-Year Cycles</h3>
                <p className="luck-subtitle">
                  Each decade of life carries specific stem and branch energies that influence life events.
                </p>
                <div className="luck-grid">
                  {chart.luckPillars.slice(0, 8).map((lp) => (
                    <div key={lp.decade} className="luck-card">
                      <div className="luck-decade">Decade {lp.decade}</div>
                      <div className="luck-age">Age {lp.ageStart}–{lp.ageEnd}</div>
                      <div className="luck-glyph">
                        {lp.pillar.stem.chinese}
                        {lp.pillar.branch.chinese}
                      </div>
                      <div className="luck-name">
                        {lp.pillar.stem.pinyin} {lp.pillar.branch.pinyin}
                      </div>
                      <div className="luck-element">{lp.pillar.stem.element}</div>
                      <div className="luck-years">{lp.yearRange}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden-stems-section">
                <h3>Hidden Stems Analysis (Nayin) – Additional Elements</h3>
                <p className="luck-subtitle">
                  Each branch contains hidden stems that add depth and timing nuance to the chart.
                </p>
                <div className="hidden-stems-grid">
                  {chart.hiddenStemAnalysis.map((analysis, idx) => {
                    const pillarNames = ["Year", "Month", "Day", "Hour"];
                    return (
                      <div key={idx} className="hidden-stem-card">
                        <div className="hs-pillar-label">{pillarNames[idx] || "Pillar"}</div>
                        <div className="hs-branch">
                          <span className="hs-glyph">{analysis.pillar.branch.chinese}</span>
                          <span className="hs-name">{analysis.pillar.branch.pinyin}</span>
                        </div>
                        {analysis.hiddenStems.length > 0 ? (
                          <div className="hs-stems">
                            {analysis.hiddenStems.map((stem) => (
                              <div key={stem.stem.key} className="hs-stem-item">
                                <span className="hs-stem-glyph">{stem.stem.chinese}</span>
                                <span className="hs-stem-pinyin">{stem.stem.pinyin}</span>
                                <span className="hs-stem-element">{stem.stem.element}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="hs-stems">
                            <p className="hs-no-stems">Single hidden stem</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="annual-luck-section">
                <h3>Annual Luck Outlook (Xiaoyun)</h3>
                <p className="luck-subtitle">
                  Focused around your current age: n, n-1, n-2, n-3, n+1, n+2, n+3, n+5, n+10.
                </p>
                {currentAge !== null && currentAge < 3 ? (
                  <p className="monthly-note">
                    Annual and monthly luck readings are not shown for current age under 3.
                  </p>
                ) : focusedAnnualPillars.length === 0 ? (
                  <p className="monthly-note">
                    No annual luck entries are available for the selected age window yet.
                  </p>
                ) : (
                  focusedAnnualPillars.map((annual) => (
                    <details
                      key={annual.year}
                      className={`annual-detail ${annual.year === currentYear ? "is-current-year" : ""}`}
                    >
                      <summary className="annual-summary">
                        <span className="annual-year">
                          {annual.yearLabel}
                          {annual.year === currentYear ? (
                            <span className="current-year-badge">Current Year</span>
                          ) : null}
                        </span>
                        <span className="annual-pillar">
                          {annual.pillar.stem.pinyin} {annual.pillar.branch.pinyin} ({annual.pillar.stem.element})
                        </span>
                      </summary>
                      <div className="annual-outlook-grid">
                        {buildAnnualOutlook(chart.dayMaster.element, annual).map((item) => (
                          <div key={item.area} className="annual-outlook-card">
                            <div className="annual-outlook-head">
                              <p className="annual-outlook-area">{item.area}</p>
                              <span className={`outlook-pill ${getOutlookClass(item.label)}`}>
                                {item.label}
                              </span>
                            </div>
                            <p className="annual-outlook-note">{item.note}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))
                )}
              </div>

              <div className="element-chart">
                <h3>Five Elements Balance</h3>
                {elementRows.map((row) => (
                  <div key={row.element} className="element-row">
                    <div className="element-label">
                      <span>{row.element}</span>
                      <strong>{row.count}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${row.percent}%`,
                          backgroundColor: ELEMENT_COLORS[row.element],
                        }}
                      />
                    </div>
                  </div>
                ))}
                <p className="element-summary">
                  Dominant: <strong>{chart.dominantElement}</strong> | Weakest: <strong>{chart.weakElement}</strong>
                </p>
              </div>

              <div className="interpretation">
                <h3>Interpretation</h3>
                <ReadingSections lines={chart.interpretation} />
              </div>

              <div className="note-box">
                {chart.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
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

function calculateCurrentAge(birthDate: string): number | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

  if (!birthdayPassed) {
    age -= 1;
  }

  return Math.max(0, age);
}

function selectFocusedAnnualPillars(
  annualLuckPillars: AnnualLuckPillar[],
  currentAge: number,
): AnnualLuckPillar[] {
  const offsets = [0, -1, -2, -3, 1, 2, 3, 5, 10];
  const seen = new Set<number>();

  return offsets
    .map((offset) => currentAge + offset)
    .filter((age) => age >= 3)
    .filter((age) => {
      if (seen.has(age)) {
        return false;
      }
      seen.add(age);
      return true;
    })
    .map((age) => annualLuckPillars.find((entry) => entry.age === age))
    .filter((entry): entry is AnnualLuckPillar => Boolean(entry))
    .sort((a, b) => a.year - b.year);
}

function buildAnnualOutlook(dayMasterElement: string, annual: AnnualLuckPillar): OutlookItem[] {
  const annualElements = [annual.pillar.stem.element, annual.pillar.branch.element];
  return [
    {
      area: "Career",
      ...evaluateArea(dayMasterElement, annualElements, "career"),
    },
    {
      area: "Finance",
      ...evaluateArea(dayMasterElement, annualElements, "finance"),
    },
    {
      area: "Love",
      ...evaluateArea(dayMasterElement, annualElements, "love"),
    },
    {
      area: "Health",
      ...evaluateArea(dayMasterElement, annualElements, "health"),
    },
  ];
}

function evaluateArea(
  dayMasterElement: string,
  annualElements: string[],
  area: "career" | "finance" | "love" | "health",
): { label: OutlookLabel; note: string } {
  const output = generatedBy(dayMasterElement);
  const resource = produces(dayMasterElement);
  const wealth = controls(dayMasterElement);
  const officer = controlledBy(dayMasterElement);

  let score = 0;
  for (const annualElement of annualElements) {
    if (area === "career") {
      if (annualElement === officer || annualElement === resource) score += 2;
      if (annualElement === output) score -= 1;
    }
    if (area === "finance") {
      if (annualElement === wealth) score += 2;
      if (annualElement === output) score += 1;
      if (annualElement === officer) score -= 1;
    }
    if (area === "love") {
      if (annualElement === dayMasterElement || annualElement === resource) score += 1;
      if (annualElement === officer) score += 1;
      if (annualElement === wealth) score -= 1;
    }
    if (area === "health") {
      if (annualElement === resource || annualElement === dayMasterElement) score += 1;
      if (annualElement === officer) score -= 2;
      if (annualElement === output) score -= 1;
    }
  }

  const label: OutlookLabel = score >= 2 ? "Favorable" : score <= -1 ? "Challenging" : "Neutral";
  const annualSignature = `${annualElements[0]} / ${annualElements[1]}`;
  const areaLabel =
    area === "career"
      ? "career"
      : area === "finance"
        ? "money"
        : area === "love"
          ? "relationships"
          : "health and energy";

  const notePrefix =
    label === "Favorable"
      ? "Supportive flow"
      : label === "Challenging"
        ? "More effort needed"
        : "Mixed signals";

  return {
    label,
    note: `${notePrefix}: ${annualSignature} energy influences ${areaLabel} this year.`,
  };
}

function produces(element: string): string {
  const map: Record<string, string> = {
    Wood: "Water",
    Fire: "Wood",
    Earth: "Fire",
    Metal: "Earth",
    Water: "Metal",
  };
  return map[element] || "Wood";
}

function generatedBy(element: string): string {
  const map: Record<string, string> = {
    Wood: "Fire",
    Fire: "Earth",
    Earth: "Metal",
    Metal: "Water",
    Water: "Wood",
  };
  return map[element] || "Fire";
}

function controls(element: string): string {
  const map: Record<string, string> = {
    Wood: "Earth",
    Fire: "Metal",
    Earth: "Water",
    Metal: "Wood",
    Water: "Fire",
  };
  return map[element] || "Earth";
}

function controlledBy(element: string): string {
  const map: Record<string, string> = {
    Wood: "Metal",
    Fire: "Water",
    Earth: "Wood",
    Metal: "Fire",
    Water: "Earth",
  };
  return map[element] || "Metal";
}

function getOutlookClass(label: OutlookLabel): string {
  if (label === "Favorable") return "is-favorable";
  if (label === "Challenging") return "is-challenging";
  return "is-neutral";
}

function PillarCard({
  title,
  pillar,
  note,
  highlight,
}: {
  title: string;
  pillar?: BaziChart["yearPillar"];
  note?: string;
  highlight?: boolean;
}) {
  return (
    <article className={`pillar-card ${highlight ? "is-highlight" : ""}`}>
      <p className="pillar-title">{title}</p>
      {pillar ? (
        <>
          <p className="glyph">{pillar.stem.chinese}{pillar.branch.chinese}</p>
          <p>{pillar.stem.pinyin} {pillar.branch.pinyin}</p>
          <p>
            {pillar.stem.element}/{pillar.branch.element}
          </p>
          <p>{pillar.branch.animal}</p>
          <div className="pillar-hover-box">
            <p className="hover-title">{title} Pillar</p>
            <p className="hover-body">
              Stem: {pillar.stem.pinyin} ({pillar.stem.element}, {pillar.stem.polarity})
            </p>
            <p className="hover-body">
              Branch: {pillar.branch.pinyin} ({pillar.branch.element}, {pillar.branch.animal})
            </p>
          </div>
        </>
      ) : (
        <p className="missing">{note ?? "Unknown"}</p>
      )}
    </article>
  );
}
