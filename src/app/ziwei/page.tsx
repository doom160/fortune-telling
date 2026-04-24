"use client";

import { FormEvent, useMemo, useState, useRef } from "react";
import { calculateZiWei, ZiWeiChart, ZiWeiPalace } from "@/lib/ziwei";
import {
  copyToClipboard,
  generateZiWeiShareableText,
  exportReadingAsPDF,
} from "@/lib/pdf-export";
import { MethodologyModal } from "@/components/MethodologyModal";

type FormState = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female";
  timeZone: string;
  longitude: string;
  useTrueSolarTime: boolean;
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

const EMPTY_FORM: FormState = {
  name: "",
  birthDate: "",
  birthTime: "12:00",
  gender: "female",
  timeZone: "Asia/Kuala_Lumpur",
  longitude: "",
  useTrueSolarTime: true,
};

export default function ZiWeiPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [chart, setChart] = useState<ZiWeiChart | null>(null);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const resultPanelRef = useRef<HTMLElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const result = calculateZiWei({
        name: form.name.trim() || undefined,
        birthDate: form.birthDate,
        birthTime: form.birthTime,
        gender: form.gender,
        timeZone: form.timeZone,
        longitude: form.longitude.trim() ? Number(form.longitude) : undefined,
        useTrueSolarTime: form.useTrueSolarTime,
      });
      setChart(result);
    } catch (submitError) {
      setChart(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating your Zi Wei Dou Shu chart.",
      );
    }
  }

  async function handleExportPDF() {
    if (!chart || !resultPanelRef.current) return;
    try {
      const fileName = form.name.trim() ? `${form.name.trim()}-ziwei.pdf` : "ziwei-reading.pdf";
      await exportReadingAsPDF(resultPanelRef.current, fileName);
    } catch (err) {
      console.error("Zi Wei PDF export failed:", err);
      setCopySuccess(false);
    }
  }

  function handleShareText() {
    if (!chart) return;
    const text = generateZiWeiShareableText(chart, form.name.trim() || undefined);
    const success = copyToClipboard(text);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-zh">紫微斗數</div>
        <div className="divider" />
        <div className="hero-en">Zi Wei Dou Shu</div>
        <p>
          Generate a 12-palace chart from your birth moment and review a guided
          interpretation of life palace, career, wealth, relationships, and inner wellbeing.
        </p>
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
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
              onChange={(event) => setForm((prev) => ({ ...prev, birthDate: event.target.value }))}
              required
            />
          </label>

          <label>
            Time of Birth / 出生时间
            <input
              type="time"
              value={form.birthTime}
              onChange={(event) => setForm((prev) => ({ ...prev, birthTime: event.target.value }))}
              required
            />
          </label>

          <label>
            Gender / 性别
            <select
              value={form.gender}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, gender: event.target.value as "male" | "female" }))
              }
              required
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
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

          <label>
            Longitude / 经度 (optional)
            <input
              type="number"
              step="0.01"
              value={form.longitude}
              onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))}
              placeholder="e.g. 101.69"
            />
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={form.useTrueSolarTime}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, useTrueSolarTime: event.target.checked }))
              }
            />
            Use true solar time correction / 真太阳时校正
          </label>

          <button type="submit">Generate Zi Wei Chart / 排命盘</button>
          {error ? <p className="error-msg">{error}</p> : null}
        </form>

        <section className="panel result-panel" ref={resultPanelRef}>
          <h2>Chart Reading</h2>

          {!chart ? (
            <p className="placeholder">
              Submit the form to generate your Zi Wei Dou Shu chart and interpretation.
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

              <div className="ziwei-meta-grid">
                <InfoTile label="Solar Date" value={chart.solarDateByTrue || chart.solarDate} />
                <InfoTile label="Lunisolar Date" value={chart.lunisolarDate} />
                <InfoTile label="Year Pillar" value={`${chart.birthYearStem}${chart.birthYearBranch}`} />
                <InfoTile label="Zodiac" value={chart.zodiac} />
                <InfoTile label="Hour" value={`${chart.hour} · ${chart.hourRange}`} />
                <InfoTile label="Five Element Bureau" value={chart.fiveElementName} />
                <InfoTile label="Zi Wei Position" value={chart.ziweiBranch} />
                <InfoTile
                  label="Luck Flow"
                  value={chart.horoscopeDirection === 1 ? "Forward" : "Reverse"}
                />
              </div>

              <div className="ziwei-interpretation">
                <h3>Interpretation</h3>
                <ReadingSections lines={chart.interpretation} />
              </div>

              <div className="ziwei-palace-section">
                <h3>Twelve Palaces</h3>
                <TraditionalPalaceGrid palaces={chart.palaces} />
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

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How Zi Wei Dou Shu Works / 紫微斗數計算原理">
        <h3>Overview</h3>
        <p>
          Zi Wei Dou Shu (紫微斗數), or Purple Star Astrology, is one of China&apos;s most revered astrological systems.
          It constructs a 12-palace chart based on your birth date and time, mapping over 100 stars into different
          life domains to reveal your destiny patterns.
        </p>

        <h3>The Twelve Palaces / 十二宮</h3>
        <p>
          The chart is arranged into 12 palaces, each governing a specific life domain:
        </p>
        <ul>
          <li><strong>命宮 (Life Palace):</strong> Core personality, character, and overall destiny</li>
          <li><strong>兄弟宮 (Siblings):</strong> Relationships with siblings and peers</li>
          <li><strong>夫妻宮 (Spouse):</strong> Marriage, partnerships, romantic relationships</li>
          <li><strong>子女宮 (Children):</strong> Relationship with children, fertility</li>
          <li><strong>財帛宮 (Wealth):</strong> Financial capacity and earning patterns</li>
          <li><strong>疾厄宮 (Health):</strong> Physical constitution and health risks</li>
          <li><strong>遷移宮 (Travel):</strong> Opportunities abroad, social image outside home</li>
          <li><strong>交友宮 (Friends):</strong> Social connections, subordinates</li>
          <li><strong>官祿宮 (Career):</strong> Professional path and achievements</li>
          <li><strong>田宅宮 (Property):</strong> Real estate, living environment, family heritage</li>
          <li><strong>福德宮 (Fortune):</strong> Mental wellbeing, spiritual life, inner happiness</li>
          <li><strong>父母宮 (Parents):</strong> Relationship with parents, upbringing</li>
        </ul>

        <h3>Star Placement / 安星法</h3>
        <h4>Step 1: Determine the Life Palace Position</h4>
        <p>
          Using the lunar birth month and the Chinese double-hour (時辰) of birth, the Life Palace position is
          calculated. All other palaces are then arranged sequentially counter-clockwise around the 12 positions.
        </p>
        <h4>Step 2: Calculate the Five Elements Bureau / 五行局</h4>
        <p>
          The combination of the Life Palace position and the Heavenly Stem of your birth year determines your
          Five Elements Bureau (水二局, 木三局, 金四局, 土五局, or 火六局). This number is critical for placing
          the Purple Star (紫微星).
        </p>
        <h4>Step 3: Place the Major Stars</h4>
        <p>
          The Purple Star (紫微) is placed based on your lunar birth day and Five Elements Bureau number.
          The other 13 main stars are then positioned relative to Purple Star or independently using set formulas.
          Major stars include:
        </p>
        <ul>
          <li><strong>紫微星群:</strong> 紫微, 天機, 太陽, 武曲, 天同, 廉貞</li>
          <li><strong>天府星群:</strong> 天府, 太陰, 貪狼, 巨門, 天相, 天梁, 七殺, 破軍</li>
        </ul>

        <h4>Step 4: Place Minor &amp; Auxiliary Stars</h4>
        <p>
          Over 30 minor stars (including 文昌, 文曲, 左輔, 右弼, 天魁, 天鉞, 擎羊, 陀羅, 火星, 鈴星)
          are placed using various formulas based on year stem, year branch, birth month, and birth hour.
        </p>

        <h3>Star Brightness / 星曜亮度</h3>
        <p>
          Each major star has varying brightness levels depending on which palace it occupies: 廟 (Temple/Brightest),
          旺 (Prosperous), 得地 (Favorable), 利 (Beneficial), 平 (Neutral), 不得地 (Unfavorable), 落陷 (Fallen/Weakest).
          Brightness determines how effectively a star expresses its energy.
        </p>

        <h3>Four Transformations / 四化</h3>
        <p>
          Based on the year Heavenly Stem, four special transformations are applied to four specific stars:
        </p>
        <ul>
          <li><strong>化祿 (Hua Lu):</strong> Enhancement of wealth and opportunity</li>
          <li><strong>化權 (Hua Quan):</strong> Enhancement of authority and power</li>
          <li><strong>化科 (Hua Ke):</strong> Enhancement of fame and scholarly recognition</li>
          <li><strong>化忌 (Hua Ji):</strong> Obstruction, challenges, karmic lessons</li>
        </ul>
        <p>
          The palace containing 化忌 often indicates an area of life requiring extra attention and growth.
        </p>

        <div className="note-box">
          <strong>Note:</strong> This application converts your solar (Gregorian) birth date to the Chinese
          lunar calendar for all calculations, and supports True Solar Time adjustment for more precise
          hour pillar determination when longitude is provided.
        </div>
      </MethodologyModal>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="ziwei-info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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

/*
 * Traditional Zi Wei grid: 12 palaces arranged as a 4×4 border
 * (the 4 center cells are empty). The branch order maps to positions:
 *
 *   辰(4) 巳(5) 午(6) 未(7)
 *   卯(3)               申(8)
 *   寅(2)               酉(9)
 *   丑(1) 子(0) 亥(11) 戌(10)
 */
const BRANCH_ORDER = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const GRID_POSITIONS: Array<{ row: number; col: number; branchIdx: number }> = [
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

function TraditionalPalaceGrid({ palaces }: { palaces: ZiWeiPalace[] }) {
  const palaceByBranch = useMemo(() => {
    const map = new Map<string, ZiWeiPalace>();
    for (const p of palaces) {
      map.set(p.branch, p);
    }
    return map;
  }, [palaces]);

  return (
    <div className="ziwei-traditional-grid">
      {GRID_POSITIONS.map((pos) => {
        const branch = BRANCH_ORDER[pos.branchIdx];
        const palace = palaceByBranch.get(branch);
        return (
          <article
            key={branch}
            className="ziwei-palace-card"
            style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
          >
            {palace ? (
              <>
                <div className="ziwei-palace-head">
                  <div>
                    <p className="ziwei-palace-name">{palace.name}</p>
                    <p className="ziwei-palace-branch">{palace.stem}{palace.branch}</p>
                  </div>
                  {palace.isLaiYin ? <span className="ziwei-badge">Lai Yin</span> : null}
                </div>
                <p className="ziwei-palace-range">Ages {palace.horoscopeRanges[0]}-{palace.horoscopeRanges[1]}</p>
                <div className="ziwei-stars-block">
                  <p className="ziwei-stars-label">Major Stars</p>
                  <p className="ziwei-stars-text">
                    {palace.majorStars.length > 0
                      ? palace.majorStars.map((star) => star.name).join(" · ")
                      : "None listed"}
                  </p>
                </div>
                <div className="ziwei-stars-block">
                  <p className="ziwei-stars-label">Minor Stars</p>
                  <p className="ziwei-stars-text ziwei-stars-secondary">
                    {palace.minorStars.length > 0
                      ? palace.minorStars.map((star) => star.name).join(" · ")
                      : "None listed"}
                  </p>
                </div>
              </>
            ) : (
              <div className="ziwei-palace-head">
                <p className="ziwei-palace-branch">{branch}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
