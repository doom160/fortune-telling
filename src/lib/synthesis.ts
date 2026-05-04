import type { GuanyinLot } from "@/lib/guanyin";
import type { IChingReading } from "@/lib/iching";
import { HEXAGRAM_DOMAIN_MAP } from "@/lib/iching";
import type { RuneReading } from "@/lib/rune";
import type { QmdjChart, QmdjFocus } from "@/lib/qmdj";
import type { TarotReading } from "@/lib/tarot";
import type { BaziChart, AnnualLuckPillar } from "@/lib/bazi";
import type { NumerologyChart } from "@/lib/numerology";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { ZodiacReading } from "@/lib/zodiac";
import type { NatalChart, TransitAspect } from "@/lib/astrology";
import { getAnimalByIndex, ANIMALS } from "@/lib/zodiac";

// ─── System IDs ──────────────────────────────────────────────────────────────

export type LifeDirectionsSystemId = "guanyin" | "qmdj" | "tarot" | "iching" | "rune";
export type LifeForecastSystemId = "bazi" | "numerology" | "ziwei" | "zodiac" | "astrology";

// ─── Signal Types ────────────────────────────────────────────────────────────

export type SignalClass = "polarity" | "domain" | "keyword";
export type PolarityValue = "auspicious" | "mixed" | "caution";

export type NormalisedSignal = {
  class: SignalClass;
  tag: string;
  system: string;
};

// ─── Theme & Results ─────────────────────────────────────────────────────────

export type Theme = {
  class: SignalClass;
  tag: string;
  systems: string[];
  confidenceScore: number;
};

export type GroupSynthesisResult = {
  themes: Theme[];
  summary: string;
};

export type YearSynthesis = {
  year: number;
  themes: Theme[];
  summary: string;
  overallPolarity: PolarityValue;
  groupSize: number;
};

export type LuckTimeline = YearSynthesis[];

// ─── Luck Timeline Constants ─────────────────────────────────────────────────

export const LUCK_TIMELINE_OFFSETS = [-3, -2, -1, 0, 1, 2, 3, 5, 10] as const;

export function getLuckTimelineYears(currentYear: number): number[] {
  return LUCK_TIMELINE_OFFSETS.map((offset) => currentYear + offset);
}

// ─── Year-Parameterized Helpers ──────────────────────────────────────────────

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((acc, d) => acc + parseInt(d, 10), 0);
}

function reduceToSingleDigit(n: number): number {
  while (n > 9) n = sumDigits(n);
  return n;
}

export function calculatePersonalYearForYear(birthDate: string, year: number): number {
  const [, monthStr, dayStr] = birthDate.split("-");
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const total = sumDigits(month) + sumDigits(day) + sumDigits(year);
  return reduceToSingleDigit(total);
}

export function getYearAnimal(year: number) {
  const idx = ((year - 4) % 12 + 12) % 12;
  return getAnimalByIndex(idx);
}

export function getYearRelationshipPolarity(
  birthAnimalIndex: number,
  yearAnimalIndex: number
): PolarityValue {
  const birthAnimal = ANIMALS[birthAnimalIndex];
  const yearAnimal = ANIMALS[yearAnimalIndex];
  if (!birthAnimal || !yearAnimal) return "mixed";
  if (birthAnimal.compatible.includes(yearAnimal.english)) return "auspicious";
  if (birthAnimal.incompatible.includes(yearAnimal.english)) return "caution";
  return "mixed";
}

export function getBaziAnnualEntry(
  chart: BaziChart,
  year: number
): AnnualLuckPillar | null {
  return chart.annualLuckPillars.find((e) => e.year === year) ?? null;
}

// ─── Signal Extraction Helpers ───────────────────────────────────────────────

function sig(system: string, cls: SignalClass, tag: string): NormalisedSignal {
  return { class: cls, tag, system };
}

const DOMAIN_MAP: Record<string, string> = {
  career: "career",
  wealth: "wealth",
  relationship: "relationship",
  health: "health",
  love: "relationship",
  finance: "wealth",
  travel: "timing",
  legal: "career",
  general: "mixed",
};

const ELEMENT_DOMAIN: Record<string, string> = {
  Wood: "career",
  Fire: "career",
  Earth: "wealth",
  Metal: "career",
  Water: "relationship",
};

// Auspicious major Zi Wei stars
const AUSPICIOUS_STARS = new Set([
  "ZI_WEI", "TAI_YANG", "TIAN_TONG", "TIAN_FU", "TAI_YIN", "TIAN_XIANG", "TIAN_LIANG",
]);
// Inauspicious major Zi Wei stars
const INAUSPICIOUS_STARS = new Set(["QI_SHA", "PO_JUN", "JU_MEN", "LIAN_ZHEN"]);

// Palace key → domain tag
const PALACE_DOMAIN: Record<string, string> = {
  GUAN_LU: "career",
  CAI_BO: "wealth",
  FU_QI: "relationship",
  JI_E: "health",
};

// Western sign → element keyword
const SIGN_ELEMENT: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

// Life path number → primary domain
const LP_DOMAIN: Record<number, string> = {
  1: "career", 2: "relationship", 3: "career", 4: "career",
  5: "timing", 6: "relationship", 7: "health", 8: "wealth", 9: "relationship",
};

// Personal year polarity
const PY_POLARITY: Record<number, PolarityValue> = {
  1: "auspicious", 2: "mixed", 3: "auspicious", 4: "mixed",
  5: "mixed", 6: "mixed", 7: "mixed", 8: "auspicious", 9: "mixed",
};

// ─── Signal Extractors ───────────────────────────────────────────────────────

export function extractGuanyinSignals(result: GuanyinLot): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "guanyin";

  // Polarity from outcome
  const polarity: PolarityValue =
    result.outcome === "Auspicious" ? "auspicious"
    : result.outcome === "Caution" ? "caution"
    : "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Domain tags from the presence of domain fields
  for (const domain of ["career", "health", "relationship"] as const) {
    if (domain === "relationship") {
      if (result.love) signals.push(sig(system, "domain", "relationship"));
    } else if (domain === "career") {
      if (result.career) signals.push(sig(system, "domain", "career"));
    } else {
      if (result.health) signals.push(sig(system, "domain", "health"));
    }
  }
  if (result.finance) signals.push(sig(system, "domain", "wealth"));

  return signals;
}

export function extractQmdjSignals(chart: QmdjChart, focus?: QmdjFocus): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "qmdj";

  // Polarity: aggregate formation natures
  const auspicious = chart.formations.filter((f) => f.type === "auspicious").length;
  const inauspicious = chart.formations.filter((f) => f.type === "inauspicious").length;
  const polarity: PolarityValue =
    chart.formations.length === 0 ? "mixed"
    : auspicious > inauspicious ? "auspicious"
    : inauspicious > auspicious ? "caution"
    : "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Domain from focus
  if (focus && focus !== "general") {
    const domain = DOMAIN_MAP[focus] ?? focus;
    signals.push(sig(system, "domain", domain));
  }

  // Keywords from formation names
  for (const formation of chart.formations.slice(0, 3)) {
    signals.push(sig(system, "keyword", formation.name.toLowerCase().replace(/\s+/g, "-")));
  }

  return signals;
}

export function extractTarotSignals(result: TarotReading): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "tarot";

  // Polarity: reversed-card ratio
  const reversedCount = result.cards.filter((c) => c.orientation === "Reversed").length;
  const total = result.cards.length || 1;
  const ratio = reversedCount / total;
  const polarity: PolarityValue = ratio >= 0.67 ? "caution" : ratio >= 0.34 ? "mixed" : "auspicious";
  signals.push(sig(system, "polarity", polarity));

  // Domain from card positions
  const POSITION_DOMAIN: Record<string, string> = {
    Past: "timing", Present: "timing", Future: "timing",
    Advice: "health", Outcome: "career",
  };
  for (const card of result.cards) {
    const pos = String(card.position);
    const domain = POSITION_DOMAIN[pos];
    if (domain) signals.push(sig(system, "domain", domain));
  }

  // Keywords from card keywords (active orientation)
  for (const card of result.cards) {
    const keywords =
      card.orientation === "Upright" ? card.card.upright.keywords : card.card.reversed.keywords;
    for (const kw of keywords.slice(0, 2)) {
      signals.push(sig(system, "keyword", kw.toLowerCase()));
    }
  }

  return signals;
}

export function extractBaziLifeSignals(result: BaziChart): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "bazi";

  // Keyword: dominant element
  signals.push(sig(system, "keyword", result.dominantElement.toLowerCase()));

  // Domain: from dominant element affinity
  const domain = ELEMENT_DOMAIN[result.dominantElement];
  if (domain) signals.push(sig(system, "domain", domain));

  // Polarity: Yang vs Yin polarity balance across pillars
  const yangCount = result.polarityCounts.Yang ?? 0;
  const yinCount = result.polarityCounts.Yin ?? 0;
  const polarity: PolarityValue = yangCount > yinCount ? "auspicious" : yangCount < yinCount ? "mixed" : "mixed";
  signals.push(sig(system, "polarity", polarity));

  return signals;
}

export function extractBaziYearSignals(entry: AnnualLuckPillar): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "bazi";

  // Keyword: pillar stem element
  signals.push(sig(system, "keyword", entry.pillar.stem.element.toLowerCase()));

  // Polarity: Yang stem → auspicious, Yin → mixed
  const polarity: PolarityValue = entry.pillar.stem.polarity === "Yang" ? "auspicious" : "mixed";
  signals.push(sig(system, "polarity", polarity));

  return signals;
}

export function extractNumerologyLifeSignals(result: NumerologyChart): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "numerology";

  // Keyword: dominant element
  if (result.dominantElement) {
    signals.push(sig(system, "keyword", result.dominantElement.toLowerCase()));
  }

  // Domain: life path number
  const domain = LP_DOMAIN[result.lifePathNumber];
  if (domain) signals.push(sig(system, "domain", domain));

  // Polarity: life path polarity
  const pyPolarity = PY_POLARITY[result.lifePathNumber] ?? "mixed";
  signals.push(sig(system, "polarity", pyPolarity));

  return signals;
}

export function extractNumerologyYearSignals(personalYearNumber: number): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "numerology";

  // Polarity from personal year
  const polarity = PY_POLARITY[personalYearNumber] ?? "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Domain from life path domain table (same mapping for yearly cycles)
  const domain = LP_DOMAIN[personalYearNumber];
  if (domain) signals.push(sig(system, "domain", domain));

  return signals;
}

export function extractZiweiSignals(result: ZiWeiChart): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "ziwei";

  let auspiciousCount = 0;
  let inauspiciousCount = 0;

  for (const palace of result.palaces) {
    // Domain from palace
    const domain = PALACE_DOMAIN[palace.key];
    if (domain) signals.push(sig(system, "domain", domain));

    // Polarity signals from major stars
    for (const star of palace.majorStars) {
      if (AUSPICIOUS_STARS.has(star.key)) auspiciousCount++;
      if (INAUSPICIOUS_STARS.has(star.key)) inauspiciousCount++;
    }
  }

  // Aggregate polarity
  const polarity: PolarityValue =
    auspiciousCount > inauspiciousCount ? "auspicious"
    : inauspiciousCount > auspiciousCount ? "caution"
    : "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Keyword: fiveElementName
  if (result.fiveElementName) {
    // Extract element from "Wood/Fire/Earth/Metal/Water X Bureau" style string
    const elementMatch = result.fiveElementName.match(/\b(Wood|Fire|Earth|Metal|Water)\b/i);
    if (elementMatch) signals.push(sig(system, "keyword", elementMatch[1].toLowerCase()));
  }

  return signals;
}

export function extractZodiacLifeSignals(result: ZodiacReading): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "zodiac";

  // Keyword: animal element
  signals.push(sig(system, "keyword", result.animal.element.toLowerCase()));

  // Domain signals from compatible/incompatible (all life domains covered by the animal's traits)
  signals.push(sig(system, "domain", "relationship")); // zodiac always relevant to relationship

  // Polarity: derive from average day forecast rating if available
  if (result.forecasts.length > 0) {
    const RATING_SCORE: Record<string, number> = {
      "very-auspicious": 2, "auspicious": 1, "neutral": 0, "challenging": -1, "very-challenging": -2,
    };
    const avg =
      result.forecasts.reduce((sum, f) => sum + (RATING_SCORE[f.rating] ?? 0), 0) /
      result.forecasts.length;
    const polarity: PolarityValue = avg >= 0.5 ? "auspicious" : avg <= -0.5 ? "caution" : "mixed";
    signals.push(sig(system, "polarity", polarity));
  } else {
    signals.push(sig(system, "polarity", "mixed"));
  }

  return signals;
}

export function extractZodiacYearSignals(
  birthAnimalIndex: number,
  yearAnimalIndex: number
): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "zodiac";

  const polarity = getYearRelationshipPolarity(birthAnimalIndex, yearAnimalIndex);
  signals.push(sig(system, "polarity", polarity));

  // Keyword: year animal element
  const yearAnimal = ANIMALS[yearAnimalIndex];
  if (yearAnimal) {
    signals.push(sig(system, "keyword", yearAnimal.element.toLowerCase()));
  }

  return signals;
}

export function extractAstrologyLifeSignals(result: NatalChart): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "astrology";

  // Keywords: elements of sun, moon, rising signs
  const keyPlanets = ["Sun", "Moon"];
  for (const planet of result.planets) {
    if (keyPlanets.includes(planet.planet)) {
      const element = SIGN_ELEMENT[planet.sign];
      if (element) signals.push(sig(system, "keyword", element.toLowerCase()));
    }
  }

  // Polarity: from transit aspects (current transits at chart calculation time)
  const jupiter = result.transitAspects.filter((a) => a.transitPlanet === "Jupiter");
  const saturn = result.transitAspects.filter((a) => a.transitPlanet === "Saturn");
  const favorable = [...jupiter, ...saturn].filter((a) =>
    a.type === "trine" || a.type === "sextile"
  ).length;
  const challenging = [...jupiter, ...saturn].filter((a) =>
    a.type === "square" || a.type === "opposition"
  ).length;
  const polarity: PolarityValue =
    favorable > challenging ? "auspicious" : challenging > favorable ? "caution" : "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Domain from dominant sign element
  const sunPlanet = result.planets.find((p) => p.planet === "Sun");
  if (sunPlanet) {
    const element = SIGN_ELEMENT[sunPlanet.sign];
    if (element === "Fire" || element === "Air") signals.push(sig(system, "domain", "career"));
    if (element === "Water") signals.push(sig(system, "domain", "relationship"));
    if (element === "Earth") signals.push(sig(system, "domain", "wealth"));
  }

  return signals;
}

export function extractAstrologyYearSignals(transits: TransitAspect[]): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "astrology";

  const jupiter = transits.filter((a) => a.transitPlanet === "Jupiter");
  const saturn = transits.filter((a) => a.transitPlanet === "Saturn");

  let auspicious = 0;
  let caution = 0;

  for (const t of jupiter) {
    if (t.type === "trine" || t.type === "sextile") auspicious++;
    else if (t.type === "conjunction") {
      // Jupiter conjunction is expansive but not always easy
    } else if (t.type === "square" || t.type === "opposition") caution++;
  }
  for (const t of saturn) {
    if (t.type === "trine" || t.type === "sextile") auspicious++;
    else if (t.type === "conjunction" || t.type === "square" || t.type === "opposition")
      caution++;
  }

  const polarity: PolarityValue =
    auspicious > caution ? "auspicious" : caution > auspicious ? "caution" : "mixed";
  signals.push(sig(system, "polarity", polarity));

  return signals;
}

export function extractIChingSignals(reading: IChingReading): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "iching";

  // Polarity: majority nature of changing line texts
  const changingNatures = reading.changingLines.map(
    (i) => reading.primaryHexagram.linesText[i].nature
  );
  let polarity: PolarityValue = "mixed";
  if (changingNatures.length > 0) {
    const auspicious = changingNatures.filter((n) => n === "auspicious").length;
    const inauspicious = changingNatures.filter((n) => n === "inauspicious").length;
    polarity = auspicious > inauspicious ? "auspicious" : inauspicious > auspicious ? "caution" : "mixed";
  }
  signals.push(sig(system, "polarity", polarity));

  // Domain: from hexagram domain map
  const domain = HEXAGRAM_DOMAIN_MAP[reading.primaryHexagram.number] ?? "general";
  if (domain !== "general") {
    signals.push(sig(system, "domain", domain));
  }

  // Keyword: hexagram English name (lowercased, hyphenated)
  const keyword = reading.primaryHexagram.nameEn.toLowerCase().replace(/\s+/g, "-");
  signals.push(sig(system, "keyword", keyword));

  return signals;
}

export function extractRuneSignals(reading: RuneReading): NormalisedSignal[] {
  const signals: NormalisedSignal[] = [];
  const system = "rune";

  // Polarity: majority vote across three drawn runes
  const polarities = reading.drawnRunes.map((d) => d.rune.polarity);
  const auspicious = polarities.filter((p) => p === "auspicious").length;
  const challenging = polarities.filter((p) => p === "challenging").length;
  const polarity: PolarityValue =
    auspicious > challenging ? "auspicious" : challenging > auspicious ? "caution" : "mixed";
  signals.push(sig(system, "polarity", polarity));

  // Domain + keyword from present-position (center) rune
  const presentRune = reading.drawnRunes.find((d) => d.position === "present")?.rune;
  if (presentRune) {
    if (presentRune.domain !== "general") {
      signals.push(sig(system, "domain", presentRune.domain));
    }
    const keyword = presentRune.nameEn.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/\s+/g, "-");
    signals.push(sig(system, "keyword", keyword));
  }

  return signals;
}

// ─── Synthesis Engine ────────────────────────────────────────────────────────

export function synthesiseGroup(
  systemSignals: Record<string, NormalisedSignal[]>,
  groupSize: number
): GroupSynthesisResult {
  // Count occurrences of each (class, tag) pair across systems
  const tagMap = new Map<string, Set<string>>(); // "class:tag" → set of systems

  for (const [system, signals] of Object.entries(systemSignals)) {
    const seen = new Set<string>();
    for (const signal of signals) {
      const key = `${signal.class}:${signal.tag}`;
      if (seen.has(key)) continue; // count each system only once per tag
      seen.add(key);
      if (!tagMap.has(key)) tagMap.set(key, new Set());
      tagMap.get(key)!.add(system);
    }
  }

  const themes: Theme[] = [];
  for (const [key, systems] of tagMap.entries()) {
    const [cls, tag] = key.split(":") as [SignalClass, string];
    const confidenceScore = Math.round((systems.size / groupSize) * 100) / 100;
    themes.push({ class: cls, tag, systems: Array.from(systems), confidenceScore });
  }

  themes.sort((a, b) => b.confidenceScore - a.confidenceScore);

  const summary = composeSummary(themes);
  return { themes, summary };
}

export function composeSummary(themes: Theme[]): string {
  const HIGH = 0.67;
  const high = themes.filter((t) => t.confidenceScore >= HIGH);

  if (high.length === 0) {
    return "The systems consulted offer varied perspectives without strong convergence. Review each individual reading for detailed guidance.";
  }

  const parts: string[] = [];

  // Polarity themes
  const polarityThemes = high.filter((t) => t.class === "polarity");
  for (const pt of polarityThemes) {
    const n = pt.systems.length;
    if (pt.tag === "auspicious") {
      parts.push(`${n} of the consulted systems point in a favourable direction — this matter carries auspicious energy.`);
    } else if (pt.tag === "caution") {
      parts.push(`${n} of the consulted systems advise care — approach this matter with patience and deliberation.`);
    }
  }

  // Domain themes
  const domainThemes = high.filter((t) => t.class === "domain");
  if (domainThemes.length > 0) {
    const domains = domainThemes.map((t) => t.tag).join(" and ");
    parts.push(`Particular attention to ${domains} is indicated across multiple traditions.`);
  }

  // Keyword themes
  const kwThemes = high.filter((t) => t.class === "keyword").slice(0, 2);
  if (kwThemes.length > 0) {
    const kws = kwThemes.map((t) => t.tag).join(" and ");
    parts.push(`The recurring theme of ${kws} appears prominently across the readings.`);
  }

  return parts.join(" ");
}

export function synthesiseLuckYear(
  year: number,
  baziEntry: AnnualLuckPillar | null,
  personalYearNum: number,
  zodiacPolarity: PolarityValue,
  astrologyTransits: TransitAspect[] | null
): YearSynthesis {
  const systemSignals: Record<string, NormalisedSignal[]> = {};
  let groupSize = 0;

  if (baziEntry) {
    systemSignals["bazi"] = extractBaziYearSignals(baziEntry);
    groupSize++;
  }

  systemSignals["numerology"] = extractNumerologyYearSignals(personalYearNum);
  groupSize++;

  systemSignals["zodiac"] = [{ class: "polarity", tag: zodiacPolarity, system: "zodiac" }];
  groupSize++;

  if (astrologyTransits !== null) {
    systemSignals["astrology"] = extractAstrologyYearSignals(astrologyTransits);
    groupSize++;
  }

  const { themes, summary } = synthesiseGroup(systemSignals, groupSize);

  // Derive overall polarity from highest-confidence polarity theme
  const topPolarity = themes.find((t) => t.class === "polarity");
  const overallPolarity: PolarityValue = topPolarity
    ? (topPolarity.tag as PolarityValue)
    : "mixed";

  return { year, themes, summary, overallPolarity, groupSize };
}
