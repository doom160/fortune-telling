"use client";

import { useState, useRef } from "react";
import { Stars } from "@/components/Stars";
import { PerSystemCard } from "@/components/oracle/PerSystemCard";
import { ThemeOverlapPanel } from "@/components/oracle/ThemeOverlapPanel";
import { SynthesisedSummary } from "@/components/oracle/SynthesisedSummary";
import { LuckTimelineTable, type LuckTimelineRowData } from "@/components/oracle/LuckTimelineTable";

import { calculateBazi, type BaziChart } from "@/lib/bazi";
import { calculateNumerology, type NumerologyChart } from "@/lib/numerology";
import { calculateZiWei, type ZiWeiChart } from "@/lib/ziwei";
import { calculateZodiacReading, getAnimalFromDate, type ZodiacReading } from "@/lib/zodiac";
import { calculateNatalChart, calculateTransitsForDate, type NatalChart } from "@/lib/astrology";
import { searchCities, type City } from "@/lib/cities";

import {
  extractBaziLifeSignals,
  extractNumerologyLifeSignals,
  extractZiweiSignals,
  extractZodiacLifeSignals,
  extractAstrologyLifeSignals,
  synthesiseGroup,
  synthesiseLuckYear,
  getLuckTimelineYears,
  getBaziAnnualEntry,
  calculatePersonalYearForYear,
  getYearAnimal,
  getYearRelationshipPolarity,
  type GroupSynthesisResult,
} from "@/lib/synthesis";

type SystemResult<T> =
  | { status: "idle" }
  | { status: "ok"; data: T }
  | { status: "error"; message: string }
  | { status: "skipped"; reason: string };

type ForecastState = {
  bazi: SystemResult<BaziChart>;
  numerology: SystemResult<NumerologyChart>;
  ziwei: SystemResult<ZiWeiChart>;
  zodiac: SystemResult<ZodiacReading>;
  astrology: SystemResult<NatalChart>;
  lifeProfileSynthesis: GroupSynthesisResult | null;
  luckTimeline: LuckTimelineRowData[] | null;
  isRunning: boolean;
};

const INITIAL: ForecastState = {
  bazi: { status: "idle" },
  numerology: { status: "idle" },
  ziwei: { status: "idle" },
  zodiac: { status: "idle" },
  astrology: { status: "idle" },
  lifeProfileSynthesis: null,
  luckTimeline: null,
  isRunning: false,
};

export function LifeForecastClient() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [cityQuery, setCityQuery] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [state, setState] = useState<ForecastState>(INITIAL);
  const suggestionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCityInput(value: string) {
    setCityQuery(value);
    setCity(null);
    if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
    suggestionTimeout.current = setTimeout(async () => {
      const results = await searchCities(value);
      setSuggestions(results);
    }, 200);
  }

  function handleCitySelect(c: City) {
    setCity(c);
    setCityQuery(`${c.name}, ${c.country}`);
    setSuggestions([]);
  }

  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const effectiveTz = city?.tz ?? browserTz;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate || !gender) return;

    setState({ ...INITIAL, isRunning: true });

    const hasTime = !!birthTime;
    const hasLocation = !!city;
    const timeForCalc = birthTime || "12:00";

    let baziResult: SystemResult<BaziChart>;
    let numerologyResult: SystemResult<NumerologyChart>;
    let ziweiResult: SystemResult<ZiWeiChart>;
    let zodiacResult: SystemResult<ZodiacReading>;
    let astrologyResult: SystemResult<NatalChart>;

    try {
      const chart = calculateBazi({
        gender,
        birthDate,
        birthTime: hasTime ? birthTime : undefined,
        timeZone: effectiveTz,
      });
      baziResult = { status: "ok", data: chart };
    } catch (err) {
      baziResult = { status: "error", message: err instanceof Error ? err.message : "BaZi calculation failed." };
    }

    try {
      const chart = calculateNumerology({ birthDate, gender });
      numerologyResult = { status: "ok", data: chart };
    } catch (err) {
      numerologyResult = { status: "error", message: err instanceof Error ? err.message : "Numerology calculation failed." };
    }

    try {
      const chart = calculateZiWei({
        gender,
        birthDate,
        birthTime: timeForCalc,
        timeZone: effectiveTz,
        longitude: city?.lng,
        useTrueSolarTime: !!city,
      });
      ziweiResult = { status: "ok", data: chart };
    } catch (err) {
      ziweiResult = { status: "error", message: err instanceof Error ? err.message : "Zi Wei calculation failed." };
    }

    try {
      const reading = calculateZodiacReading(birthDate);
      zodiacResult = { status: "ok", data: reading };
    } catch (err) {
      zodiacResult = { status: "error", message: err instanceof Error ? err.message : "Zodiac calculation failed." };
    }

    if (!hasLocation) {
      astrologyResult = { status: "skipped", reason: "Birth location is required for Astrology house placements and transits." };
    } else {
      try {
        const chart = calculateNatalChart({
          birthDate,
          birthTime: hasTime ? birthTime : undefined,
          lat: city!.lat,
          lng: city!.lng,
          timeZone: city!.tz,
        });
        astrologyResult = { status: "ok", data: chart };
      } catch (err) {
        astrologyResult = { status: "error", message: err instanceof Error ? err.message : "Astrology calculation failed." };
      }
    }

    // ─── Life Profile synthesis ───────────────────────────────────────────────
    const systemSignals: Record<string, ReturnType<typeof extractBaziLifeSignals>> = {};
    if (baziResult.status === "ok") systemSignals.bazi = extractBaziLifeSignals(baziResult.data);
    if (numerologyResult.status === "ok") systemSignals.numerology = extractNumerologyLifeSignals(numerologyResult.data);
    if (ziweiResult.status === "ok") systemSignals.ziwei = extractZiweiSignals(ziweiResult.data);
    if (zodiacResult.status === "ok") {
      systemSignals.zodiac = extractZodiacLifeSignals(zodiacResult.data);
    }
    if (astrologyResult.status === "ok") systemSignals.astrology = extractAstrologyLifeSignals(astrologyResult.data);

    const lifeGroupSize = Object.keys(systemSignals).length;
    const lifeProfileSynthesis = lifeGroupSize >= 2 ? synthesiseGroup(systemSignals, 5) : null;

    // ─── Luck Timeline ────────────────────────────────────────────────────────
    let luckTimeline: LuckTimelineRowData[] | null = null;
    const currentYear = new Date().getFullYear();
    const targetYears = getLuckTimelineYears(currentYear);

    if (baziResult.status === "ok" || numerologyResult.status === "ok" || zodiacResult.status === "ok") {
      const birthAnimalIndex = getAnimalFromDate(birthDate).animal.index;
      luckTimeline = targetYears.map((year) => {
        const baziEntry = baziResult.status === "ok" ? getBaziAnnualEntry(baziResult.data, year) : null;
        const personalYearNum = calculatePersonalYearForYear(birthDate, year);
        const yearAnimal = getYearAnimal(year);
        const zodiacPolarity = getYearRelationshipPolarity(birthAnimalIndex, yearAnimal.index);

        let astrologyTransits = null;
        if (astrologyResult.status === "ok") {
          try {
            astrologyTransits = calculateTransitsForDate(astrologyResult.data, new Date(year, 6, 1));
          } catch {
            // transits unavailable for this year — continue without them
          }
        }

        const synthesis = synthesiseLuckYear(
          year,
          baziEntry,
          personalYearNum,
          zodiacPolarity,
          astrologyTransits,
        );

        return {
          synthesis,
          baziPillar: baziEntry?.pillar ?? null,
          personalYearNum,
          yearAnimal,
          zodiacPolarity,
        };
      });
    }

    setState({
      bazi: baziResult,
      numerology: numerologyResult,
      ziwei: ziweiResult,
      zodiac: zodiacResult,
      astrology: astrologyResult,
      lifeProfileSynthesis,
      luckTimeline,
      isRunning: false,
    });
  }

  const hasResults = state.bazi.status !== "idle";

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <Stars />
        <div className="hero-zh">生命預測</div>
        <div className="divider" />
        <div className="hero-en">Life Forecast Oracle</div>
        <p>
          Enter your birth details to receive a whole-life profile and a year-by-year luck timeline
          synthesised across BaZi, Numerology, Zi Wei, Zodiac, and Astrology.
        </p>
      </section>

      <section className="workspace-grid">
        <form onSubmit={handleSubmit} className="oracle-birth-form">
          <div className="oracle-birth-form__row">
            <label htmlFor="birth-date" className="oracle-birth-form__label">
              Birth Date <span className="required">*</span>
            </label>
            <input
              id="birth-date"
              type="date"
              className="oracle-birth-form__input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              disabled={state.isRunning}
            />
          </div>

          <div className="oracle-birth-form__row">
            <label htmlFor="birth-time" className="oracle-birth-form__label">
              Birth Time
              <span className="oracle-birth-form__hint">Required for full BaZi, Zi Wei, and Astrology accuracy</span>
            </label>
            <input
              id="birth-time"
              type="time"
              className="oracle-birth-form__input"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={state.isRunning}
            />
          </div>

          <div className="oracle-birth-form__row">
            <label htmlFor="gender" className="oracle-birth-form__label">
              Gender <span className="required">*</span>
            </label>
            <select
              id="gender"
              className="oracle-birth-form__select"
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              required
              disabled={state.isRunning}
            >
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="oracle-birth-form__row oracle-birth-form__row--location">
            <label htmlFor="city-search" className="oracle-birth-form__label">
              Birth Location
              <span className="oracle-birth-form__hint">Required for Astrology house placements</span>
            </label>
            <div className="city-autocomplete">
              <input
                id="city-search"
                type="text"
                className="oracle-birth-form__input"
                placeholder="Search city…"
                value={cityQuery}
                onChange={(e) => handleCityInput(e.target.value)}
                autoComplete="off"
                disabled={state.isRunning}
              />
              {suggestions.length > 0 && (
                <ul className="city-autocomplete__list">
                  {suggestions.map((c, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="city-autocomplete__item"
                        onClick={() => handleCitySelect(c)}
                      >
                        {c.name}, {c.country}
                        <span className="city-autocomplete__tz">{c.tz}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="oracle-birth-form__submit btn-primary"
            disabled={!birthDate || !gender || state.isRunning}
          >
            {state.isRunning ? "Calculating…" : "Generate Forecast"}
          </button>
        </form>
      </section>

      {hasResults && (
        <>
          {/* ── Life Profile ─────────────────────────────────────────────── */}
          <section className="oracle-life-profile">
            <h2 className="oracle-section-title">Life Profile</h2>
            <div className="oracle-systems-grid oracle-systems-grid--forecast">
              <BaziCard result={state.bazi} hasTime={!!birthTime} />
              <NumerologyCard result={state.numerology} />
              <ZiweiCard result={state.ziwei} hasTime={!!birthTime} />
              <ZodiacCard result={state.zodiac} />
              <AstrologyCard result={state.astrology} hasTime={!!birthTime} />
            </div>

            {state.lifeProfileSynthesis && (
              <div className="oracle-synthesis-section">
                <ThemeOverlapPanel themes={state.lifeProfileSynthesis.themes} />
                <SynthesisedSummary summary={state.lifeProfileSynthesis.summary} />
              </div>
            )}
          </section>

          {/* ── Luck Timeline ─────────────────────────────────────────────── */}
          {state.luckTimeline && state.luckTimeline.length > 0 && (
            <section className="oracle-luck-timeline">
              <h2 className="oracle-section-title">Luck Timeline</h2>
              <LuckTimelineTable
                rows={state.luckTimeline}
                currentYear={new Date().getFullYear()}
              />
            </section>
          )}
        </>
      )}
    </main>
  );
}

// ─── Per-system card sub-components ─────────────────────────────────────────

function BaziCard({
  result,
  hasTime,
}: {
  result: SystemResult<BaziChart>;
  hasTime: boolean;
}) {
  const notice = !hasTime ? "Birth time not provided — hour pillar and some accuracy may be reduced." : undefined;
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="bazi" nameZh="八字" nameEn="BaZi" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  if (result.status !== "ok") return null;
  const chart = result.data;
  return (
    <PerSystemCard systemId="bazi" nameZh="八字" nameEn="BaZi" tradition="Chinese" notice={notice}>
      <div className="bazi-chart-summary">
        <div className="bazi-chart-summary__pillars">
          <PillarBadge label="Year" pillar={chart.yearPillar} />
          <PillarBadge label="Month" pillar={chart.monthPillar} />
          <PillarBadge label="Day" pillar={chart.dayPillar} />
          {chart.hourPillar && <PillarBadge label="Hour" pillar={chart.hourPillar} />}
        </div>
        <p className="bazi-chart-summary__day-master">
          Day Master: {chart.dayMaster.chinese} {chart.dayMaster.pinyin} — {chart.dayMaster.element} {chart.dayMaster.polarity}
        </p>
        {chart.interpretation.slice(0, 2).map((line, idx) => (
          <p key={idx} className="bazi-chart-summary__interp">{line}</p>
        ))}
      </div>
    </PerSystemCard>
  );
}

function PillarBadge({ label, pillar }: { label: string; pillar: { stem: { chinese: string; pinyin: string }; branch: { chinese: string; animal: string } } }) {
  return (
    <div className="pillar-badge">
      <span className="pillar-badge__label">{label}</span>
      <span className="pillar-badge__zh">{pillar.stem.chinese}{pillar.branch.chinese}</span>
      <span className="pillar-badge__en">{pillar.stem.pinyin} {pillar.branch.animal}</span>
    </div>
  );
}

function NumerologyCard({ result }: { result: SystemResult<NumerologyChart> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="numerology" nameZh="數字學" nameEn="Numerology" tradition="East-West" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  if (result.status !== "ok") return null;
  const chart = result.data;
  return (
    <PerSystemCard systemId="numerology" nameZh="數字學" nameEn="Numerology" tradition="East-West">
      <div className="numerology-summary">
        <div className="numerology-summary__numbers">
          <span className="numerology-summary__num">
            <strong>Life Path</strong> {chart.lifePathNumber}
          </span>
          {chart.expressionNumber != null && (
            <span className="numerology-summary__num">
              <strong>Expression</strong> {chart.expressionNumber}
            </span>
          )}
          {chart.soulUrgeNumber != null && (
            <span className="numerology-summary__num">
              <strong>Soul Urge</strong> {chart.soulUrgeNumber}
            </span>
          )}
        </div>
        {chart.interpretation.length > 0 && (
          <p className="numerology-summary__interp">{chart.interpretation.join(" ")}</p>
        )}
      </div>
    </PerSystemCard>
  );
}

function ZiweiCard({ result, hasTime }: { result: SystemResult<ZiWeiChart>; hasTime: boolean }) {
  const notice = !hasTime
    ? "Birth time not provided — Zi Wei chart uses a noon default and may be less accurate."
    : undefined;
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="ziwei" nameZh="紫微斗數" nameEn="Zi Wei Dou Shu" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  if (result.status !== "ok") return null;
  const chart = result.data;
  return (
    <PerSystemCard
      systemId="ziwei"
      nameZh="紫微斗數"
      nameEn="Zi Wei Dou Shu"
      tradition="Chinese"
      notice={notice ?? "Life Profile only — not included in year-by-year forecast."}
    >
      <div className="ziwei-summary">
        <p className="ziwei-summary__meta">
          {chart.fiveElementName} · {chart.zodiac} · Hour: {chart.hour} ({chart.hourRange})
        </p>
        {chart.interpretation.slice(0, 3).map((line, i) => (
          <p key={i} className="ziwei-summary__interp">{line}</p>
        ))}
      </div>
    </PerSystemCard>
  );
}

function ZodiacCard({ result }: { result: SystemResult<ZodiacReading> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="zodiac" nameZh="生肖" nameEn="Chinese Zodiac" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  if (result.status !== "ok") return null;
  const reading = result.data;
  return (
    <PerSystemCard systemId="zodiac" nameZh="生肖" nameEn="Chinese Zodiac" tradition="Chinese">
      <div className="zodiac-summary">
        <div className="zodiac-summary__animal">
          <span className="zodiac-summary__emoji">{reading.animal.emoji}</span>
          <span className="zodiac-summary__name">{reading.animal.chinese} {reading.animal.english}</span>
          <span className="zodiac-summary__element">{reading.animal.element} · {reading.animal.polarity}</span>
        </div>
        <p className="zodiac-summary__traits">{reading.animal.traits}</p>
        {reading.interpretation.slice(0, 2).map((line, i) => (
          <p key={i} className="zodiac-summary__interp">{line}</p>
        ))}
      </div>
    </PerSystemCard>
  );
}

function AstrologyCard({
  result,
  hasTime,
}: {
  result: SystemResult<NatalChart>;
  hasTime: boolean;
}) {
  const timeNotice = !hasTime
    ? "Birth time not provided — houses and Ascendant are approximated."
    : undefined;

  if (result.status === "idle") return null;

  if (result.status === "skipped") {
    return (
      <PerSystemCard
        systemId="astrology"
        nameZh="西洋占星"
        nameEn="Astrology"
        tradition="Western"
        notice={result.reason}
      >
        <p className="system-skipped">{result.reason}</p>
      </PerSystemCard>
    );
  }

  if (result.status === "error") {
    return (
      <PerSystemCard systemId="astrology" nameZh="西洋占星" nameEn="Astrology" tradition="Western" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }

  const chart = result.data;
  const sun = chart.planets.find((p) => p.planet === "Sun");
  const moon = chart.planets.find((p) => p.planet === "Moon");

  return (
    <PerSystemCard
      systemId="astrology"
      nameZh="西洋占星"
      nameEn="Astrology"
      tradition="Western"
      notice={timeNotice}
    >
      <div className="astrology-summary">
        <div className="astrology-summary__big-three">
          {sun && <span><strong>☉</strong> {sun.sign}</span>}
          {moon && <span><strong>☽</strong> {moon.sign}</span>}
          {chart.ascendant != null && (
            <span><strong>ASC</strong> {SIGNS[Math.floor(chart.ascendant / 30) % 12]}</span>
          )}
        </div>
        <p className="astrology-summary__interp">{chart.interpretation}</p>
      </div>
    </PerSystemCard>
  );
}

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
