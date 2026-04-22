import { SearchSunLongitude } from "astronomy-engine";
import { DateTime } from "luxon";

// ─── Types ─────────────────────────────────────────────────────────────

export type QmdjMode = "time" | "year";
export type QmdjFocus = "general" | "career" | "wealth" | "relationship" | "health" | "travel" | "legal";

export interface QmdjInput {
  mode: QmdjMode;
  dateTime?: string;    // YYYY-MM-DDTHH:mm for time-based
  timeZone?: string;
  year?: number;        // for year-based
  question?: string;
  focus: QmdjFocus;
}

export interface StarInfo {
  name: string;
  nameZh: string;
  nature: "auspicious" | "inauspicious" | "neutral";
  defaultPalace: number;
}

export interface GateInfo {
  name: string;
  nameZh: string;
  nature: "auspicious" | "inauspicious" | "neutral";
  defaultPalace: number;
}

export interface DeityInfo {
  name: string;
  nameZh: string;
}

export interface Palace {
  palaceNumber: number;
  trigram: string;
  trigramZh: string;
  direction: string;
  earthStem: string;
  heavenStem: string;
  star: StarInfo;
  gate: GateInfo | null;
  deity: DeityInfo | null;
}

export interface Formation {
  name: string;
  nameZh: string;
  type: "auspicious" | "inauspicious" | "neutral";
  palace: number;
  description: string;
}

export interface QmdjChart {
  mode: QmdjMode;
  palaces: Palace[];
  juNumber: number;
  isYangDun: boolean;
  yuan: "upper" | "middle" | "lower";
  solarTerm: { name: string; nameZh: string };
  dutyStarName: string;
  dutyGateName: string;
  dutyStarPalace: number;
  dutyGatePalace: number;
  hourPillar?: { stem: string; branch: string };
  dayPillar?: { stem: string; branch: string };
  formations: Formation[];
  interpretation: string[];
  notes: string[];
}

// ─── Heavenly Stems & Earthly Branches (duplicated from bazi.ts) ──────

interface Stem { key: string; chinese: string; pinyin: string; element: string; polarity: string; }
interface Branch { key: string; chinese: string; pinyin: string; animal: string; element: string; polarity: string; }

const STEMS: Stem[] = [
  { key: "jia",  chinese: "甲", pinyin: "Jia",  element: "Wood",  polarity: "Yang" },
  { key: "yi",   chinese: "乙", pinyin: "Yi",   element: "Wood",  polarity: "Yin" },
  { key: "bing", chinese: "丙", pinyin: "Bing", element: "Fire",  polarity: "Yang" },
  { key: "ding", chinese: "丁", pinyin: "Ding", element: "Fire",  polarity: "Yin" },
  { key: "wu",   chinese: "戊", pinyin: "Wu",   element: "Earth", polarity: "Yang" },
  { key: "ji",   chinese: "己", pinyin: "Ji",   element: "Earth", polarity: "Yin" },
  { key: "geng", chinese: "庚", pinyin: "Geng", element: "Metal", polarity: "Yang" },
  { key: "xin",  chinese: "辛", pinyin: "Xin",  element: "Metal", polarity: "Yin" },
  { key: "ren",  chinese: "壬", pinyin: "Ren",  element: "Water", polarity: "Yang" },
  { key: "gui",  chinese: "癸", pinyin: "Gui",  element: "Water", polarity: "Yin" },
];

const BRANCHES: Branch[] = [
  { key: "zi",   chinese: "子", pinyin: "Zi",   animal: "Rat",     element: "Water", polarity: "Yang" },
  { key: "chou", chinese: "丑", pinyin: "Chou", animal: "Ox",      element: "Earth", polarity: "Yin" },
  { key: "yin",  chinese: "寅", pinyin: "Yin",  animal: "Tiger",   element: "Wood",  polarity: "Yang" },
  { key: "mao",  chinese: "卯", pinyin: "Mao",  animal: "Rabbit",  element: "Wood",  polarity: "Yin" },
  { key: "chen", chinese: "辰", pinyin: "Chen", animal: "Dragon",  element: "Earth", polarity: "Yang" },
  { key: "si",   chinese: "巳", pinyin: "Si",   animal: "Snake",   element: "Fire",  polarity: "Yin" },
  { key: "wu2",  chinese: "午", pinyin: "Wu",   animal: "Horse",   element: "Fire",  polarity: "Yang" },
  { key: "wei",  chinese: "未", pinyin: "Wei",  animal: "Goat",    element: "Earth", polarity: "Yin" },
  { key: "shen", chinese: "申", pinyin: "Shen", animal: "Monkey",  element: "Metal", polarity: "Yang" },
  { key: "you",  chinese: "酉", pinyin: "You",  animal: "Rooster", element: "Metal", polarity: "Yin" },
  { key: "xu",   chinese: "戌", pinyin: "Xu",   animal: "Dog",     element: "Earth", polarity: "Yang" },
  { key: "hai",  chinese: "亥", pinyin: "Hai",  animal: "Pig",     element: "Water", polarity: "Yin" },
];

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

// ─── QMDJ-Specific Constants ──────────────────────────────────────────

// The 9 stems used in QMDJ (Three Wonders + Six Instruments)
// Order: 戊己庚辛壬癸丁丙乙
const QMDJ_STEM_ORDER = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];

// Palace metadata
const PALACE_INFO: { number: number; trigram: string; trigramZh: string; direction: string; element: string }[] = [
  { number: 1, trigram: "Kan",    trigramZh: "坎", direction: "N",  element: "Water" },
  { number: 2, trigram: "Kun",    trigramZh: "坤", direction: "SW", element: "Earth" },
  { number: 3, trigram: "Zhen",   trigramZh: "震", direction: "E",  element: "Wood" },
  { number: 4, trigram: "Xun",    trigramZh: "巽", direction: "SE", element: "Wood" },
  { number: 5, trigram: "Center", trigramZh: "中", direction: "C",  element: "Earth" },
  { number: 6, trigram: "Qian",   trigramZh: "乾", direction: "NW", element: "Metal" },
  { number: 7, trigram: "Dui",    trigramZh: "兌", direction: "W",  element: "Metal" },
  { number: 8, trigram: "Gen",    trigramZh: "艮", direction: "NE", element: "Earth" },
  { number: 9, trigram: "Li",     trigramZh: "離", direction: "S",  element: "Fire" },
];

// Lo Shu flying sequence (1-9)
const LO_SHU_FLY_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Lo Shu perimeter path (excludes center palace 5)
const LO_SHU_PERIMETER = [1, 8, 3, 4, 9, 2, 7, 6];

// Nine Stars
const NINE_STARS: StarInfo[] = [
  { name: "Tianpeng",  nameZh: "天蓬", nature: "inauspicious", defaultPalace: 1 },
  { name: "Tianrui",   nameZh: "天芮", nature: "inauspicious", defaultPalace: 2 },
  { name: "Tianchong", nameZh: "天沖", nature: "auspicious",   defaultPalace: 3 },
  { name: "Tianfu",    nameZh: "天輔", nature: "auspicious",   defaultPalace: 4 },
  { name: "Tianqin",   nameZh: "天禽", nature: "neutral",      defaultPalace: 5 },
  { name: "Tianxin",   nameZh: "天心", nature: "auspicious",   defaultPalace: 6 },
  { name: "Tianzhu",   nameZh: "天柱", nature: "inauspicious", defaultPalace: 7 },
  { name: "Tianren",   nameZh: "天任", nature: "auspicious",   defaultPalace: 8 },
  { name: "Tianying",  nameZh: "天英", nature: "neutral",      defaultPalace: 9 },
];

// Eight Gates (no gate for palace 5)
const EIGHT_GATES: GateInfo[] = [
  { name: "Rest",  nameZh: "休門", nature: "auspicious",   defaultPalace: 1 },
  { name: "Death", nameZh: "死門", nature: "inauspicious", defaultPalace: 2 },
  { name: "Harm",  nameZh: "傷門", nature: "inauspicious", defaultPalace: 3 },
  { name: "Block", nameZh: "杜門", nature: "neutral",      defaultPalace: 4 },
  { name: "Open",  nameZh: "開門", nature: "auspicious",   defaultPalace: 6 },
  { name: "Alarm", nameZh: "驚門", nature: "inauspicious", defaultPalace: 7 },
  { name: "Life",  nameZh: "生門", nature: "auspicious",   defaultPalace: 8 },
  { name: "View",  nameZh: "景門", nature: "neutral",      defaultPalace: 9 },
];

// Eight Deities
const EIGHT_DEITIES: DeityInfo[] = [
  { name: "Zhifu",   nameZh: "值符" },
  { name: "Tengshe", nameZh: "騰蛇" },
  { name: "Taiyin",  nameZh: "太陰" },
  { name: "Liuhe",   nameZh: "六合" },
  { name: "Baihu",   nameZh: "白虎" },
  { name: "Xuanwu",  nameZh: "玄武" },
  { name: "Jiudi",   nameZh: "九地" },
  { name: "Jiutian",  nameZh: "九天" },
];

// 旬 (Xun) table: maps sexagenary index ranges to the stem 甲 hides under
const XUN_TABLE: { start: number; end: number; jiaHead: string; hidesUnder: string; hidesUnderIndex: number }[] = [
  { start: 0,  end: 9,  jiaHead: "甲子", hidesUnder: "戊", hidesUnderIndex: 0 },
  { start: 10, end: 19, jiaHead: "甲戌", hidesUnder: "己", hidesUnderIndex: 1 },
  { start: 20, end: 29, jiaHead: "甲申", hidesUnder: "庚", hidesUnderIndex: 2 },
  { start: 30, end: 39, jiaHead: "甲午", hidesUnder: "辛", hidesUnderIndex: 3 },
  { start: 40, end: 49, jiaHead: "甲辰", hidesUnder: "壬", hidesUnderIndex: 4 },
  { start: 50, end: 59, jiaHead: "甲寅", hidesUnder: "癸", hidesUnderIndex: 5 },
];

// ─── 24 Solar Terms ───────────────────────────────────────────────────

interface SolarTermDef {
  key: string;
  nameZh: string;
  name: string;
  longitude: number;
  approxMonth: number;
  approxDay: number;
}

const ALL_24_SOLAR_TERMS: SolarTermDef[] = [
  { key: "xiaohan",     nameZh: "小寒", name: "Minor Cold",       longitude: 285, approxMonth: 1,  approxDay: 5 },
  { key: "dahan",       nameZh: "大寒", name: "Major Cold",       longitude: 300, approxMonth: 1,  approxDay: 20 },
  { key: "lichun",      nameZh: "立春", name: "Start of Spring",  longitude: 315, approxMonth: 2,  approxDay: 4 },
  { key: "yushui",      nameZh: "雨水", name: "Rain Water",       longitude: 330, approxMonth: 2,  approxDay: 19 },
  { key: "jingzhe",     nameZh: "驚蟄", name: "Awakening",        longitude: 345, approxMonth: 3,  approxDay: 5 },
  { key: "chunfen",     nameZh: "春分", name: "Spring Equinox",   longitude: 0,   approxMonth: 3,  approxDay: 20 },
  { key: "qingming",    nameZh: "清明", name: "Clear Bright",     longitude: 15,  approxMonth: 4,  approxDay: 4 },
  { key: "guyu",        nameZh: "穀雨", name: "Grain Rain",       longitude: 30,  approxMonth: 4,  approxDay: 20 },
  { key: "lixia",       nameZh: "立夏", name: "Start of Summer",  longitude: 45,  approxMonth: 5,  approxDay: 5 },
  { key: "xiaoman",     nameZh: "小滿", name: "Grain Buds",       longitude: 60,  approxMonth: 5,  approxDay: 21 },
  { key: "mangzhong",   nameZh: "芒種", name: "Grain in Ear",     longitude: 75,  approxMonth: 6,  approxDay: 5 },
  { key: "xiazhi",      nameZh: "夏至", name: "Summer Solstice",  longitude: 90,  approxMonth: 6,  approxDay: 21 },
  { key: "xiaoshu",     nameZh: "小暑", name: "Minor Heat",       longitude: 105, approxMonth: 7,  approxDay: 7 },
  { key: "dashu",       nameZh: "大暑", name: "Major Heat",       longitude: 120, approxMonth: 7,  approxDay: 22 },
  { key: "liqiu",       nameZh: "立秋", name: "Start of Autumn",  longitude: 135, approxMonth: 8,  approxDay: 7 },
  { key: "chushu",      nameZh: "處暑", name: "End of Heat",      longitude: 150, approxMonth: 8,  approxDay: 23 },
  { key: "bailu",       nameZh: "白露", name: "White Dew",        longitude: 165, approxMonth: 9,  approxDay: 7 },
  { key: "qiufen",      nameZh: "秋分", name: "Autumn Equinox",   longitude: 180, approxMonth: 9,  approxDay: 23 },
  { key: "hanlu",       nameZh: "寒露", name: "Cold Dew",         longitude: 195, approxMonth: 10, approxDay: 8 },
  { key: "shuangjiang", nameZh: "霜降", name: "Frost's Descent",  longitude: 210, approxMonth: 10, approxDay: 23 },
  { key: "lidong",      nameZh: "立冬", name: "Start of Winter",  longitude: 225, approxMonth: 11, approxDay: 7 },
  { key: "xiaoxue",     nameZh: "小雪", name: "Minor Snow",       longitude: 240, approxMonth: 11, approxDay: 22 },
  { key: "daxue",       nameZh: "大雪", name: "Major Snow",       longitude: 255, approxMonth: 12, approxDay: 7 },
  { key: "dongzhi",     nameZh: "冬至", name: "Winter Solstice",  longitude: 270, approxMonth: 12, approxDay: 21 },
];

// ─── Ju Table ─────────────────────────────────────────────────────────
// [Upper, Middle, Lower] Yuan for each solar term

const JU_TABLE: Record<string, [number, number, number]> = {
  // Yang Dun (Winter Solstice → before Summer Solstice)
  dongzhi:     [1, 7, 4],
  xiaohan:     [2, 8, 5],
  dahan:       [3, 9, 6],
  lichun:      [8, 5, 2],
  yushui:      [9, 6, 3],
  jingzhe:     [1, 7, 4],
  chunfen:     [3, 9, 6],
  qingming:    [4, 1, 7],
  guyu:        [5, 2, 8],
  lixia:       [4, 1, 7],
  xiaoman:     [5, 2, 8],
  mangzhong:   [6, 3, 9],
  // Yin Dun (Summer Solstice → before Winter Solstice)
  xiazhi:      [9, 3, 6],
  xiaoshu:     [8, 2, 5],
  dashu:       [7, 1, 4],
  liqiu:       [2, 5, 8],
  chushu:      [1, 4, 7],
  bailu:       [9, 3, 6],
  qiufen:      [7, 1, 4],
  hanlu:       [6, 9, 3],
  shuangjiang: [5, 8, 2],
  lidong:      [6, 9, 3],
  xiaoxue:     [5, 8, 2],
  daxue:       [4, 7, 1],
};

// Year stem → Ju for year-based QMDJ
const YEAR_JU_MAP: Record<number, number> = {
  0: 1, 5: 1,  // 甲/己 → Ju 1
  1: 2, 6: 2,  // 乙/庚 → Ju 2
  2: 3, 7: 3,  // 丙/辛 → Ju 3
  3: 4, 8: 4,  // 丁/壬 → Ju 4
  4: 5, 9: 5,  // 戊/癸 → Ju 5
};

// ─── Solar Term Engine ────────────────────────────────────────────────

const solarTermCache = new Map<string, { term: SolarTermDef; start: DateTime }[]>();

function getSolarTermInstant(year: number, longitude: number, zone: string): DateTime {
  const termDef = ALL_24_SOLAR_TERMS.find((t) => t.longitude === longitude);
  const approxMonth = termDef?.approxMonth ?? 1;
  const approxDay = termDef?.approxDay ?? 1;
  const approxStart = DateTime.utc(year, approxMonth, approxDay).minus({ days: 5 });
  const result = SearchSunLongitude(longitude, approxStart.toJSDate(), 30);
  if (!result) {
    throw new Error(`Could not find solar term at longitude ${longitude} for year ${year}`);
  }
  const d = result.date;
  return DateTime.fromObject(
    { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes() },
    { zone: "utc" },
  ).setZone(zone);
}

function getAllSolarTermBoundaries(year: number, zone: string): { term: SolarTermDef; start: DateTime }[] {
  const cacheKey = `${year}:${zone}`;
  if (solarTermCache.has(cacheKey)) return solarTermCache.get(cacheKey)!;

  const boundaries: { term: SolarTermDef; start: DateTime }[] = [];
  // Get terms from previous year's winter solstice through this year
  for (const term of ALL_24_SOLAR_TERMS) {
    const y = term.approxMonth >= 12 && term.key === "dongzhi" ? year - 1 : year;
    try {
      const instant = getSolarTermInstant(y, term.longitude, zone);
      boundaries.push({ term, start: instant });
    } catch {
      // Skip if calculation fails
    }
  }
  // Also get this year's winter solstice and next year's early terms
  try {
    const dongzhi = getSolarTermInstant(year, 270, zone);
    const existing = boundaries.find((b) => b.term.key === "dongzhi" && Math.abs(b.start.diff(dongzhi, "days").days) < 5);
    if (!existing) boundaries.push({ term: ALL_24_SOLAR_TERMS.find((t) => t.key === "dongzhi")!, start: dongzhi });
  } catch { /* skip */ }

  boundaries.sort((a, b) => a.start.toMillis() - b.start.toMillis());
  solarTermCache.set(cacheKey, boundaries);
  return boundaries;
}

function getCurrentSolarTerm(dt: DateTime, zone: string): { term: SolarTermDef; start: DateTime; isYangDun: boolean } {
  const year = dt.year;
  const boundaries = [
    ...getAllSolarTermBoundaries(year - 1, zone),
    ...getAllSolarTermBoundaries(year, zone),
    ...getAllSolarTermBoundaries(year + 1, zone),
  ].sort((a, b) => a.start.toMillis() - b.start.toMillis());

  // Remove duplicates (same term within 5 days)
  const unique: typeof boundaries = [];
  for (const b of boundaries) {
    const dup = unique.find((u) => u.term.key === b.term.key && Math.abs(u.start.diff(b.start, "days").days) < 5);
    if (!dup) unique.push(b);
  }

  // Find the most recent solar term before dt
  let current = unique[0];
  for (const b of unique) {
    if (b.start <= dt) current = b;
    else break;
  }

  // Yang Dun: from Winter Solstice (270°) to just before Summer Solstice (90°)
  // Yin Dun: from Summer Solstice (90°) to just before Winter Solstice (270°)
  // Check the current solar term's longitude
  const lng = current.term.longitude;
  // Yang Dun terms: longitude 270-360 (= 270-345) and 0-75
  const isYangDun = lng >= 270 || lng < 90;

  return { ...current, isYangDun };
}

// ─── Yuan & Ju Determination ──────────────────────────────────────────

function determineYuan(dt: DateTime, solarTermStart: DateTime): "upper" | "middle" | "lower" {
  const daysDiff = Math.floor(dt.startOf("day").diff(solarTermStart.startOf("day"), "days").days);
  if (daysDiff < 5) return "upper";
  if (daysDiff < 10) return "middle";
  return "lower";
}

function determineJuNumber(solarTermKey: string, yuan: "upper" | "middle" | "lower"): number {
  const entry = JU_TABLE[solarTermKey];
  if (!entry) throw new Error(`Unknown solar term: ${solarTermKey}`);
  const idx = yuan === "upper" ? 0 : yuan === "middle" ? 1 : 2;
  return entry[idx];
}

// ─── Sexagenary Cycle Helpers ─────────────────────────────────────────

function getDayPillar(dt: DateTime): { stemIndex: number; branchIndex: number; cycleIndex: number } {
  // Reference: 1984-02-02 = 甲子 (Jia-Zi), cycle index 0
  const ref = DateTime.fromObject({ year: 1984, month: 2, day: 2 }, { zone: dt.zoneName ?? "utc" });
  const diffDays = Math.floor(dt.startOf("day").diff(ref.startOf("day"), "days").days);
  const cycleIndex = mod(diffDays, 60);
  return { stemIndex: cycleIndex % 10, branchIndex: cycleIndex % 12, cycleIndex };
}

function getHourPillar(hour: number, dayStemIndex: number): { stemIndex: number; branchIndex: number; cycleIndex: number } {
  const branchIndex = mod(Math.floor((hour + 1) / 2), 12);
  const stemIndex = mod(dayStemIndex * 2 + branchIndex, 10);
  const cycleIndex = mod(stemIndex * 6 + branchIndex, 60); // simplified
  return { stemIndex, branchIndex, cycleIndex };
}

function getHourSexagenaryCycleIndex(dayStemIndex: number, hourBranchIndex: number): number {
  // The hour's position in the 60 Jiazi cycle
  const hourStemIndex = mod(dayStemIndex * 2 + hourBranchIndex, 10);
  // Find the cycle index where stem = hourStemIndex and branch = hourBranchIndex
  for (let i = 0; i < 60; i++) {
    if (i % 10 === hourStemIndex && i % 12 === hourBranchIndex) return i;
  }
  return 0;
}

// ─── Earth Plate Construction ─────────────────────────────────────────

function buildEarthPlate(juNumber: number, isYangDun: boolean): Map<number, string> {
  const plate = new Map<number, string>();

  if (isYangDun) {
    // Yang Dun: place stems in forward Lo Shu flying order starting from Ju palace
    const startIdx = LO_SHU_FLY_ORDER.indexOf(juNumber);
    for (let i = 0; i < 9; i++) {
      const palaceIdx = (startIdx + i) % 9;
      const palace = LO_SHU_FLY_ORDER[palaceIdx];
      plate.set(palace, QMDJ_STEM_ORDER[i]);
    }
  } else {
    // Yin Dun: place stems in reverse Lo Shu flying order starting from Ju palace
    const startIdx = LO_SHU_FLY_ORDER.indexOf(juNumber);
    for (let i = 0; i < 9; i++) {
      const palaceIdx = mod(startIdx - i, 9);
      const palace = LO_SHU_FLY_ORDER[palaceIdx];
      plate.set(palace, QMDJ_STEM_ORDER[i]);
    }
  }

  return plate;
}

// ─── Duty Officers (值符/值使) ────────────────────────────────────────

function findXun(cycleIndex: number): { hidesUnder: string; hidesUnderIndex: number } {
  for (const xun of XUN_TABLE) {
    if (cycleIndex >= xun.start && cycleIndex <= xun.end) {
      return { hidesUnder: xun.hidesUnder, hidesUnderIndex: xun.hidesUnderIndex };
    }
  }
  return XUN_TABLE[0];
}

function findDutyOfficers(hourCycleIndex: number, earthPlate: Map<number, string>) {
  const xun = findXun(hourCycleIndex);
  // Find which palace on the Earth Plate has the stem that 甲 hides under
  let dutyPalace = 1;
  for (const [palace, stem] of earthPlate) {
    if (stem === xun.hidesUnder) {
      dutyPalace = palace;
      break;
    }
  }

  // The star at that palace is the Duty Star
  const dutyStar = NINE_STARS.find((s) => s.defaultPalace === dutyPalace) ?? NINE_STARS[0];
  // The gate at that palace is the Duty Gate
  const dutyGate = EIGHT_GATES.find((g) => g.defaultPalace === dutyPalace) ??
    // If duty palace is 5 (center, no gate), use palace 2's gate
    EIGHT_GATES.find((g) => g.defaultPalace === 2)!;

  return { dutyPalace, dutyStar, dutyGate };
}

// ─── Rotation Along Lo Shu Perimeter ──────────────────────────────────

function getPerimeterIndex(palace: number): number {
  const idx = LO_SHU_PERIMETER.indexOf(palace);
  return idx >= 0 ? idx : -1;
}

function getRotationSteps(fromPalace: number, toPalace: number, isYangDun: boolean): number {
  const fromIdx = getPerimeterIndex(fromPalace);
  const toIdx = getPerimeterIndex(toPalace);
  if (fromIdx < 0 || toIdx < 0) return 0;
  if (isYangDun) {
    return mod(toIdx - fromIdx, 8);
  } else {
    return mod(fromIdx - toIdx, 8);
  }
}

function rotatePalaceOnPerimeter(palace: number, steps: number, isYangDun: boolean): number {
  const idx = getPerimeterIndex(palace);
  if (idx < 0) return palace; // center stays
  if (isYangDun) {
    return LO_SHU_PERIMETER[mod(idx + steps, 8)];
  } else {
    return LO_SHU_PERIMETER[mod(idx - steps, 8)];
  }
}

// ─── Heaven Plate Construction ────────────────────────────────────────

function buildHeavenPlate(
  earthPlate: Map<number, string>,
  dutyPalace: number,
  hourStemPalace: number,
  isYangDun: boolean,
): Map<number, string> {
  const heavenPlate = new Map<number, string>();
  const steps = getRotationSteps(dutyPalace, hourStemPalace, isYangDun);

  for (const [palace, stem] of earthPlate) {
    if (palace === 5) {
      // Center palace stem stays (or follows its rotation target)
      heavenPlate.set(5, stem);
    } else {
      const newPalace = rotatePalaceOnPerimeter(palace, steps, isYangDun);
      heavenPlate.set(newPalace, stem);
    }
  }

  return heavenPlate;
}

// ─── Star Rotation ────────────────────────────────────────────────────

function rotateStars(
  dutyPalace: number,
  hourStemPalace: number,
  isYangDun: boolean,
): Map<number, StarInfo> {
  const starMap = new Map<number, StarInfo>();
  const steps = getRotationSteps(dutyPalace, hourStemPalace, isYangDun);

  for (const star of NINE_STARS) {
    if (star.defaultPalace === 5) {
      // 天禽 follows 天芮 (palace 2)
      continue;
    }
    const newPalace = rotatePalaceOnPerimeter(star.defaultPalace, steps, isYangDun);
    starMap.set(newPalace, star);
  }

  // Place 天禽 at wherever 天芮 ended up
  const tianruiPalace = findStarPalace(starMap, "天芮");
  if (tianruiPalace > 0) {
    starMap.set(5, NINE_STARS[4]); // 天禽 stays notionally at center for display
  }

  // Fill any empty palaces with center star
  for (let p = 1; p <= 9; p++) {
    if (!starMap.has(p)) {
      starMap.set(p, NINE_STARS[4]); // 天禽 fills gaps
    }
  }

  return starMap;
}

function findStarPalace(starMap: Map<number, StarInfo>, nameZh: string): number {
  for (const [palace, star] of starMap) {
    if (star.nameZh === nameZh) return palace;
  }
  return 0;
}

// ─── Gate Rotation ────────────────────────────────────────────────────

function rotateGates(
  dutyGatePalace: number,
  hourStemPalace: number,
  isYangDun: boolean,
): Map<number, GateInfo | null> {
  const gateMap = new Map<number, GateInfo | null>();
  const steps = getRotationSteps(dutyGatePalace, hourStemPalace, isYangDun);

  for (const gate of EIGHT_GATES) {
    const newPalace = rotatePalaceOnPerimeter(gate.defaultPalace, steps, isYangDun);
    gateMap.set(newPalace, gate);
  }

  // Palace 5 never has a gate
  gateMap.set(5, null);

  // Fill any empty perimeter palaces
  for (const p of LO_SHU_PERIMETER) {
    if (!gateMap.has(p)) gateMap.set(p, null);
  }

  return gateMap;
}

// ─── Deity Placement ──────────────────────────────────────────────────

function placeDeities(
  dutyStarFinalPalace: number,
  isYangDun: boolean,
): Map<number, DeityInfo | null> {
  const deityMap = new Map<number, DeityInfo | null>();

  // 值符 deity starts at the duty star's final palace
  let startPalace = dutyStarFinalPalace;
  if (startPalace === 5) startPalace = 2; // center → use palace 2

  const startIdx = getPerimeterIndex(startPalace);
  for (let i = 0; i < 8; i++) {
    let palaceIdx: number;
    if (isYangDun) {
      palaceIdx = mod(startIdx + i, 8);
    } else {
      palaceIdx = mod(startIdx - i, 8);
    }
    const palace = LO_SHU_PERIMETER[palaceIdx];
    deityMap.set(palace, EIGHT_DEITIES[i]);
  }

  deityMap.set(5, null); // center has no deity

  return deityMap;
}

// ─── Formation Detection ──────────────────────────────────────────────

function detectFormations(palaces: Palace[], isYangDun: boolean, juNumber: number): Formation[] {
  const formations: Formation[] = [];

  for (const p of palaces) {
    if (p.palaceNumber === 5) continue;

    const hs = p.heavenStem;
    const es = p.earthStem;
    const gateName = p.gate?.nameZh ?? "";
    const starName = p.star.nameZh;
    const deityName = p.deity?.nameZh ?? "";

    // Auspicious formations (吉格)
    if (hs === "丙" && gateName === "生門") {
      formations.push({ name: "Heaven Escape", nameZh: "天遁", type: "auspicious", palace: p.palaceNumber, description: "丙 (Bing) meets Life Gate — a supremely auspicious formation for bold action and new ventures." });
    }
    if (hs === "乙" && gateName === "開門") {
      formations.push({ name: "Earth Escape", nameZh: "地遁", type: "auspicious", palace: p.palaceNumber, description: "乙 (Yi) meets Open Gate — excellent for practical matters, contracts, and negotiations." });
    }
    if (hs === "丁" && gateName === "休門") {
      formations.push({ name: "Human Escape", nameZh: "人遁", type: "auspicious", palace: p.palaceNumber, description: "丁 (Ding) meets Rest Gate — favourable for relationships, networking, and seeking assistance." });
    }
    if (p.trigramZh === "巽" && hs === "乙") {
      formations.push({ name: "Wind Escape", nameZh: "風遁", type: "auspicious", palace: p.palaceNumber, description: "乙 (Yi) in Xun palace — like wind carrying seeds, ideas spread effortlessly." });
    }
    if (p.trigramZh === "乾" && hs === "乙") {
      formations.push({ name: "Cloud Escape", nameZh: "雲遁", type: "auspicious", palace: p.palaceNumber, description: "乙 (Yi) in Qian palace — hidden potential reveals itself, like clouds parting." });
    }
    if (hs === "丙" && deityName === "九天") {
      formations.push({ name: "Divine Escape", nameZh: "神遁", type: "auspicious", palace: p.palaceNumber, description: "丙 (Bing) meets Nine Heavens deity — extraordinary cosmic support for ambitious endeavours." });
    }
    if (hs === "丁" && deityName === "九地") {
      formations.push({ name: "Ghost Escape", nameZh: "鬼遁", type: "auspicious", palace: p.palaceNumber, description: "丁 (Ding) meets Nine Earth deity — subtle influence works in your favour from hidden quarters." });
    }

    // Three Wonders meeting auspicious gates
    if ((hs === "乙" || hs === "丙" || hs === "丁") && (gateName === "開門" || gateName === "休門" || gateName === "生門")) {
      const existing = formations.find((f) => f.palace === p.palaceNumber && f.type === "auspicious");
      if (!existing) {
        formations.push({ name: "Wonder-Gate Meeting", nameZh: "奇門相會", type: "auspicious", palace: p.palaceNumber, description: `Three Wonders (${hs}) meets an auspicious gate (${gateName}) — a harmonious and fortunate combination.` });
      }
    }

    // Inauspicious formations (凶格)
    // 門迫: Gate element is overcome by palace element
    if (p.gate) {
      const gateElement = getGateElement(p.gate);
      const palaceElement = PALACE_INFO.find((pi) => pi.number === p.palaceNumber)?.element ?? "";
      if (isOvercoming(palaceElement, gateElement)) {
        formations.push({ name: "Gate Oppression", nameZh: "門迫", type: "inauspicious", palace: p.palaceNumber, description: `${p.gate.nameZh} (${gateElement}) is oppressed by the palace element (${palaceElement}) — actions in this direction face resistance.` });
      }
    }

    // 入墓: Heaven stem enters tomb
    if (isTomb(hs, p.palaceNumber)) {
      formations.push({ name: "Entering Tomb", nameZh: "入墓", type: "inauspicious", palace: p.palaceNumber, description: `Heaven stem ${hs} enters its tomb palace — energy is trapped and progress is blocked.` });
    }

    // 庚 on heaven plate meeting key stems
    if (hs === "庚" && es === "丙") {
      formations.push({ name: "Battle Formation", nameZh: "大格", type: "inauspicious", palace: p.palaceNumber, description: "庚 (Geng) over 丙 (Bing) — fierce conflict energy, avoid confrontation." });
    }
    if (hs === "庚" && es === "乙") {
      formations.push({ name: "Metal Restraint", nameZh: "刑格", type: "inauspicious", palace: p.palaceNumber, description: "庚 (Geng) over 乙 (Yi) — Metal chops Wood, plans are forcibly obstructed." });
    }
  }

  // 伏吟 (Fuyin): Stars/Gates remain in default positions (rotation = 0)
  const allInDefault = palaces.filter((p) => p.palaceNumber !== 5).every((p) => p.star.defaultPalace === p.palaceNumber);
  if (allInDefault) {
    formations.push({ name: "Hidden Recurrence", nameZh: "伏吟", type: "inauspicious", palace: 0, description: "All stars remain in their original palaces — stagnation, things repeat without progress. Patience is required." });
  }

  // 反吟 (Fanyin): Stars are opposite to default (shifted by 4 on perimeter)
  const allOpposite = palaces.filter((p) => p.palaceNumber !== 5).every((p) => {
    const defaultIdx = getPerimeterIndex(p.star.defaultPalace);
    const currentIdx = getPerimeterIndex(p.palaceNumber);
    return defaultIdx >= 0 && currentIdx >= 0 && mod(currentIdx - defaultIdx, 8) === 4;
  });
  if (allOpposite) {
    formations.push({ name: "Counter Recurrence", nameZh: "反吟", type: "inauspicious", palace: 0, description: "All stars are in their opposite palaces — reversal energy, things turn upside down. Major changes ahead." });
  }

  return formations;
}

function getGateElement(gate: GateInfo): string {
  const mapping: Record<string, string> = {
    "休門": "Water", "死門": "Earth", "傷門": "Wood",
    "杜門": "Wood", "開門": "Metal", "驚門": "Metal",
    "生門": "Earth", "景門": "Fire",
  };
  return mapping[gate.nameZh] ?? "Earth";
}

function isOvercoming(attacker: string, defender: string): boolean {
  const cycle: Record<string, string> = {
    Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood",
  };
  return cycle[attacker] === defender;
}

function isTomb(stem: string, palace: number): boolean {
  // Tomb positions for each stem
  const tombs: Record<string, number> = {
    "乙": 6, "丙": 6, "丁": 6,  // Fire/Wood tombs in Qian(6)/Xu
    "戊": 6, "己": 6,            // Earth tombs similar
    "庚": 1, "辛": 1,            // Metal tomb in Kan(1)/Chou
    "壬": 4, "癸": 4,            // Water tomb in Xun(4)/Chen
  };
  return tombs[stem] === palace;
}

// ─── Star/Gate Interpretation Data ────────────────────────────────────

const STAR_MEANINGS: Record<string, string> = {
  "天蓬": "The Great Canopy star governs water and hidden affairs. In auspicious positions it aids strategy and covert operations; in inauspicious positions it warns of deception and treachery.",
  "天芮": "The Celestial Healer star governs illness and obstacles. When well-placed it aids medical matters; poorly placed it warns of health issues and petty people.",
  "天沖": "The Heavenly Charge star carries dynamic, pioneering energy. Excellent for bold initiatives, starting businesses, and decisive action.",
  "天輔": "The Celestial Assistant star embodies gentle wisdom and scholarly energy. Favourable for education, planning, spiritual cultivation, and seeking counsel.",
  "天禽": "The Celestial Bird star resides at the center, governing balance and integration. It harmonises the energies of surrounding palaces.",
  "天心": "The Heart of Heaven star governs authority, leadership, and medical arts. Outstanding for important decisions, official matters, and healing.",
  "天柱": "The Celestial Pillar star carries testing, solitary energy. It may bring obstacles but also grants the strength of self-reliance.",
  "天任": "The Celestial Mandate star embodies earth stability and trustworthiness. Excellent for building foundations, real estate, and long-term commitments.",
  "天英": "The Celestial Hero star carries brilliant fire energy. Good for artistic expression and celebrations, but can be volatile in tense situations.",
};

const GATE_MEANINGS: Record<string, string> = {
  "休門": "Rest Gate (Water) — the gate of recuperation and diplomacy. Excellent for meetings, negotiations, seeking allies, and any matter requiring patience and charm.",
  "死門": "Death Gate (Earth) — the gate of endings and burial. Generally unfavourable, but useful for funerals, closures, and matters involving the deceased.",
  "傷門": "Harm Gate (Wood) — the gate of aggression and competition. Favourable for martial arts, debt collection, and confrontational matters; avoid for harmony-seeking.",
  "杜門": "Block Gate (Wood) — the gate of concealment and protection. Good for hiding, defensive measures, and avoiding attention; poor for publicity or expansion.",
  "開門": "Open Gate (Metal) — the gate of new beginnings and enterprise. The most auspicious gate for career, business, official petitions, and leadership initiatives.",
  "驚門": "Alarm Gate (Metal) — the gate of surprises and disputes. Warns of unexpected events, arguments, and legal troubles; caution is advised.",
  "生門": "Life Gate (Earth) — the gate of vitality and wealth. Supremely auspicious for financial matters, investments, real estate, and all ventures seeking growth.",
  "景門": "View Gate (Fire) — the gate of visibility and celebration. Good for examinations, interviews, artistic performances, and anything requiring public attention.",
};

const DEITY_MEANINGS: Record<string, string> = {
  "值符": "The Duty Officer deity amplifies the power of whichever palace it occupies. It represents the highest authority and divine sanction.",
  "騰蛇": "The Flying Serpent deity brings surprise, illusion, and strange occurrences. It warns of deception but can also signal unexpected windfalls.",
  "太陰": "The Great Yin deity governs hidden assistance, especially from female benefactors. It favours covert actions and receiving help from behind the scenes.",
  "六合": "The Six Harmonies deity governs partnerships, matchmaking, and cooperative ventures. Excellent for marriages, contracts, and team-building.",
  "白虎": "The White Tiger deity carries fierce, aggressive energy. It warns of danger, injury, and conflict but can be channelled for competitive advantage.",
  "玄武": "The Dark Warrior deity governs theft, deception, and hidden enemies. It warns of loss and betrayal but also aids in detective and intelligence work.",
  "九地": "The Nine Earth deity embodies deep yin energy — patience, endurance, and hidden strength. Excellent for defensive strategies and consolidation.",
  "九天": "The Nine Heaven deity embodies peak yang energy — expansion, ambition, and bold action. Excellent for launching initiatives and claiming territory.",
};

// ─── Focus Area Gate Mapping ──────────────────────────────────────────

const FOCUS_GATE_MAP: Record<QmdjFocus, string[]> = {
  general: ["開門", "生門", "休門"],
  career: ["開門", "景門"],
  wealth: ["生門", "開門"],
  relationship: ["休門", "六合"],
  health: ["天心", "生門"],
  travel: ["開門", "休門", "生門"],
  legal: ["開門", "驚門"],
};

// ─── Interpretation Builder ───────────────────────────────────────────

function buildInterpretation(
  chart: Omit<QmdjChart, "interpretation" | "notes">,
  input: QmdjInput,
): string[] {
  const lines: string[] = [];

  // Section 1: Chart Overview
  lines.push("## Chart Overview / 盤局概要");
  lines.push(`This is a ${chart.isYangDun ? "Yang Dun (陽遁)" : "Yin Dun (陰遁)"} chart, Ju ${chart.juNumber} (${chart.isYangDun ? "ascending" : "descending"} pattern). ${chart.isYangDun ? "Yang Dun charts carry expansive, forward-moving energy — favourable for initiative and growth." : "Yin Dun charts carry contracting, reflective energy — favourable for strategy, consolidation, and defensive positioning."}`);
  lines.push(`Solar Term: ${chart.solarTerm.nameZh} (${chart.solarTerm.name}). Yuan: ${chart.yuan === "upper" ? "Upper (上元)" : chart.yuan === "middle" ? "Middle (中元)" : "Lower (下元)"}. The ${chart.yuan} yuan carries ${chart.yuan === "upper" ? "initiating energy — the beginning phase of the solar term cycle" : chart.yuan === "middle" ? "developing energy — the maturation phase" : "completing energy — the concluding phase"}.`);
  if (chart.mode === "year") {
    lines.push("This is a Year-Based (年家) chart, reflecting the overarching energy of the entire year rather than a specific moment.");
  }

  // Section 2: Duty Officers
  lines.push("## Duty Officers / 值符值使");
  lines.push(`The Duty Star (值符) is ${chart.dutyStarName} at Palace ${chart.dutyStarPalace}. ${STAR_MEANINGS[chart.dutyStarName] ?? ""}`);
  lines.push(`The Duty Gate (值使) is ${chart.dutyGateName} at Palace ${chart.dutyGatePalace}. ${GATE_MEANINGS[chart.dutyGateName] ?? ""}`);
  lines.push("The Duty Officers are the most significant elements in any Qi Men chart. They represent the primary energy governing this period and the main channel through which outcomes manifest.");

  // Section 3: Nine Stars
  lines.push("## Nine Stars / 九星分析");
  const auspiciousStars = chart.palaces.filter((p) => p.star.nature === "auspicious" && p.palaceNumber !== 5);
  const inauspiciousStars = chart.palaces.filter((p) => p.star.nature === "inauspicious" && p.palaceNumber !== 5);
  if (auspiciousStars.length > 0) {
    lines.push(`Auspicious stars in strong positions: ${auspiciousStars.map((p) => `${p.star.nameZh} at Palace ${p.palaceNumber} (${p.direction})`).join("; ")}. These directions carry supportive cosmic energy.`);
  }
  if (inauspiciousStars.length > 0) {
    lines.push(`Stars requiring caution: ${inauspiciousStars.map((p) => `${p.star.nameZh} at Palace ${p.palaceNumber} (${p.direction})`).join("; ")}. Approach these directions with awareness.`);
  }
  for (const p of chart.palaces) {
    if (p.palaceNumber === 5) continue;
    lines.push(`• Palace ${p.palaceNumber} (${p.trigramZh} ${p.direction}): ${p.star.nameZh} — ${STAR_MEANINGS[p.star.nameZh]?.split(".")[0] ?? "Neutral influence"}.`);
  }

  // Section 4: Eight Gates
  lines.push("## Eight Gates / 八門分析");
  const auspiciousGates = chart.palaces.filter((p) => p.gate?.nature === "auspicious");
  if (auspiciousGates.length > 0) {
    lines.push(`The three auspicious gates are: ${auspiciousGates.map((p) => `${p.gate!.nameZh} at Palace ${p.palaceNumber} (${p.direction})`).join("; ")}. These are the most favourable directions for action.`);
  }
  for (const p of chart.palaces) {
    if (!p.gate || p.palaceNumber === 5) continue;
    lines.push(`• Palace ${p.palaceNumber} (${p.trigramZh} ${p.direction}): ${p.gate.nameZh} — ${GATE_MEANINGS[p.gate.nameZh]?.split(".")[0] ?? "Neutral influence"}.`);
  }

  // Section 5: Formations
  lines.push("## Key Formations / 格局分析");
  if (chart.formations.length === 0) {
    lines.push("No major formations detected in this chart. The energy is relatively balanced without extreme auspicious or inauspicious concentrations. Decisions can proceed based on the gate and star analysis above.");
  } else {
    const auspicious = chart.formations.filter((f) => f.type === "auspicious");
    const inauspicious = chart.formations.filter((f) => f.type === "inauspicious");
    if (auspicious.length > 0) {
      lines.push("Auspicious formations (吉格):");
      for (const f of auspicious) {
        lines.push(`• ${f.nameZh} (${f.name})${f.palace > 0 ? ` at Palace ${f.palace}` : ""}: ${f.description}`);
      }
    }
    if (inauspicious.length > 0) {
      lines.push("Inauspicious formations (凶格):");
      for (const f of inauspicious) {
        lines.push(`• ${f.nameZh} (${f.name})${f.palace > 0 ? ` at Palace ${f.palace}` : ""}: ${f.description}`);
      }
    }
  }

  // Section 6: Directional Guidance
  lines.push("## Directional Guidance / 方位指引");
  const scored = chart.palaces.filter((p) => p.palaceNumber !== 5).map((p) => {
    let score = 0;
    if (p.star.nature === "auspicious") score += 2;
    if (p.star.nature === "inauspicious") score -= 2;
    if (p.gate?.nature === "auspicious") score += 3;
    if (p.gate?.nature === "inauspicious") score -= 3;
    if (p.deity?.nameZh === "值符" || p.deity?.nameZh === "九天" || p.deity?.nameZh === "太陰" || p.deity?.nameZh === "六合") score += 1;
    if (p.deity?.nameZh === "白虎" || p.deity?.nameZh === "玄武") score -= 1;
    const hasAuspiciousFormation = chart.formations.some((f) => f.palace === p.palaceNumber && f.type === "auspicious");
    if (hasAuspiciousFormation) score += 3;
    const hasInauspiciousFormation = chart.formations.some((f) => f.palace === p.palaceNumber && f.type === "inauspicious");
    if (hasInauspiciousFormation) score -= 2;
    return { palace: p, score };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const worst = scored[scored.length - 1];
  if (best) {
    lines.push(`Most favourable direction: ${best.palace.direction} (${best.palace.trigramZh}, Palace ${best.palace.palaceNumber}). ${best.palace.star.nameZh} star with ${best.palace.gate?.nameZh ?? "no gate"} — ${best.score >= 4 ? "an excellent direction for important action" : "a relatively supportive direction for this period"}.`);
  }
  if (worst) {
    lines.push(`Direction requiring most caution: ${worst.palace.direction} (${worst.palace.trigramZh}, Palace ${worst.palace.palaceNumber}). ${worst.palace.star.nameZh} star with ${worst.palace.gate?.nameZh ?? "no gate"} — ${worst.score <= -4 ? "strongly avoid this direction for important matters" : "exercise care when engaging with this direction"}.`);
  }

  // Section 7: Focus Area Reading
  lines.push("## Focus Area Reading / 專項分析");
  const focusLabel: Record<QmdjFocus, string> = {
    general: "General Outlook", career: "Career & Business", wealth: "Wealth & Finance",
    relationship: "Relationships & Love", health: "Health & Wellbeing", travel: "Travel & Movement", legal: "Legal & Disputes",
  };
  const focus = input.focus ?? "general";
  lines.push(`Focus: ${focusLabel[focus]}`);
  const relevantGates = FOCUS_GATE_MAP[focus] ?? FOCUS_GATE_MAP.general;
  for (const gateName of relevantGates) {
    const palace = chart.palaces.find((p) => p.gate?.nameZh === gateName);
    if (palace) {
      lines.push(`${gateName} is at Palace ${palace.palaceNumber} (${palace.trigramZh} ${palace.direction}) with ${palace.star.nameZh} star${palace.deity ? ` and ${palace.deity.nameZh} deity` : ""}. ${GATE_MEANINGS[gateName] ?? ""}`);
    }
  }
  if (input.question) {
    lines.push(`Regarding your question: "${input.question}" — consider the gate and directional analysis above. ${chart.formations.filter((f) => f.type === "auspicious").length > chart.formations.filter((f) => f.type === "inauspicious").length ? "The overall chart energy leans favourable — proceed with measured confidence." : "Exercise caution and seek additional counsel before making major decisions."}`);
  }

  // Section 8: Timing Advice
  lines.push("## Timing Advice / 時機建議");
  const auspiciousCount = chart.formations.filter((f) => f.type === "auspicious").length;
  const inauspiciousCount = chart.formations.filter((f) => f.type === "inauspicious").length;
  const overallScore = scored.reduce((sum, s) => sum + s.score, 0);

  if (overallScore > 8 || auspiciousCount >= 3) {
    lines.push("The overall energy of this chart is strongly favourable. This is an excellent time for action, particularly in the directions identified above. Bold moves are supported by cosmic alignment.");
  } else if (overallScore > 0) {
    lines.push("The chart shows a moderately positive energy. Proceed with your plans but maintain awareness of the cautionary directions. Timing is reasonable for measured action.");
  } else if (overallScore > -8) {
    lines.push("The energy is mixed. While not strongly unfavourable, this is a time for careful deliberation rather than impulsive action. Strengthen your preparations and choose your direction wisely.");
  } else {
    lines.push("The chart reveals challenging energy for this period. Consider postponing major decisions or actions if possible. If you must proceed, favour the most auspicious direction identified above and move with extreme caution.");
  }

  if (chart.mode === "time") {
    lines.push(`For time-sensitive matters, the ${chart.yuan} yuan of ${chart.solarTerm.nameZh} suggests ${chart.yuan === "upper" ? "acting in the first third of this solar term period for maximum alignment" : chart.yuan === "middle" ? "the middle phase is ideal for developing and refining plans already in motion" : "completing and consolidating rather than starting new ventures"}.`);
  }

  return lines;
}

// ─── Assembly Helpers ─────────────────────────────────────────────────

function findHourStemPalace(hourStemIndex: number, earthPlate: Map<number, string>): number {
  const hourStem = STEMS[hourStemIndex].chinese;
  // Map the full 10 stems to QMDJ stems (甲 is not used directly — it hides)
  const qmdjStem = hourStem === "甲" ? "戊" : hourStem; // 甲 uses 戊's position
  for (const [palace, stem] of earthPlate) {
    if (stem === qmdjStem) return palace;
  }
  return 1;
}

function assemblePalaces(
  earthPlate: Map<number, string>,
  heavenPlate: Map<number, string>,
  starMap: Map<number, StarInfo>,
  gateMap: Map<number, GateInfo | null>,
  deityMap: Map<number, DeityInfo | null>,
): Palace[] {
  const palaces: Palace[] = [];
  for (let i = 1; i <= 9; i++) {
    const info = PALACE_INFO[i - 1];
    palaces.push({
      palaceNumber: i,
      trigram: info.trigram,
      trigramZh: info.trigramZh,
      direction: info.direction,
      earthStem: earthPlate.get(i) ?? "",
      heavenStem: heavenPlate.get(i) ?? "",
      star: starMap.get(i) ?? NINE_STARS[4],
      gate: gateMap.get(i) ?? null,
      deity: deityMap.get(i) ?? null,
    });
  }
  return palaces;
}

// ─── Main Exports ─────────────────────────────────────────────────────

export function calculateTimeQmdj(input: QmdjInput): QmdjChart {
  if (!input.dateTime || !input.timeZone) {
    throw new Error("Time-based mode requires date, time, and timezone.");
  }

  const [datePart, timePart] = input.dateTime.split("T");
  if (!datePart || !timePart) {
    throw new Error("Invalid dateTime format. Expected YYYY-MM-DDTHH:mm.");
  }

  const dt = DateTime.fromISO(input.dateTime, { zone: input.timeZone });
  if (!dt.isValid) {
    throw new Error("Invalid date/time or timezone.");
  }

  // 1. Determine solar term
  const { term, start: termStart, isYangDun } = getCurrentSolarTerm(dt, input.timeZone);

  // 2. Determine Yuan
  const yuan = determineYuan(dt, termStart);

  // 3. Determine Ju number
  const juNumber = determineJuNumber(term.key, yuan);

  // 4. Get day and hour pillars
  const dayPillar = getDayPillar(dt);
  const hour = dt.hour;
  const hourPillar = getHourPillar(hour, dayPillar.stemIndex);

  // 5. Get hour sexagenary cycle index for Xun determination
  const hourCycleIndex = getHourSexagenaryCycleIndex(dayPillar.stemIndex, hourPillar.branchIndex);

  // 6. Build Earth Plate
  const earthPlate = buildEarthPlate(juNumber, isYangDun);

  // 7. Find Duty Officers
  const { dutyPalace, dutyStar, dutyGate } = findDutyOfficers(hourCycleIndex, earthPlate);

  // 8. Find hour stem's palace on Earth Plate
  const hourStemPalace = findHourStemPalace(hourPillar.stemIndex, earthPlate);

  // 9. Build Heaven Plate
  const heavenPlate = buildHeavenPlate(earthPlate, dutyPalace, hourStemPalace, isYangDun);

  // 10. Rotate Stars
  const starMap = rotateStars(dutyPalace, hourStemPalace, isYangDun);

  // 11. Rotate Gates
  const dutyGatePalace = dutyGate.defaultPalace;
  const gateMap = rotateGates(dutyGatePalace, hourStemPalace, isYangDun);

  // 12. Place Deities
  const dutyStarFinalPalace = findStarPalace(starMap, dutyStar.nameZh) || dutyPalace;
  const deityMap = placeDeities(dutyStarFinalPalace, isYangDun);

  // 13. Assemble palaces
  const palaces = assemblePalaces(earthPlate, heavenPlate, starMap, gateMap, deityMap);

  // 14. Detect formations
  const formations = detectFormations(palaces, isYangDun, juNumber);

  // Find duty officers' final positions
  const finalDutyStarPalace = palaces.find((p) => p.star.nameZh === dutyStar.nameZh && p.palaceNumber !== 5)?.palaceNumber ?? dutyPalace;
  const finalDutyGatePalace = palaces.find((p) => p.gate?.nameZh === dutyGate.nameZh)?.palaceNumber ?? dutyGatePalace;

  const partialChart: Omit<QmdjChart, "interpretation" | "notes"> = {
    mode: "time",
    palaces,
    juNumber,
    isYangDun,
    yuan,
    solarTerm: { name: term.name, nameZh: term.nameZh },
    dutyStarName: dutyStar.nameZh,
    dutyGateName: dutyGate.nameZh,
    dutyStarPalace: finalDutyStarPalace,
    dutyGatePalace: finalDutyGatePalace,
    hourPillar: { stem: STEMS[hourPillar.stemIndex].chinese, branch: BRANCHES[hourPillar.branchIndex].chinese },
    dayPillar: { stem: STEMS[dayPillar.stemIndex].chinese, branch: BRANCHES[dayPillar.branchIndex].chinese },
    formations,
  };

  const interpretation = buildInterpretation(partialChart, input);
  const notes = [
    "Qi Men Dun Jia (奇門遁甲) is an ancient Chinese strategic divination system dating back over 2,000 years.",
    "This chart uses the 拆補法 (Split-Supplement Method) for Yuan determination.",
    "Solar term boundaries are calculated astronomically for precision.",
    "The Three Wonders (三奇) are 乙, 丙, 丁. The Six Instruments (六儀) are 戊, 己, 庚, 辛, 壬, 癸.",
    "Palace 5 (Center) has no gate or deity. The 天禽 star at the center follows 天芮.",
    "These readings are tools for reflection and strategic thinking, not deterministic predictions.",
  ];

  return { ...partialChart, interpretation, notes };
}

export function calculateYearQmdj(input: QmdjInput): QmdjChart {
  const year = input.year;
  if (!year || year < 1900 || year > 2200) {
    throw new Error("Please enter a valid year between 1900 and 2200.");
  }

  // Year stem index from the sexagenary cycle
  const cycleIndex = mod(year - 4, 60);
  const stemIndex = cycleIndex % 10;
  const branchIndex = cycleIndex % 12;

  // Year stem → Ju
  const juNumber = YEAR_JU_MAP[stemIndex] ?? 1;

  // Yang/Yin based on stem polarity
  const isYangDun = STEMS[stemIndex].polarity === "Yang";

  // Year stem → solar term (use the dominant term for the year)
  const yearElement = STEMS[stemIndex].element;

  // For year-based, use a simplified Yuan based on the branch
  const yuan: "upper" | "middle" | "lower" =
    branchIndex % 3 === 0 ? "upper" : branchIndex % 3 === 1 ? "middle" : "lower";

  // Build Earth Plate
  const earthPlate = buildEarthPlate(juNumber, isYangDun);

  // For year-based, the "hour" is replaced by the year stem
  // Use the year stem's cycle index for Xun determination
  const yearCycleIndex = cycleIndex;

  // Find Duty Officers using year's cycle index
  const { dutyPalace, dutyStar, dutyGate } = findDutyOfficers(yearCycleIndex, earthPlate);

  // Find year stem's palace on Earth Plate
  const yearStemPalace = findHourStemPalace(stemIndex, earthPlate);

  // Build Heaven Plate
  const heavenPlate = buildHeavenPlate(earthPlate, dutyPalace, yearStemPalace, isYangDun);

  // Rotate Stars, Gates, Deities
  const starMap = rotateStars(dutyPalace, yearStemPalace, isYangDun);
  const gateMap = rotateGates(dutyGate.defaultPalace, yearStemPalace, isYangDun);
  const dutyStarFinalPalace = findStarPalace(starMap, dutyStar.nameZh) || dutyPalace;
  const deityMap = placeDeities(dutyStarFinalPalace, isYangDun);

  // Assemble
  const palaces = assemblePalaces(earthPlate, heavenPlate, starMap, gateMap, deityMap);
  const formations = detectFormations(palaces, isYangDun, juNumber);

  const finalDutyStarPalace = palaces.find((p) => p.star.nameZh === dutyStar.nameZh && p.palaceNumber !== 5)?.palaceNumber ?? dutyPalace;
  const finalDutyGatePalace = palaces.find((p) => p.gate?.nameZh === dutyGate.nameZh)?.palaceNumber ?? dutyGate.defaultPalace;

  // Find a representative solar term for display
  const solarTermName = isYangDun ? "Spring Energy" : "Autumn Energy";
  const solarTermZh = isYangDun ? "陽遁" : "陰遁";

  const partialChart: Omit<QmdjChart, "interpretation" | "notes"> = {
    mode: "year",
    palaces,
    juNumber,
    isYangDun,
    yuan,
    solarTerm: { name: solarTermName, nameZh: solarTermZh },
    dutyStarName: dutyStar.nameZh,
    dutyGateName: dutyGate.nameZh,
    dutyStarPalace: finalDutyStarPalace,
    dutyGatePalace: finalDutyGatePalace,
    dayPillar: { stem: STEMS[stemIndex].chinese, branch: BRANCHES[branchIndex].chinese },
    formations,
  };

  const interpretation = buildInterpretation(partialChart, input);
  const notes = [
    "Year-Based Qi Men Dun Jia (年家奇門) reflects the overarching energy of the entire year.",
    "The Ju number is derived from the year's Heavenly Stem in the sexagenary cycle.",
    `Year ${year}: ${STEMS[stemIndex].chinese}${BRANCHES[branchIndex].chinese} (${STEMS[stemIndex].pinyin} ${BRANCHES[branchIndex].pinyin}), ${yearElement} element.`,
    "For more precise timing, use the Time-Based mode with a specific date and hour.",
    "These readings are tools for reflection and strategic thinking.",
  ];

  return { ...partialChart, interpretation, notes };
}
