import { DateTime } from "luxon";
import { type Astrolabe, type Palace, type Star, ziwei } from "@ziweijs/core";

export type ZiWeiInput = {
  name?: string;
  gender: "male" | "female";
  birthDate: string;
  birthTime: string;
  timeZone: string;
  longitude?: number;
  useTrueSolarTime?: boolean;
};

export type ZiWeiPalace = {
  key: string;
  name: string;
  branch: string;
  stem: string;
  majorStars: Star[];
  minorStars: Star[];
  horoscopeRanges: [number, number];
  isLaiYin: boolean;
};

export type ZiWeiChart = {
  name?: string;
  solarDate: string;
  solarDateByTrue?: string;
  lunisolarDate: string;
  zodiac: string;
  birthYearStem: string;
  birthYearBranch: string;
  fiveElementName: string;
  ziweiBranch: string;
  mainPalaceBranch: string;
  hour: string;
  hourRange: string;
  horoscopeDirection: 1 | -1;
  palaces: ZiWeiPalace[];
  interpretation: string[];
  notes: string[];
};

const PALACE_SUMMARY_MAP: Record<string, string> = {
  MING: "core personality, life direction, and how you naturally express yourself",
  XIONG_DI: "how you work with peers, allies, and siblings",
  FU_QI: "partnership style, attraction patterns, and intimate relationship themes",
  ZI_NV: "creativity, younger people, and how your legacy extends outward",
  CAI_BO: "money style, value creation, and material strategy",
  JI_E: "stress patterns, body maintenance, and recovery habits",
  QIAN_YI: "movement, relocation, and how the world responds to you outside your base",
  JIAO_YOU: "friendships, networks, and collaborators",
  GUAN_LU: "career calling, public role, and professional structure",
  TIAN_ZHAI: "home, property, and long-term stability",
  FU_DE: "inner happiness, spiritual reserves, and emotional restoration",
  FU_MU: "guidance, elders, roots, and inherited expectations",
};

const STAR_MEANINGS: Record<string, { gifts: string; challenge: string }> = {
  ZI_WEI: {
    gifts: "leadership presence, central vision, and the ability to organize life around purpose",
    challenge: "carrying too much responsibility or expecting certainty before moving",
  },
  TIAN_JI: {
    gifts: "adaptability, strategy, curiosity, and pattern recognition",
    challenge: "overthinking, indecision, or restless direction changes",
  },
  TAI_YANG: {
    gifts: "visibility, generosity, confidence, and outward momentum",
    challenge: "burnout, pride, or needing external validation",
  },
  WU_QU: {
    gifts: "discipline, execution, financial seriousness, and resilience",
    challenge: "emotional rigidity or becoming overly transactional",
  },
  TIAN_TONG: {
    gifts: "kindness, emotional intelligence, and easing tension for others",
    challenge: "comfort-seeking or postponing difficult choices",
  },
  LIAN_ZHEN: {
    gifts: "intensity, charisma, and strong ethical or emotional conviction",
    challenge: "inner conflict, attachment, or all-or-nothing reactions",
  },
  TIAN_FU: {
    gifts: "resource stewardship, steadiness, and protective support",
    challenge: "becoming too cautious or carrying other people's burdens",
  },
  TAI_YIN: {
    gifts: "intuition, refinement, sensitivity, and quiet depth",
    challenge: "withdrawing too much or becoming unclear about needs",
  },
  TAN_LANG: {
    gifts: "magnetism, appetite for life, and social opportunity",
    challenge: "overindulgence, distraction, or chasing novelty",
  },
  JU_MEN: {
    gifts: "analysis, truth-telling, research, and verbal influence",
    challenge: "worry, criticism, or conflict through language",
  },
  TIAN_XIANG: {
    gifts: "balance, diplomacy, aesthetics, and relational intelligence",
    challenge: "people-pleasing or losing your center in consensus",
  },
  TIAN_LIANG: {
    gifts: "protection, wisdom, mentorship, and moral clarity",
    challenge: "martyrdom, excessive caution, or heavy idealism",
  },
  QI_SHA: {
    gifts: "boldness, decisiveness, and breakthrough courage",
    challenge: "volatility, pressure, or acting before grounding",
  },
  PO_JUN: {
    gifts: "reinvention, disruption, and the ability to cut through stagnation",
    challenge: "instability, impatience, or burning structures too early",
  },
  ZUO_FU: {
    gifts: "support, assistance, and dependable collaboration",
    challenge: "leaning too much on external help",
  },
  YOU_BI: {
    gifts: "timely allies, refinement, and graceful support",
    challenge: "hesitation through excessive courtesy",
  },
  WEN_CHANG: {
    gifts: "communication, study, expression, and elegant thought",
    challenge: "perfectionism or living too much in the head",
  },
  WEN_QU: {
    gifts: "artistry, persuasion, and emotional intelligence in language",
    challenge: "mixed signals or romanticizing situations",
  },
};

export function calculateZiWei(input: ZiWeiInput): ZiWeiChart {
  const localTime = DateTime.fromISO(`${input.birthDate}T${input.birthTime}`, {
    zone: input.timeZone,
  });

  if (!localTime.isValid) {
    throw new Error("Unable to parse birth date and time for Zi Wei Dou Shu.");
  }

  const timezoneOffset = localTime.offset / 60;
  const longitude = input.longitude ?? timezoneOffset * 15;

  const astrolabe = ziwei.bySolar({
    name: input.name?.trim() || "Seeker",
    gender: input.gender,
    date: localTime.toJSDate(),
    language: "zh-CN",
    longitude,
    timezoneOffset,
    useTrueSolarTime: input.useTrueSolarTime ?? true,
  });

  const palaces = astrolabe.palaces.map(mapPalace);
  const interpretation = buildInterpretation(astrolabe, palaces, input.name?.trim() || undefined);

  // The library's getSolarDateText has a bug: it uses Date.getDay() (day-of-week)
  // instead of Date.getDate() (day-of-month), producing wrong solar date strings.
  // We format the dates ourselves to work around this.
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const solarDate = fmtDate(localTime.toJSDate());

  return {
    name: input.name?.trim() || undefined,
    solarDate,
    solarDateByTrue: astrolabe.solarDateByTrue
      ? solarDate.split(" ")[0] + " " + astrolabe.solarDateByTrue.split(" ")[1]
      : undefined,
    lunisolarDate: astrolabe.lunisolarDate,
    zodiac: astrolabe.zodiac,
    birthYearStem: astrolabe.birthYearStem,
    birthYearBranch: astrolabe.birthYearBranch,
    fiveElementName: astrolabe.fiveElementName,
    ziweiBranch: astrolabe.ziweiBranch,
    mainPalaceBranch: astrolabe.mainPalaceBranch,
    hour: astrolabe.hour,
    hourRange: astrolabe.hourRange,
    horoscopeDirection: astrolabe.horoscopeDirection,
    palaces,
    interpretation,
    notes: [
      "Zi Wei Dou Shu chart is generated from a dedicated charting library using solar birth data.",
      input.useTrueSolarTime ?? true
        ? `True solar time is enabled. Longitude used: ${longitude.toFixed(2)}°.`
        : `Standard local civil time is used. Longitude reference: ${longitude.toFixed(2)}°.`,
      "Interpretation here is a structured reading aid and should be treated as a reflective tool, not a deterministic verdict.",
    ],
  };
}

function mapPalace(palace: Palace): ZiWeiPalace {
  return {
    key: palace.key,
    name: palace.name,
    branch: palace.branch,
    stem: palace.stem,
    majorStars: palace.majorStars,
    minorStars: palace.minorStars,
    horoscopeRanges: palace.horoscopeRanges,
    isLaiYin: palace.isLaiYin,
  };
}

function buildInterpretation(
  astrolabe: Astrolabe,
  palaces: ZiWeiPalace[],
  name?: string,
): string[] {
  const profileName = name || "This chart";
  const lines: string[] = [];

  const lifePalace = mustFindPalace(palaces, "MING");
  const careerPalace = mustFindPalace(palaces, "GUAN_LU");
  const wealthPalace = mustFindPalace(palaces, "CAI_BO");
  const spousePalace = mustFindPalace(palaces, "FU_QI");
  const spiritPalace = mustFindPalace(palaces, "FU_DE");

  const lifeStars = summarizeStars(lifePalace);
  const careerStars = summarizeStars(careerPalace);
  const wealthStars = summarizeStars(wealthPalace);
  const spouseStars = summarizeStars(spousePalace);
  const spiritStars = summarizeStars(spiritPalace);

  // Foundation
  lines.push("## Foundation & Destiny");
  lines.push(
    `${profileName} carries a ${astrolabe.fiveElementName} foundation, with the Life Palace anchored in the ${lifePalace.branch} branch. The Five Element Bureau (五行局) determines the pace and style of your destiny — it sets the energetic baseline that all twelve palaces operate within. This foundation shapes how quickly your chart matures and when key life themes begin to activate.`,
  );
  lines.push(
    `Your chart's Zi Wei star is rooted in ${astrolabe.ziweiBranch}, and the major-luck flow moves ${astrolabe.horoscopeDirection === 1 ? "forward (clockwise)" : "in reverse (counter-clockwise)"} through the palaces. This directional flow determines the sequence in which life themes unfold across your decades.`,
  );

  // Life Palace
  lines.push("## Life Palace · 命宫");
  lines.push(
    `The Life Palace is the most central palace in your chart — it represents your core personality, natural temperament, and the way you instinctively approach life. It is the lens through which all other palaces are filtered.`,
  );
  lines.push(
    `Your Life Palace is emphasized by ${lifeStars.names}. This combination points toward ${lifeStars.gifts}. The challenge to be mindful of is ${lifeStars.challenge}. The Life Palace decade begins around ages ${lifePalace.horoscopeRanges[0]}–${lifePalace.horoscopeRanges[1]}, a formative period that sets the tone for your self-identity.`,
  );

  // Career Palace
  lines.push("## Career Palace · 官禄宫");
  lines.push(
    `The Career Palace reveals your professional calling, the kind of work environment where you thrive, and how you express yourself in your public role. It speaks to authority, ambition, and vocational purpose.`,
  );
  lines.push(
    `Career themes appear through ${careerPalace.name} in ${careerPalace.branch}, where ${careerStars.names} suggest ${careerStars.gifts}. The professional tension to manage is ${careerStars.challenge}. Pay attention to career palace decades for major professional shifts.`,
  );

  // Wealth Palace
  lines.push("## Wealth Palace · 财帛宫");
  lines.push(
    `The Wealth Palace governs your relationship with money, material resources, and value creation. It reveals not just earning potential, but your spending patterns, investment instincts, and overall financial philosophy.`,
  );
  lines.push(
    `With ${wealthStars.names} in your Wealth Palace, your money pattern tends toward ${wealthStars.gifts}. Financial wellbeing improves most when you avoid ${wealthStars.challenge}. This palace also indicates whether wealth comes through steady accumulation or strategic risks.`,
  );

  // Relationship Palace
  lines.push("## Relationship Palace · 夫妻宫");
  lines.push(
    `The Spouse Palace describes your partnership style, the kind of partner you are drawn to, and the dynamics that define your most intimate relationships. It reveals both attraction patterns and the deeper relational lessons your chart carries.`,
  );
  lines.push(
    `${spouseStars.names} in your Spouse Palace often indicate ${spouseStars.gifts}. The relational growth edge is to soften ${spouseStars.challenge}. This palace activates most strongly during its governing decade and during years when transiting stars interact with it.`,
  );

  // Spiritual Palace
  lines.push("## Spiritual Palace · 福德宫");
  lines.push(
    `The Happiness and Virtue Palace (Fu De) reflects your inner world — your emotional baseline, spiritual inclinations, and capacity for contentment. It reveals how you restore yourself and what gives you a sense of meaning beyond material success.`,
  );
  lines.push(
    `${spiritStars.names} here suggest your spirit restores itself through ${spiritStars.gifts}. When depleted, the chart may lean into ${spiritStars.challenge}. Nurturing this palace through mindfulness, creative pursuits, or spiritual practice strengthens your overall resilience.`,
  );

  // Remaining palaces
  const secondaryPalaces: Array<{ key: string; zh: string; en: string }> = [
    { key: "XIONG_DI", zh: "兄弟宫", en: "Siblings Palace" },
    { key: "ZI_NV", zh: "子女宫", en: "Children Palace" },
    { key: "JI_E", zh: "疾厄宫", en: "Health Palace" },
    { key: "QIAN_YI", zh: "迁移宫", en: "Travel Palace" },
    { key: "JIAO_YOU", zh: "交友宫", en: "Friends Palace" },
    { key: "TIAN_ZHAI", zh: "田宅宫", en: "Property Palace" },
    { key: "FU_MU", zh: "父母宫", en: "Parents Palace" },
  ];

  for (const sp of secondaryPalaces) {
    const palace = palaces.find((p) => p.key === sp.key);
    if (!palace) continue;
    const stars = summarizeStars(palace);
    const palaceDesc = PALACE_SUMMARY_MAP[sp.key] || sp.en;

    lines.push(`## ${sp.en} · ${sp.zh}`);
    lines.push(
      `This palace governs ${palaceDesc}. ${stars.names} here suggest ${stars.gifts}. Be mindful of ${stars.challenge}. This palace activates during the decade covering ages ${palace.horoscopeRanges[0]}–${palace.horoscopeRanges[1]}.`,
    );
  }

  // Luck Flow & Timing
  lines.push("## Luck Flow & Timing");
  lines.push(
    `Each palace governs a specific decade of your life, and the luck flow direction determines the sequence. With a ${astrolabe.horoscopeDirection === 1 ? "forward" : "reverse"} flow, review which palace rules each coming decade to anticipate when career, relationships, health, or relocation themes come into sharper focus. The interaction between your natal stars and the decade palace creates a unique energetic signature for each ten-year chapter of your life.`,
  );

  return lines;
}

function mustFindPalace(palaces: ZiWeiPalace[], key: string): ZiWeiPalace {
  const match = palaces.find((palace) => palace.key === key);
  if (!match) {
    throw new Error(`Missing required Zi Wei palace: ${key}`);
  }

  return match;
}

function summarizeStars(palace: ZiWeiPalace): {
  names: string;
  gifts: string;
  challenge: string;
} {
  const stars = palace.majorStars.length > 0 ? palace.majorStars : palace.minorStars;
  if (stars.length === 0) {
    return {
      names: `${palace.name} without dominant listed stars`,
      gifts: PALACE_SUMMARY_MAP[palace.key] || "this life area",
      challenge: `uncertainty or mixed emphasis in ${palace.name}`,
    };
  }

  const names = stars.map((star) => star.name).join("、");
  const meanings = stars.map((star) => STAR_MEANINGS[star.key] ?? defaultStarMeaning(palace, star));

  return {
    names,
    gifts: meanings.map((item) => item.gifts).join("; "),
    challenge: meanings.map((item) => item.challenge).join("; "),
  };
}

function defaultStarMeaning(palace: ZiWeiPalace, star: Star): { gifts: string; challenge: string } {
  return {
    gifts: `${star.name} strengthens ${PALACE_SUMMARY_MAP[palace.key] || palace.name}`,
    challenge: `over-identifying with ${star.name} themes in ${palace.name}`,
  };
}
