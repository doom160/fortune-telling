import { SearchSunLongitude } from "astronomy-engine";
import { DateTime } from "luxon";

export type HeavenlyStem = {
  key: string;
  chinese: string;
  pinyin: string;
  element: Element;
  polarity: Polarity;
};

export type EarthlyBranch = {
  key: string;
  chinese: string;
  pinyin: string;
  animal: string;
  element: Element;
  polarity: Polarity;
};

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "Yang" | "Yin";

export type Pillar = {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
};

export type BaziInput = {
  name?: string;
  gender: string;
  birthDate: string; // yyyy-mm-dd
  birthTime?: string; // HH:mm
  timeZone: string;
};

export type LuckPillar = {
  decade: number; // 0-9 representing decades of life
  ageStart: number;
  ageEnd: number;
  pillar: Pillar;
  yearRange: string;
};

export type AnnualLuckPillar = {
  year: number;
  age: number;
  pillar: Pillar;
  yearLabel: string;
  monthlyPillars: MonthlyLuckPillar[];
};

export type MonthlyLuckPillar = {
  month: number;
  monthName: string;
  pillar: Pillar;
};

export type HiddenStem = {
  stem: HeavenlyStem;
  index: number; // Position in the hidden stems (1st, 2nd, or 3rd)
};

export type BranchWithHiddenStems = EarthlyBranch & {
  hiddenStems: HiddenStem[];
};

export type PillarAnalysis = {
  pillar: Pillar;
  hiddenStems: HiddenStem[];
  totalElements: Record<Element, number>;
};

export type BaziChart = {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar?: Pillar;
  solarTermInfo?: { term: string; date: string };
  localBirthDateTime: string;
  isHourEstimated: boolean;
  dayMaster: HeavenlyStem;
  birthYear: number;
  elementCounts: Record<Element, number>;
  polarityCounts: Record<Polarity, number>;
  dominantElement: Element;
  weakElement: Element;
  luckPillars: LuckPillar[];
  annualLuckPillars: AnnualLuckPillar[];
  hiddenStemAnalysis: PillarAnalysis[];
  interpretation: string[];
  notes: string[];
};

const STEMS: HeavenlyStem[] = [
  { key: "jia", chinese: "甲", pinyin: "Jia", element: "Wood", polarity: "Yang" },
  { key: "yi", chinese: "乙", pinyin: "Yi", element: "Wood", polarity: "Yin" },
  { key: "bing", chinese: "丙", pinyin: "Bing", element: "Fire", polarity: "Yang" },
  { key: "ding", chinese: "丁", pinyin: "Ding", element: "Fire", polarity: "Yin" },
  { key: "wu", chinese: "戊", pinyin: "Wu", element: "Earth", polarity: "Yang" },
  { key: "ji", chinese: "己", pinyin: "Ji", element: "Earth", polarity: "Yin" },
  { key: "geng", chinese: "庚", pinyin: "Geng", element: "Metal", polarity: "Yang" },
  { key: "xin", chinese: "辛", pinyin: "Xin", element: "Metal", polarity: "Yin" },
  { key: "ren", chinese: "壬", pinyin: "Ren", element: "Water", polarity: "Yang" },
  { key: "gui", chinese: "癸", pinyin: "Gui", element: "Water", polarity: "Yin" },
];

const BRANCHES: EarthlyBranch[] = [
  {
    key: "zi",
    chinese: "子",
    pinyin: "Zi",
    animal: "Rat",
    element: "Water",
    polarity: "Yang",
  },
  {
    key: "chou",
    chinese: "丑",
    pinyin: "Chou",
    animal: "Ox",
    element: "Earth",
    polarity: "Yin",
  },
  {
    key: "yin",
    chinese: "寅",
    pinyin: "Yin",
    animal: "Tiger",
    element: "Wood",
    polarity: "Yang",
  },
  {
    key: "mao",
    chinese: "卯",
    pinyin: "Mao",
    animal: "Rabbit",
    element: "Wood",
    polarity: "Yin",
  },
  {
    key: "chen",
    chinese: "辰",
    pinyin: "Chen",
    animal: "Dragon",
    element: "Earth",
    polarity: "Yang",
  },
  {
    key: "si",
    chinese: "巳",
    pinyin: "Si",
    animal: "Snake",
    element: "Fire",
    polarity: "Yin",
  },
  {
    key: "wu",
    chinese: "午",
    pinyin: "Wu",
    animal: "Horse",
    element: "Fire",
    polarity: "Yang",
  },
  {
    key: "wei",
    chinese: "未",
    pinyin: "Wei",
    animal: "Goat",
    element: "Earth",
    polarity: "Yin",
  },
  {
    key: "shen",
    chinese: "申",
    pinyin: "Shen",
    animal: "Monkey",
    element: "Metal",
    polarity: "Yang",
  },
  {
    key: "you",
    chinese: "酉",
    pinyin: "You",
    animal: "Rooster",
    element: "Metal",
    polarity: "Yin",
  },
  {
    key: "xu",
    chinese: "戌",
    pinyin: "Xu",
    animal: "Dog",
    element: "Earth",
    polarity: "Yang",
  },
  {
    key: "hai",
    chinese: "亥",
    pinyin: "Hai",
    animal: "Pig",
    element: "Water",
    polarity: "Yin",
  },
];

const ELEMENT_ORDER: Element[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

// Hidden Stems (Cang Gan / 藏干) for each Earthly Branch
// These represent the additional stems hidden within each branch
// Order: principal stem first, then secondary, then residual
const HIDDEN_STEMS_BY_BRANCH: Record<string, number[]> = {
  zi: [9], // Gui (Water)
  chou: [5, 9, 7], // Ji (Earth), Gui (Water), Xin (Metal)
  yin: [0, 2, 4], // Jia (Wood), Bing (Fire), Wu (Earth)
  mao: [1], // Yi (Wood)
  chen: [4, 1, 9], // Wu (Earth), Yi (Wood), Gui (Water)
  si: [2, 4, 6], // Bing (Fire), Wu (Earth), Geng (Metal)
  wu: [3, 5], // Ding (Fire), Ji (Earth)
  wei: [5, 3, 1], // Ji (Earth), Ding (Fire), Yi (Wood)
  shen: [6, 8, 4], // Geng (Metal), Ren (Water), Wu (Earth)
  you: [7], // Xin (Metal)
  xu: [4, 7, 3], // Wu (Earth), Xin (Metal), Ding (Fire)
  hai: [8, 0], // Ren (Water), Jia (Wood)
};

type SolarMonthStartTerm = {
  name: string;
  monthNumber: number;
  longitude: number;
  approxMonth: number;
  approxDay: number;
};

type SolarMonthBoundary = SolarMonthStartTerm & {
  instant: DateTime;
};

// BaZi month pillars advance on the 12 major month-start solar terms (jie),
// each defined by the Sun reaching a specific apparent ecliptic longitude.
const SOLAR_MONTH_START_TERMS: SolarMonthStartTerm[] = [
  { name: "Lichun", monthNumber: 1, longitude: 315, approxMonth: 2, approxDay: 4 },
  { name: "Jingzhe", monthNumber: 2, longitude: 345, approxMonth: 3, approxDay: 5 },
  { name: "Qingming", monthNumber: 3, longitude: 15, approxMonth: 4, approxDay: 4 },
  { name: "Lixia", monthNumber: 4, longitude: 45, approxMonth: 5, approxDay: 5 },
  { name: "Mangzhong", monthNumber: 5, longitude: 75, approxMonth: 6, approxDay: 5 },
  { name: "Xiaoshu", monthNumber: 6, longitude: 105, approxMonth: 7, approxDay: 7 },
  { name: "Liqiu", monthNumber: 7, longitude: 135, approxMonth: 8, approxDay: 7 },
  { name: "Bailu", monthNumber: 8, longitude: 165, approxMonth: 9, approxDay: 7 },
  { name: "Hanlu", monthNumber: 9, longitude: 195, approxMonth: 10, approxDay: 8 },
  { name: "Lidong", monthNumber: 10, longitude: 225, approxMonth: 11, approxDay: 7 },
  { name: "Daxue", monthNumber: 11, longitude: 255, approxMonth: 12, approxDay: 7 },
  { name: "Xiaohan", monthNumber: 12, longitude: 285, approxMonth: 1, approxDay: 5 },
];

const SOLAR_BOUNDARY_CACHE = new Map<string, SolarMonthBoundary[]>();

const ELEMENT_THEMES: Record<
  Element,
  { gifts: string; challenge: string; support: string; lifestyle: string; personality: string; career_affinity: string; relationship_style: string }
> = {
  Wood: {
    gifts: "growth, creativity, and strategic vision",
    challenge: "impatience when progress feels blocked",
    support: "clear long-range goals and steady routines",
    lifestyle: "learning cycles, planning boards, and nature time",
    personality: "You tend to be visionary and forward-thinking, with a natural drive to expand, build, and create new paths. Wood energy makes you resilient and adaptable, like a tree bending in the wind without breaking. You thrive when there is a clear direction and room to grow.",
    career_affinity: "leadership, education, creative industries, urban planning, agriculture, and any role that involves building or scaling systems over time",
    relationship_style: "generous and growth-oriented in partnerships, often encouraging others to reach their potential, though sometimes pushing too hard or becoming frustrated when others don't share your pace",
  },
  Fire: {
    gifts: "charisma, warmth, and momentum",
    challenge: "emotional overdrive or burnout",
    support: "intentional rest and emotional boundaries",
    lifestyle: "creative expression, sunlight, and social rituals",
    personality: "You carry natural magnetism and enthusiasm that draws people in. Fire energy gives you confidence, expressiveness, and an ability to inspire and lead through sheer passion. You light up a room but can also burn too bright if boundaries aren't maintained.",
    career_affinity: "entertainment, marketing, public speaking, design, hospitality, and roles that reward visibility, persuasion, and energetic presence",
    relationship_style: "passionate and expressive in love, bringing warmth and excitement to relationships, but sometimes overwhelming partners with intensity or needing constant stimulation to feel engaged",
  },
  Earth: {
    gifts: "stability, care, and practical execution",
    challenge: "over-responsibility and overthinking",
    support: "simple priorities and healthy delegation",
    lifestyle: "consistent meals, grounding exercise, and journaling",
    personality: "You are the anchor in most situations — reliable, thoughtful, and deeply caring. Earth energy gives you the ability to nurture, organize, and create foundations that last. People naturally trust and lean on you, though you may carry more than your share.",
    career_affinity: "real estate, agriculture, healthcare, counseling, administration, and roles requiring patience, trust-building, and long-term stewardship",
    relationship_style: "loyal and nurturing in partnerships, creating safe and stable environments for loved ones, though occasionally smothering or becoming anxious when things feel uncertain",
  },
  Metal: {
    gifts: "discipline, precision, and discernment",
    challenge: "self-criticism and rigidity",
    support: "compassionate standards and clean systems",
    lifestyle: "decluttering, focused work blocks, and breathwork",
    personality: "You possess a sharp and refined mind that values quality, structure, and integrity. Metal energy gives you the capacity for deep focus, moral clarity, and an eye for what needs to be pruned or perfected. You hold yourself and others to high standards.",
    career_affinity: "finance, engineering, law, technology, quality assurance, and roles that require analytical precision, systematic thinking, and high standards",
    relationship_style: "devoted and principled in love, showing care through acts of service and reliability, though sometimes appearing distant or overly critical when your standards aren't met",
  },
  Water: {
    gifts: "intuition, adaptability, and wisdom",
    challenge: "indecision or emotional drift",
    support: "structure around reflection and execution",
    lifestyle: "quiet time, deep conversations, and fluid movement",
    personality: "You move through life with fluidity and depth, sensing undercurrents that others miss. Water energy grants you wisdom, empathy, and a remarkable ability to adapt to changing circumstances. Your strength lies in going with the flow while maintaining inner direction.",
    career_affinity: "research, diplomacy, writing, psychology, logistics, and roles that reward flexibility, emotional intelligence, and the ability to navigate complexity",
    relationship_style: "deeply empathetic and intuitive in love, sensing your partner's needs before they are spoken, though sometimes retreating into your inner world or struggling to assert your own boundaries",
  },
};

export function calculateBazi(input: BaziInput): BaziChart {
  const localTime = normalizeBirthDateTime(input.birthDate, input.birthTime, input.timeZone);
  const solarYear = getSolarYear(localTime);
  const yearPillar = getYearPillar(solarYear);
  const { monthPillar, solarTermInfo } = getMonthPillarWithSolarTerm(
    localTime,
    yearPillar.stem,
  );
  const dayPillar = getDayPillar(localTime.startOf("day"));
  const hourPillar = input.birthTime ? getHourPillar(localTime.hour, dayPillar.stem) : undefined;

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(Boolean) as Pillar[];

  const elementCounts: Record<Element, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  const polarityCounts: Record<Polarity, number> = {
    Yang: 0,
    Yin: 0,
  };

  for (const pillar of pillars) {
    elementCounts[pillar.stem.element] += 1;
    elementCounts[pillar.branch.element] += 1;
    polarityCounts[pillar.stem.polarity] += 1;
    polarityCounts[pillar.branch.polarity] += 1;
  }

  const dominantElement = getDominantElement(elementCounts);
  const weakElement = getWeakElement(elementCounts);
  const luckPillars = calculateLuckPillars({
    birthDateTime: localTime,
    birthYear: localTime.year,
    monthPillar,
    yearPillar,
    gender: input.gender,
  });
  const annualLuckPillars = calculateAnnualLuckPillars(luckPillars, localTime.year);
  const hiddenStemAnalysis = analyzeHiddenStems(pillars);

  const interpretation = buildInterpretation({
    input,
    dayMaster: dayPillar.stem,
    dominantElement,
    weakElement,
    elementCounts,
    polarityCounts,
    luckPillars,
    hiddenStemAnalysis,
  });

  const notes = [
    "Chart uses true solar-term boundaries (jieqi) for accurate month pillar calculation.",
    "Hidden stems (Nayin) within branches provide additional elemental layer and timing insights.",
    "Major luck pillars (Daiyun) span 10-year cycles; annual and monthly variations are calculated below.",
    "If birth time is missing, the hour pillar is omitted and precision is lower.",
  ];

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    solarTermInfo,
    localBirthDateTime: localTime.toFormat("cccc, dd LLL yyyy HH:mm 'at' ZZZZ"),
    isHourEstimated: !input.birthTime,
    dayMaster: dayPillar.stem,
    birthYear: localTime.year,
    elementCounts,
    polarityCounts,
    dominantElement,
    weakElement,
    luckPillars,
    annualLuckPillars,
    hiddenStemAnalysis,
    interpretation,
    notes,
  };
}

function normalizeBirthDateTime(
  birthDate: string,
  birthTime: string | undefined,
  timeZone: string,
): DateTime {
  const value = `${birthDate}T${birthTime ?? "12:00"}`;
  const dateTime = DateTime.fromISO(value, { zone: timeZone });

  if (!dateTime.isValid) {
    throw new Error("Unable to parse birth date/time. Please double-check your input.");
  }

  return dateTime;
}

function getYearPillar(year: number): Pillar {
  const cycleIndex = mod(year - 4, 60);
  return {
    stem: STEMS[cycleIndex % 10],
    branch: BRANCHES[cycleIndex % 12],
  };
}

function getMonthPillarWithSolarTerm(
  birthDateTime: DateTime,
  yearStem: HeavenlyStem,
): { monthPillar: Pillar; solarTermInfo?: { term: string; date: string } } {
  const boundaries = getSolarMonthBoundaries(birthDateTime);
  const activeBoundary = getActiveSolarBoundary(boundaries, birthDateTime);
  const monthNumber = activeBoundary?.monthNumber ?? approximateSolarMonthNumber(birthDateTime);
  const solarTermInfo = activeBoundary
    ? {
        term: activeBoundary.name,
        date: activeBoundary.instant.toFormat("yyyy-LL-dd HH:mm ZZZZ"),
      }
    : undefined;

  // Month 1 starts at Yin (Tiger), so shift the branch sequence by +1.
  const branchIndex = mod(monthNumber + 1, 12);
  const yearStemIndex = STEMS.findIndex((stem) => stem.key === yearStem.key);
  const tigerMonthStemStart = mod((yearStemIndex % 5) * 2 + 2, 10);
  const stemIndex = mod(tigerMonthStemStart + (monthNumber - 1), 10);

  return {
    monthPillar: {
      stem: STEMS[stemIndex],
      branch: BRANCHES[branchIndex],
    },
    solarTermInfo,
  };
}

function getSolarYear(localTime: DateTime): number {
  const lichun = getSolarTermInstant(localTime.year, "Lichun", localTime.zoneName ?? "UTC");
  return localTime < lichun ? localTime.year - 1 : localTime.year;
}

function getSolarMonthBoundaries(birthDateTime: DateTime): SolarMonthBoundary[] {
  const zone = birthDateTime.zoneName ?? "UTC";
  const cacheKey = `${birthDateTime.year}:${zone}`;
  const cached = SOLAR_BOUNDARY_CACHE.get(cacheKey);
  if (cached) {
    return cached;
  }

  const boundaries = [birthDateTime.year - 1, birthDateTime.year, birthDateTime.year + 1]
    .flatMap((year) =>
      SOLAR_MONTH_START_TERMS.map((term) => ({
        ...term,
        instant: getSolarTermInstant(year, term.name, zone),
      })),
    )
    .sort((left, right) => left.instant.toMillis() - right.instant.toMillis());

  SOLAR_BOUNDARY_CACHE.set(cacheKey, boundaries);
  return boundaries;
}

function getSolarTermInstant(year: number, termName: string, zone: string): DateTime {
  const term = SOLAR_MONTH_START_TERMS.find((entry) => entry.name === termName);
  if (!term) {
    throw new Error(`Unknown solar term: ${termName}`);
  }

  const approxStart = DateTime.utc(year, term.approxMonth, term.approxDay).minus({ days: 4 });
  const searchResult = SearchSunLongitude(term.longitude, approxStart.toJSDate(), 10);

  if (!searchResult) {
    throw new Error(`Unable to calculate solar term ${term.name} for ${year}.`);
  }

  return DateTime.fromJSDate(searchResult.date, { zone });
}

function getActiveSolarBoundary(
  boundaries: SolarMonthBoundary[],
  birthDateTime: DateTime,
): SolarMonthBoundary | undefined {
  let activeBoundary: SolarMonthBoundary | undefined;

  for (const boundary of boundaries) {
    if (boundary.instant <= birthDateTime) {
      activeBoundary = boundary;
      continue;
    }

    break;
  }

  return activeBoundary;
}

function approximateSolarMonthNumber(birthDateTime: DateTime): number {
  if (birthDateTime.month === 1) {
    return birthDateTime.day >= 5 ? 12 : 11;
  }

  const fallbackMap: Record<number, number> = {
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    11: 10,
    12: 11,
  };

  return fallbackMap[birthDateTime.month] ?? 1;
}

function calculateLuckPillars({
  birthDateTime,
  birthYear,
  monthPillar,
  yearPillar,
  gender,
}: {
  birthDateTime: DateTime;
  birthYear: number;
  monthPillar: Pillar;
  yearPillar: Pillar;
  gender: string;
}): LuckPillar[] {
  const luckPillars: LuckPillar[] = [];

  const isForward = isForwardLuckDirection(gender, yearPillar.stem.polarity);
  const boundaries = getSolarMonthBoundaries(birthDateTime);
  const startAge = calculateLuckStartAge(birthDateTime, boundaries, isForward);

  const monthStemIndex = STEMS.findIndex((stem) => stem.key === monthPillar.stem.key);
  const monthBranchIndex = BRANCHES.findIndex((branch) => branch.key === monthPillar.branch.key);

  // Major luck pillars (Daiyun) advance/retreat from month pillar by one stem/branch per decade.
  for (let decade = 0; decade < 8; decade++) {
    const step = isForward ? decade + 1 : -(decade + 1);
    const ageStart = startAge + decade * 10;

    const luckStemIndex = mod(monthStemIndex + step, 10);
    const luckBranchIndex = mod(monthBranchIndex + step, 12);

    const pillar: Pillar = {
      stem: STEMS[luckStemIndex],
      branch: BRANCHES[luckBranchIndex],
    };

    const yearStart = birthYear + ageStart;
    const yearEnd = birthYear + ageStart + 9;

    luckPillars.push({
      decade,
      ageStart,
      ageEnd: ageStart + 9,
      pillar,
      yearRange: `${yearStart}-${yearEnd}`,
    });
  }

  return luckPillars;
}

function isForwardLuckDirection(gender: string, yearPolarity: Polarity): boolean {
  const normalized = gender.trim().toLowerCase();
  const isMale = normalized === "male";
  const isFemale = normalized === "female";

  // Traditional rule:
  // Male+Yang and Female+Yin -> forward; Male+Yin and Female+Yang -> backward.
  if (isMale) {
    return yearPolarity === "Yang";
  }
  if (isFemale) {
    return yearPolarity === "Yin";
  }

  // For non-binary/other, default forward for consistency.
  return true;
}

function calculateLuckStartAge(
  birthDateTime: DateTime,
  boundaries: SolarMonthBoundary[],
  isForward: boolean,
): number {
  const previous = [...boundaries]
    .reverse()
    .find((boundary) => boundary.instant <= birthDateTime);
  const next = boundaries.find((boundary) => boundary.instant > birthDateTime);

  const pivot = isForward ? next : previous;
  if (!pivot) {
    return 1;
  }

  const diffDays = Math.abs(pivot.instant.diff(birthDateTime, "days").days);

  // Traditional conversion: ~3 days after birth corresponds to 1 year luck-start age.
  const computedAge = Math.max(1, Math.round(diffDays / 3));
  return computedAge;
}


function getDayPillar(localDateStart: DateTime): Pillar {
  // Reference day for cycle alignment: 1984-02-02 as Jia-Zi.
  const base = DateTime.fromISO("1984-02-02T00:00", {
    zone: localDateStart.zoneName ?? "UTC",
  });
  const diffDays = Math.floor(localDateStart.diff(base, "days").days);
  const cycleIndex = mod(diffDays, 60);

  return {
    stem: STEMS[cycleIndex % 10],
    branch: BRANCHES[cycleIndex % 12],
  };
}

function getHourPillar(hour: number, dayStem: HeavenlyStem): Pillar {
  const hourBranchIndex = mod(Math.floor((hour + 1) / 2), 12);
  const dayStemIndex = STEMS.findIndex((stem) => stem.key === dayStem.key);
  const hourStemIndex = mod(dayStemIndex * 2 + hourBranchIndex, 10);

  return {
    stem: STEMS[hourStemIndex],
    branch: BRANCHES[hourBranchIndex],
  };
}

function calculateAnnualLuckPillars(
  luckPillars: LuckPillar[],
  birthYear: number,
): AnnualLuckPillar[] {
  const annualPillars: AnnualLuckPillar[] = [];

  // Calculate annual pillars across all available major luck decades.
  for (let decade = 0; decade < luckPillars.length; decade++) {
    const decadePillar = luckPillars[decade];

    for (let yearInDecade = 0; yearInDecade < 10; yearInDecade++) {
      const age = decadePillar.ageStart + yearInDecade;
      const year = birthYear + age;

      // Liu Nian (流年): annual pillar is determined by the calendar year's
      // position in the 60 Jiazi cycle, not relative to the decade pillar.
      const cycleIndex = mod(year - 4, 60);
      const yearlyStemIndex = cycleIndex % 10;
      const yearlyBranchIndex = cycleIndex % 12;

      const yearlyPillar: Pillar = {
        stem: STEMS[yearlyStemIndex],
        branch: BRANCHES[yearlyBranchIndex],
      };

      // Calculate monthly pillars for this year
      const monthlyPillars: MonthlyLuckPillar[] = [];
      const monthBranchIndex = yearlyBranchIndex;
      const monthStemStart = mod(yearlyStemIndex * 2 + monthBranchIndex, 10);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (let month = 0; month < 12; month++) {
        const monthlyStemIndex = mod(monthStemStart + month, 10);
        const monthlyBranchIndex = mod(monthBranchIndex + month, 12);

        monthlyPillars.push({
          month: month + 1,
          monthName: monthNames[month],
          pillar: {
            stem: STEMS[monthlyStemIndex],
            branch: BRANCHES[monthlyBranchIndex],
          },
        });
      }

      annualPillars.push({
        year,
        age,
        pillar: yearlyPillar,
        yearLabel: `${year} (Age ${age})`,
        monthlyPillars,
      });
    }
  }

  return annualPillars;
}

function analyzeHiddenStems(pillars: Pillar[]): PillarAnalysis[] {
  const analyses: PillarAnalysis[] = [];

  for (const pillar of pillars) {
    const branchKey = pillar.branch.key;
    const hiddenStemIndices = HIDDEN_STEMS_BY_BRANCH[branchKey] || [];
    const hiddenStems: HiddenStem[] = hiddenStemIndices.map((stemIndex, idx) => ({
      stem: STEMS[stemIndex],
      index: idx + 1,
    }));

    // Calculate total elements including hidden stems
    const totalElements: Record<Element, number> = {
      Wood: 0,
      Fire: 0,
      Earth: 0,
      Metal: 0,
      Water: 0,
    };

    totalElements[pillar.stem.element] += 1;
    totalElements[pillar.branch.element] += 1;

    for (const hidden of hiddenStems) {
      totalElements[hidden.stem.element] += 1;
    }

    analyses.push({
      pillar,
      hiddenStems,
      totalElements,
    });
  }

  return analyses;
}

function buildInterpretation({
  input,
  dayMaster,
  dominantElement,
  weakElement,
  elementCounts,
  polarityCounts,
  luckPillars,
  hiddenStemAnalysis,
}: {
  input: BaziInput;
  dayMaster: HeavenlyStem;
  dominantElement: Element;
  weakElement: Element;
  elementCounts: Record<Element, number>;
  polarityCounts: Record<Polarity, number>;
  luckPillars: LuckPillar[];
  hiddenStemAnalysis: PillarAnalysis[];
}): string[] {
  const dmTheme = ELEMENT_THEMES[dayMaster.element];
  const dominantTheme = ELEMENT_THEMES[dominantElement];
  const weakTheme = ELEMENT_THEMES[weakElement];
  const profileName = input.name?.trim() ? input.name.trim() : "This chart";

  const nurturingElement = ELEMENT_ORDER[(ELEMENT_ORDER.indexOf(dayMaster.element) + 4) % 5];
  const nurturingTheme = ELEMENT_THEMES[nurturingElement];

  const earlyLuck = luckPillars[0];
  const midLuck = luckPillars[3];
  const laterLuck = luckPillars[6];

  const dayAnalysis = hiddenStemAnalysis[2];
  const hiddenStemsText = dayAnalysis?.hiddenStems
    .map((hs) => `${hs.stem.pinyin} (${hs.stem.element})`)
    .join(", ");

  const lines: string[] = [];

  // Section 1: Day Master & Identity
  lines.push("## Day Master & Identity");
  lines.push(
    `${profileName} is led by a ${dayMaster.polarity} ${dayMaster.element} Day Master (${dayMaster.pinyin} ${dayMaster.chinese}). The Day Master is the core of a BaZi chart — it represents your fundamental nature, your instinctive way of processing the world, and the lens through which all other chart dynamics are filtered.`,
  );
  lines.push(dmTheme.personality);
  lines.push(
    `In terms of natural gifts, ${dayMaster.element} energy is associated with ${dmTheme.gifts}. Professionally, this element has affinity with ${dmTheme.career_affinity}. In relationships, you tend to be ${dmTheme.relationship_style}.`,
  );

  // Section 2: Element Balance
  lines.push("## Element Balance");
  lines.push(
    `Your chart is most concentrated in ${dominantElement} (${elementCounts[dominantElement]} occurrences across the four pillars). A strong ${dominantElement} presence amplifies ${dominantTheme.gifts}, giving you a noticeable edge in areas where these qualities are valued. However, excess ${dominantElement} can also manifest as ${dominantTheme.challenge} — particularly during years or decades where transiting energy further strengthens this element.`,
  );
  lines.push(
    `The element least represented in your chart is ${weakElement} (${elementCounts[weakElement]} occurrences). When ${weakElement} is underrepresented, you may find it harder to access ${weakTheme.gifts} naturally. To bring this area into better balance, focus on cultivating ${weakTheme.support}. Practically, this means incorporating ${weakTheme.lifestyle} into your routine.`,
  );
  lines.push(
    `A well-balanced chart draws strength from all five elements. Your current spread — Wood ${elementCounts.Wood}, Fire ${elementCounts.Fire}, Earth ${elementCounts.Earth}, Metal ${elementCounts.Metal}, Water ${elementCounts.Water} — reveals where your natural strengths lie and where conscious effort can fill the gaps.`,
  );

  // Section 3: Yin-Yang Polarity
  lines.push("## Yin-Yang Polarity");
  if (polarityCounts.Yang > polarityCounts.Yin) {
    lines.push(
      `Your chart carries a stronger Yang signature (${polarityCounts.Yang} Yang vs ${polarityCounts.Yin} Yin). This suggests outward drive, initiative, and action-oriented expression. You are likely more comfortable leading, starting new ventures, and making bold moves. The risk is overextension — remember that sustainable success requires rest, receptivity, and knowing when to pause before pushing forward.`,
    );
  } else if (polarityCounts.Yin > polarityCounts.Yang) {
    lines.push(
      `Your chart carries a stronger Yin signature (${polarityCounts.Yin} Yin vs ${polarityCounts.Yang} Yang). This suggests reflective depth, patience, and an internal processing style. You excel at strategy, listening, and reading situations before acting. The risk is inaction — be mindful not to wait so long for perfect conditions that opportunities pass you by.`,
    );
  } else {
    lines.push(
      `Your Yin-Yang split is balanced (${polarityCounts.Yang} Yang, ${polarityCounts.Yin} Yin), showing versatility between action and reflection. This is a relatively rare and flexible configuration — you can adapt your approach to what each situation demands, switching between initiative and patience as needed.`,
    );
  }

  // Section 4: Life Luck Cycles
  lines.push("## Life Luck Cycles");
  lines.push(
    `Your major luck pillars (Daiyun) divide your life into ten-year chapters, each carrying its own elemental signature that shapes the opportunities and challenges of that period. Understanding these cycles helps you work with the grain of time rather than against it.`,
  );
  if (earlyLuck && midLuck && laterLuck) {
    lines.push(
      `In the early cycle (ages ${earlyLuck.ageStart}–${earlyLuck.ageEnd}), ${earlyLuck.pillar.stem.element} energy sets the tone for your formative years — this influences your education, early ambitions, and foundational habits. The mid cycle (ages ${midLuck.ageStart}–${midLuck.ageEnd}) brings ${midLuck.pillar.stem.element} influence, often coinciding with career peaks, family building, and major life decisions. The later cycle (ages ${laterLuck.ageStart}–${laterLuck.ageEnd}) carries ${laterLuck.pillar.stem.element} energy, shaping your legacy, health focus, and philosophical outlook.`,
    );
    lines.push(
      `The element progression across these key decades — ${earlyLuck.pillar.stem.element}, ${midLuck.pillar.stem.element}, ${laterLuck.pillar.stem.element} — reveals your life's energetic arc. Pay special attention to decades where the luck pillar element generates or supports your Day Master element (${dayMaster.element}), as these tend to be periods of flow and opportunity.`,
    );
  }

  // Section 5: Hidden Stems Insight
  lines.push("## Hidden Stems Insight");
  lines.push(
    `Each earthly branch in your chart contains hidden stems — concealed elemental influences that add depth and subtlety to your chart. These hidden layers affect timing, compatibility, and the way each pillar's energy manifests in practice.`,
  );
  if (hiddenStemsText) {
    lines.push(
      `Your Day branch (the most personal pillar) conceals: ${hiddenStemsText}. These hidden stems reveal additional dimensions of your inner nature that may not be immediately apparent. They often activate during specific years or decades when transiting energy resonates with them, creating periods of heightened self-awareness or unexpected developments.`,
    );
  } else {
    lines.push(
      `Your Day branch contains subtle hidden influences that add timing layers to your chart. These elements become relevant during specific transits and can signal periods of change, opportunity, or introspection.`,
    );
  }

  // Section 6: Nurturing Element
  lines.push("## Nurturing Element");
  lines.push(
    `Based on the five-element production cycle, ${nurturingElement} is the element that generates and sustains your Day Master (${dayMaster.element}). Think of it as the fuel your chart needs to function optimally. When ${nurturingElement} is present in your environment, relationships, or daily habits, you tend to feel more grounded, resourceful, and effective.`,
  );
  lines.push(
    `To strengthen this supportive connection, incorporate ${nurturingTheme.lifestyle} into your routine. Seek out environments and people that embody ${nurturingElement} qualities: ${nurturingTheme.gifts}. This isn't about forcing change — it's about gently leaning toward what nourishes your core nature.`,
  );

  return lines;
}

function getDominantElement(elementCounts: Record<Element, number>): Element {
  return ELEMENT_ORDER.reduce((best, current) =>
    elementCounts[current] > elementCounts[best] ? current : best,
  );
}

function getWeakElement(elementCounts: Record<Element, number>): Element {
  return ELEMENT_ORDER.reduce((weakest, current) =>
    elementCounts[current] < elementCounts[weakest] ? current : weakest,
  );
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

