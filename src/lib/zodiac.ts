// Chinese Zodiac Daily Forecast Engine
// Uses classical Earthly Branch relationships + 12 Day Officers (建除十二神)
// Zodiac year determined by Lichun (立春, ~Feb 4) boundary, not Jan 1.

export type DayRating = "very-auspicious" | "auspicious" | "neutral" | "challenging" | "very-challenging";
export type RelationType = "six-harmony" | "three-harmony" | "clash" | "harm" | "punishment" | "destruction" | "none";

export type ZodiacAnimal = {
  index: number;
  chinese: string;
  english: string;
  emoji: string;
  element: string;
  polarity: string;
  traits: string;
  compatible: string[];
  incompatible: string[];
};

export type DayOfficer = {
  chinese: string;
  english: string;
  nature: "auspicious" | "neutral" | "inauspicious";
  suitable: string[];
  avoid: string[];
  description: string;
};

export type DayForecast = {
  date: string;
  dayAnimalIndex: number;
  dayStemIndex: number;
  relationships: RelationType[];
  rating: DayRating;
  officer: DayOfficer;
  brief: string;
  detail: string;
};

export type ZodiacReading = {
  animal: ZodiacAnimal;
  birthDate: string;
  zodiacYear: number;
  forecasts: DayForecast[];
  interpretation: string[];
};

// ─── Animal Data ──────────────────────────────────────────────

const ANIMALS: ZodiacAnimal[] = [
  { index: 0, chinese: "鼠", english: "Rat", emoji: "🐀", element: "Water", polarity: "Yang",
    traits: "Quick-witted, resourceful, versatile, and kind. Rats are natural strategists with sharp instincts and social intelligence.",
    compatible: ["Dragon", "Monkey", "Ox"], incompatible: ["Horse", "Goat", "Rabbit"] },
  { index: 1, chinese: "牛", english: "Ox", emoji: "🐂", element: "Earth", polarity: "Yin",
    traits: "Diligent, dependable, strong, and determined. Oxen bring steady perseverance and quiet authority to everything they do.",
    compatible: ["Rat", "Snake", "Rooster"], incompatible: ["Goat", "Horse", "Dog"] },
  { index: 2, chinese: "虎", english: "Tiger", emoji: "🐅", element: "Wood", polarity: "Yang",
    traits: "Brave, confident, competitive, and unpredictable. Tigers command attention and lead with courage and passion.",
    compatible: ["Horse", "Dog", "Pig"], incompatible: ["Monkey", "Snake"] },
  { index: 3, chinese: "兔", english: "Rabbit", emoji: "🐇", element: "Wood", polarity: "Yin",
    traits: "Quiet, elegant, kind, and responsible. Rabbits possess refined taste, diplomacy, and a calming presence.",
    compatible: ["Goat", "Dog", "Pig"], incompatible: ["Rooster", "Dragon", "Rat"] },
  { index: 4, chinese: "龍", english: "Dragon", emoji: "🐉", element: "Earth", polarity: "Yang",
    traits: "Confident, intelligent, enthusiastic, and ambitious. Dragons are natural leaders brimming with vitality and vision.",
    compatible: ["Rat", "Monkey", "Rooster"], incompatible: ["Dog", "Rabbit", "Dragon"] },
  { index: 5, chinese: "蛇", english: "Snake", emoji: "🐍", element: "Fire", polarity: "Yin",
    traits: "Enigmatic, intelligent, wise, and graceful. Snakes move with quiet precision and deep intuitive awareness.",
    compatible: ["Ox", "Rooster", "Monkey"], incompatible: ["Pig", "Tiger"] },
  { index: 6, chinese: "馬", english: "Horse", emoji: "🐴", element: "Fire", polarity: "Yang",
    traits: "Animated, active, energetic, and free-spirited. Horses thrive on movement, social connection, and open horizons.",
    compatible: ["Tiger", "Goat", "Dog"], incompatible: ["Rat", "Ox", "Rabbit"] },
  { index: 7, chinese: "羊", english: "Goat", emoji: "🐏", element: "Earth", polarity: "Yin",
    traits: "Calm, gentle, creative, and thoughtful. Goats bring artistic sensitivity and a harmonious spirit to their surroundings.",
    compatible: ["Rabbit", "Horse", "Pig"], incompatible: ["Ox", "Rat", "Dog"] },
  { index: 8, chinese: "猴", english: "Monkey", emoji: "🐒", element: "Metal", polarity: "Yang",
    traits: "Sharp, curious, playful, and clever. Monkeys excel at problem-solving and adapt effortlessly to any situation.",
    compatible: ["Rat", "Dragon", "Snake"], incompatible: ["Tiger", "Pig"] },
  { index: 9, chinese: "雞", english: "Rooster", emoji: "🐓", element: "Metal", polarity: "Yin",
    traits: "Observant, hardworking, courageous, and talented. Roosters bring precision, dedication, and flamboyant confidence.",
    compatible: ["Ox", "Snake", "Dragon"], incompatible: ["Rabbit", "Dog", "Rooster"] },
  { index: 10, chinese: "狗", english: "Dog", emoji: "🐕", element: "Earth", polarity: "Yang",
    traits: "Loyal, honest, amiable, and prudent. Dogs are devoted companions who value justice and genuine connection.",
    compatible: ["Tiger", "Rabbit", "Horse"], incompatible: ["Dragon", "Goat", "Rooster"] },
  { index: 11, chinese: "豬", english: "Pig", emoji: "🐖", element: "Water", polarity: "Yin",
    traits: "Compassionate, generous, diligent, and optimistic. Pigs approach life with warmth, sincerity, and joyful abundance.",
    compatible: ["Tiger", "Rabbit", "Goat"], incompatible: ["Snake", "Monkey"] },
];

// ─── Lichun dates (立春) for zodiac year boundary ─────────────
// The Chinese zodiac year starts at Lichun, not Jan 1 or Lunar New Year.
// These are approximate dates (most years Feb 3-5). We use a lookup
// for precision from 1924-2030, covering all realistic birth years.

const LICHUN_DATES: Record<number, string> = {
  1924: "02-05", 1925: "02-04", 1926: "02-04", 1927: "02-05", 1928: "02-05",
  1929: "02-04", 1930: "02-04", 1931: "02-05", 1932: "02-05", 1933: "02-04",
  1934: "02-04", 1935: "02-04", 1936: "02-05", 1937: "02-04", 1938: "02-04",
  1939: "02-05", 1940: "02-05", 1941: "02-04", 1942: "02-04", 1943: "02-05",
  1944: "02-05", 1945: "02-04", 1946: "02-04", 1947: "02-04", 1948: "02-05",
  1949: "02-04", 1950: "02-04", 1951: "02-04", 1952: "02-05", 1953: "02-04",
  1954: "02-04", 1955: "02-04", 1956: "02-05", 1957: "02-04", 1958: "02-04",
  1959: "02-04", 1960: "02-05", 1961: "02-04", 1962: "02-04", 1963: "02-04",
  1964: "02-05", 1965: "02-04", 1966: "02-04", 1967: "02-04", 1968: "02-05",
  1969: "02-04", 1970: "02-04", 1971: "02-04", 1972: "02-05", 1973: "02-04",
  1974: "02-04", 1975: "02-04", 1976: "02-05", 1977: "02-04", 1978: "02-04",
  1979: "02-04", 1980: "02-05", 1981: "02-04", 1982: "02-04", 1983: "02-04",
  1984: "02-04", 1985: "02-04", 1986: "02-04", 1987: "02-04", 1988: "02-04",
  1989: "02-04", 1990: "02-04", 1991: "02-04", 1992: "02-04", 1993: "02-04",
  1994: "02-04", 1995: "02-04", 1996: "02-04", 1997: "02-04", 1998: "02-04",
  1999: "02-04", 2000: "02-04", 2001: "02-04", 2002: "02-04", 2003: "02-04",
  2004: "02-04", 2005: "02-04", 2006: "02-04", 2007: "02-04", 2008: "02-05",
  2009: "02-04", 2010: "02-04", 2011: "02-04", 2012: "02-04", 2013: "02-04",
  2014: "02-04", 2015: "02-04", 2016: "02-04", 2017: "02-03", 2018: "02-04",
  2019: "02-04", 2020: "02-04", 2021: "02-03", 2022: "02-04", 2023: "02-04",
  2024: "02-04", 2025: "02-03", 2026: "02-04", 2027: "02-04", 2028: "02-04",
  2029: "02-03", 2030: "02-04",
};

/** Get the zodiac year for a given birth date, using Lichun boundary */
function getZodiacYear(birthDate: string): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  const lichun = LICHUN_DATES[y] || "02-04"; // fallback
  const [lm, ld] = lichun.split("-").map(Number);
  // If born before Lichun, zodiac year = previous year
  if (m < lm || (m === lm && d < ld)) return y - 1;
  return y;
}

export function getAnimalFromDate(birthDate: string): { animal: ZodiacAnimal; zodiacYear: number } {
  const zodiacYear = getZodiacYear(birthDate);
  const animal = ANIMALS[((zodiacYear - 4) % 12 + 12) % 12];
  return { animal, zodiacYear };
}

export function getAnimalByIndex(idx: number): ZodiacAnimal {
  return ANIMALS[idx];
}

// ─── 12 Day Officers (建除十二神) ─────────────────────────────

const DAY_OFFICERS: DayOfficer[] = [
  { chinese: "建", english: "Establish", nature: "neutral",
    suitable: ["Planning", "Strategizing", "Setting intentions", "Meetings"],
    avoid: ["Major construction", "Litigation", "Surgery"],
    description: "A day of initiation and foundation-setting. Good for beginning plans, but not for completing major undertakings." },
  { chinese: "除", english: "Remove", nature: "auspicious",
    suitable: ["Cleaning", "Decluttering", "Medical treatment", "Ending bad habits", "Purification"],
    avoid: ["Weddings", "Opening businesses", "Major purchases"],
    description: "A day for clearing away the old. Excellent for medical treatment, cleaning, and removing what no longer serves you." },
  { chinese: "滿", english: "Full", nature: "auspicious",
    suitable: ["Celebrations", "Grand openings", "Weddings", "Moving house", "Signing contracts"],
    avoid: ["Starting lawsuits", "Funerals", "Medical procedures"],
    description: "A day of abundance and completion. Ideal for celebrations, finalizing deals, and reaping rewards." },
  { chinese: "平", english: "Balance", nature: "neutral",
    suitable: ["Routine tasks", "Minor renovations", "Decoration", "Road repair"],
    avoid: ["Weddings", "Burial", "Large investments"],
    description: "A calm, level day. Best suited for routine maintenance, minor repairs, and steady work." },
  { chinese: "定", english: "Stable", nature: "auspicious",
    suitable: ["Negotiations", "Signing agreements", "Engagements", "Planting", "Building foundations"],
    avoid: ["Traveling far", "Litigation", "Speculation"],
    description: "A day of stability. Decisions made today tend to hold firm. Excellent for agreements and commitments." },
  { chinese: "執", english: "Hold", nature: "neutral",
    suitable: ["Building", "Construction", "Collecting debts", "Catching/gathering"],
    avoid: ["Moving house", "Traveling", "Opening businesses"],
    description: "A day of grasping and securing. Good for construction and securing what you have." },
  { chinese: "破", english: "Break", nature: "inauspicious",
    suitable: ["Demolition", "Breaking ground", "Surgery", "Ending bad situations"],
    avoid: ["Weddings", "Opening businesses", "Signing contracts", "Moving house"],
    description: "A day of disruption. Most activities should be avoided, but useful for intentional breaking and clearing." },
  { chinese: "危", english: "Danger", nature: "inauspicious",
    suitable: ["Praying", "Ancestor worship", "Fasting", "Quiet reflection"],
    avoid: ["Traveling", "Construction", "Major decisions", "Climbing heights"],
    description: "A day requiring caution and restraint. Best spent in prayer, reflection, and spiritual practice." },
  { chinese: "成", english: "Success", nature: "auspicious",
    suitable: ["Opening businesses", "Signing contracts", "Weddings", "Moving house", "Job interviews", "Launching projects"],
    avoid: ["Litigation", "Funerals"],
    description: "One of the most auspicious days. Everything tends toward successful completion." },
  { chinese: "收", english: "Receive", nature: "auspicious",
    suitable: ["Collecting payments", "Receiving goods", "Harvesting", "Saving", "Closing deals"],
    avoid: ["Surgery", "Funerals", "Starting construction"],
    description: "A day of gathering and receiving. Favorable for collecting what is owed and finalizing transactions." },
  { chinese: "開", english: "Open", nature: "auspicious",
    suitable: ["Grand openings", "Starting businesses", "Moving house", "Weddings", "Travel", "New jobs"],
    avoid: ["Funerals", "Burial"],
    description: "A highly auspicious day of new beginnings. Perfect for launching anything new and fresh starts." },
  { chinese: "閉", english: "Close", nature: "inauspicious",
    suitable: ["Sealing", "Storage", "Burial", "Repairing walls", "Meditation"],
    avoid: ["Opening businesses", "Weddings", "Moving house", "Travel"],
    description: "A day of closure. Most new activities are unfavorable. Best for completing, sealing, and introspection." },
];

// ─── Day Officer Calculation ──────────────────────────────────
// "Establish" (建) falls on the day whose branch matches the month's branch.
// Officer index = (dayBranch - monthBranch + 12) % 12

function getMonthBranchIndex(solarMonth: number): number {
  // Solar month 1 (after Lichun ~Feb) = 寅(idx 2), month 2 = 卯(3), etc.
  return (solarMonth + 1) % 12;
}

function getSolarMonth(dateStr: string): number {
  const [, m, d] = dateStr.split("-").map(Number);
  // Approximate solar term (Jie) boundaries
  const termDays = [0, 6, 4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7];
  // Jan before ~Jan 6 = month 12 of prev year
  if (m === 1) return d < 6 ? 12 : 12; // Jan is always month 12
  if (m === 2) return d < 4 ? 12 : 1;  // Before Lichun = month 12
  const termDay = termDays[m] || 6;
  return d < termDay ? m - 2 : m - 1;
}

function getDayOfficer(dayBranchIdx: number, dateStr: string): DayOfficer {
  const solarMonth = getSolarMonth(dateStr);
  const monthBranch = getMonthBranchIndex(solarMonth);
  const officerIdx = ((dayBranchIdx - monthBranch) % 12 + 12) % 12;
  return DAY_OFFICERS[officerIdx];
}

// ─── Classical Branch Relationships ───────────────────────────

const SIX_HARMONY: [number, number][] = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
const THREE_HARMONY: number[][] = [[0,4,8],[2,6,10],[3,7,11],[1,5,9]];
const SIX_CLASH: [number, number][] = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
const SIX_HARM: [number, number][] = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
const THREE_PUNISHMENT: number[][] = [[2,5,8],[1,10,7]];
const SELF_PUNISHMENT = new Set([0, 3, 6, 9]);
const SIX_DESTRUCTION: [number, number][] = [[0,9],[1,4],[2,11],[3,6],[5,8],[7,10]];

const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES_ZH = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

function pairMatch(pairs: [number, number][], a: number, b: number): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}
function triMatch(triples: number[][], a: number, b: number): boolean {
  return triples.some((tri) => tri.includes(a) && tri.includes(b));
}

function getRelationships(userIdx: number, dayIdx: number): RelationType[] {
  const rels: RelationType[] = [];
  if (pairMatch(SIX_CLASH, userIdx, dayIdx)) rels.push("clash");
  if (pairMatch(SIX_HARM, userIdx, dayIdx)) rels.push("harm");
  if (triMatch(THREE_PUNISHMENT, userIdx, dayIdx)) rels.push("punishment");
  if (userIdx === dayIdx && SELF_PUNISHMENT.has(userIdx)) rels.push("punishment");
  if (pairMatch(SIX_DESTRUCTION, userIdx, dayIdx)) rels.push("destruction");
  if (pairMatch(SIX_HARMONY, userIdx, dayIdx)) rels.push("six-harmony");
  if (triMatch(THREE_HARMONY, userIdx, dayIdx)) rels.push("three-harmony");
  if (rels.length === 0) rels.push("none");
  return rels;
}

// ─── Rating (combines zodiac + officer) ──────────────────────

function rateDay(rels: RelationType[], officer: DayOfficer): DayRating {
  let score = 0;
  if (rels.includes("clash")) score -= 3;
  if (rels.includes("punishment")) score -= 3;
  if (rels.includes("harm")) score -= 2;
  if (rels.includes("destruction")) score -= 1;
  if (rels.includes("six-harmony")) score += 3;
  if (rels.includes("three-harmony")) score += 2;
  if (officer.nature === "auspicious") score += 1;
  if (officer.nature === "inauspicious") score -= 1;
  if (score >= 3) return "very-auspicious";
  if (score >= 1) return "auspicious";
  if (score >= -1) return "neutral";
  if (score >= -2) return "challenging";
  return "very-challenging";
}

// ─── Day Pillar Calculation ──────────────────────────────────

function getDayCycleIndex(dateStr: string): number {
  const ref = Date.UTC(1984, 1, 2); // 1984-02-02 = Jia-Zi (cycle 0)
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  return (((Math.round((target - ref) / 86400000)) % 60) + 60) % 60;
}

// ─── Text Generation ─────────────────────────────────────────

const REL_LABELS: Record<RelationType, { zh: string; en: string }> = {
  "six-harmony": { zh: "六合", en: "Six Harmony" },
  "three-harmony": { zh: "三合", en: "Three Harmony" },
  clash: { zh: "六冲", en: "Clash" },
  harm: { zh: "六害", en: "Harm" },
  punishment: { zh: "三刑", en: "Punishment" },
  destruction: { zh: "六破", en: "Destruction" },
  none: { zh: "平", en: "Neutral" },
};

function generateBrief(user: ZodiacAnimal, day: ZodiacAnimal, rels: RelationType[], officer: DayOfficer): string {
  const relPart = rels[0] === "none" ? `Neutral ${day.english} day.`
    : rels[0] === "six-harmony" ? `Excellent ${day.english} harmony.`
    : rels[0] === "three-harmony" ? `Favorable ${day.english} alliance.`
    : rels[0] === "clash" ? `${day.english} clash — be cautious.`
    : rels[0] === "harm" ? `Hidden ${day.english} friction.`
    : rels[0] === "punishment" ? `Karmic ${day.english} tension.`
    : `Minor ${day.english} disruption.`;
  return `${officer.chinese}${officer.english}. ${relPart}`;
}

function generateDetail(
  user: ZodiacAnimal, day: ZodiacAnimal,
  rels: RelationType[], officer: DayOfficer,
  stemIdx: number, branchIdx: number,
): string {
  const pillar = `${STEMS[stemIdx]}${BRANCHES_ZH[branchIdx]}`;
  const relDescs: string[] = [];
  for (const r of rels) {
    if (r === "six-harmony") relDescs.push(`The ${day.english} forms a Six Harmony (六合) with your ${user.english} — a deeply supportive bond. Cooperation flows naturally.`);
    else if (r === "three-harmony") relDescs.push(`Your ${user.english} joins the ${day.english} in a Three Harmony (三合) triangle — collaborative energy and steady momentum.`);
    else if (r === "clash") relDescs.push(`Direct clash (六冲) between the ${day.english} and your ${user.english} — the strongest zodiac tension. Expect friction and obstacles.`);
    else if (r === "harm") relDescs.push(`A Six Harm (六害) between the ${day.english} and your ${user.english} — subtle undermining energy. Watch for misunderstandings.`);
    else if (r === "punishment") relDescs.push(`Three Punishment (三刑) activated — a deep karmic test. Practice self-awareness and avoid impulsive reactions.`);
    else if (r === "destruction") relDescs.push(`A Six Destruction (六破) pattern — scattered energy and minor disruptions. Stay flexible.`);
    else relDescs.push(`No significant zodiac tension. The energy is calm — what you put in is what you get out.`);
  }
  return `Day pillar: ${pillar}. Day Officer: ${officer.chinese} (${officer.english}) — ${officer.description}\n\n` +
    relDescs.join(" ") +
    `\n\nSuitable today (宜): ${officer.suitable.join(", ")}.\nAvoid today (忌): ${officer.avoid.join(", ")}.`;
}

// ─── Forecast Generation ─────────────────────────────────────

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function generateForecasts(userIdx: number): DayForecast[] {
  const user = ANIMALS[userIdx];
  const today = new Date();
  const forecasts: DayForecast[] = [];
  for (let offset = -14; offset <= 13; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const dateStr = fmtDate(d);
    const cycleIdx = getDayCycleIndex(dateStr);
    const dayIdx = cycleIdx % 12;
    const stemIdx = cycleIdx % 10;
    const dayAnimal = ANIMALS[dayIdx];
    const rels = getRelationships(userIdx, dayIdx);
    const officer = getDayOfficer(dayIdx, dateStr);
    const rating = rateDay(rels, officer);
    forecasts.push({
      date: dateStr, dayAnimalIndex: dayIdx, dayStemIndex: stemIdx,
      relationships: rels, rating, officer,
      brief: generateBrief(user, dayAnimal, rels, officer),
      detail: generateDetail(user, dayAnimal, rels, officer, stemIdx, dayIdx),
    });
  }
  return forecasts;
}

// ─── Interpretation ──────────────────────────────────────────

function buildInterpretation(animal: ZodiacAnimal, forecasts: DayForecast[]): string[] {
  const lines: string[] = [];

  lines.push("## Your Zodiac Profile");
  lines.push(`You are the ${animal.chinese} ${animal.english}, a ${animal.polarity} ${animal.element} sign. ${animal.traits}`);
  lines.push(`Your most harmonious allies are the ${animal.compatible.join(", ")}. You may find friction with the ${animal.incompatible.join(", ")}.`);

  lines.push("## 28-Day Overview");
  const counts = { va: 0, a: 0, n: 0, c: 0 };
  for (const f of forecasts) {
    if (f.rating === "very-auspicious") counts.va++;
    else if (f.rating === "auspicious") counts.a++;
    else if (f.rating === "neutral") counts.n++;
    else counts.c++;
  }
  lines.push(
    `Over the next 28 days: ${counts.va} highly auspicious, ${counts.a} favorable, ${counts.n} neutral, and ${counts.c} challenging days. ` +
    `Ratings combine your zodiac animal's relationship with each day's animal and the traditional Day Officer (建除十二神) from the Chinese almanac (黃曆).`,
  );

  const best = forecasts.filter((f) => f.rating === "very-auspicious" || f.rating === "auspicious");
  const worst = forecasts.filter((f) => f.rating === "very-challenging");

  if (best.length > 0) {
    lines.push("## Best Days to Act");
    const bestDates = best.slice(0, 8).map((f) => {
      const da = ANIMALS[f.dayAnimalIndex];
      const rel = f.relationships.filter((r) => r !== "none").map((r) => REL_LABELS[r].en).join(", ");
      return `${f.date} (${da.english}${rel ? " — " + rel : ""}, ${f.officer.chinese}${f.officer.english})`;
    });
    lines.push(`Your most favorable days: ${bestDates.join("; ")}. Ideal for important decisions, new initiatives, and major life events.`);
  }

  if (worst.length > 0) {
    lines.push("## Days to Exercise Caution");
    const worstDates = worst.map((f) => {
      const da = ANIMALS[f.dayAnimalIndex];
      const rel = f.relationships.map((r) => REL_LABELS[r].en).join(", ");
      return `${f.date} (${da.english} — ${rel}, ${f.officer.chinese}${f.officer.english})`;
    });
    lines.push(`Exercise caution on: ${worstDates.join("; ")}. Patience and flexibility are your best tools on these days.`);
  }

  lines.push("## The Day Officers (建除十二神)");
  lines.push(
    `The Chinese almanac (黃曆) assigns one of twelve Day Officers to each day, tied to the month's Earthly Branch. ` +
    `Auspicious officers (成 Success, 開 Open, 滿 Full, 除 Remove, 定 Stable, 收 Receive) favor action. ` +
    `Inauspicious officers (破 Break, 危 Danger, 閉 Close) call for restraint. ` +
    `Each officer specifies which activities are suitable (宜) and which to avoid (忌).`,
  );

  lines.push("## The Zodiac Cycle");
  lines.push(
    `The Chinese zodiac operates on a 12-day micro-cycle. Every 12 days, the same daily animal returns. ` +
    `Your ${animal.english} has natural affinities (六合, 三合) and tensions (六冲, 六害, 三刑, 六破) with specific animals. ` +
    `Combined with the Day Officers, this creates a nuanced daily rhythm for timing your actions.`,
  );

  return lines;
}

// ─── Main Export ──────────────────────────────────────────────

export function calculateZodiacReading(birthDate: string): ZodiacReading {
  const { animal, zodiacYear } = getAnimalFromDate(birthDate);
  const forecasts = generateForecasts(animal.index);
  const interpretation = buildInterpretation(animal, forecasts);
  return { animal, birthDate, zodiacYear, forecasts, interpretation };
}

export { ANIMALS, REL_LABELS, DAY_OFFICERS, STEMS, BRANCHES_ZH };
