import { calculateBazi, type BaziInput, type BaziChart, type Pillar, type Element, type HeavenlyStem, type EarthlyBranch } from "./bazi";

// --- Types ---

export type CompatInput = { male: BaziInput; female: BaziInput };

export type CompatFactor = {
  name: string;
  nameZh: string;
  score: number;
  maxScore: number;
  description: string;
  detail: string;
};

export type CompatResult = {
  maleChart: BaziChart;
  femaleChart: BaziChart;
  factors: CompatFactor[];
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  overallRating: string;
  interpretation: string[];
};

// --- Na Yin Table (60 Jiazi → Element) ---

const NA_YIN_ELEMENTS: Element[] = [
  "Metal", "Metal", "Fire", "Fire", "Wood", "Wood", "Earth", "Earth", "Metal", "Metal",
  "Fire", "Fire", "Wood", "Wood", "Water", "Water", "Earth", "Earth", "Metal", "Metal",
  "Wood", "Wood", "Water", "Water", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal",
  "Fire", "Fire", "Wood", "Wood", "Water", "Water", "Earth", "Earth", "Fire", "Fire",
  "Earth", "Earth", "Metal", "Metal", "Fire", "Fire", "Wood", "Wood", "Water", "Water",
  "Earth", "Earth", "Wood", "Wood", "Water", "Water", "Metal", "Metal", "Earth", "Earth",
];

const NA_YIN_NAMES: string[] = [
  "海中金", "海中金", "爐中火", "爐中火", "大林木", "大林木", "路旁土", "路旁土", "劍鋒金", "劍鋒金",
  "山頭火", "山頭火", "澗下水", "澗下水", "城頭土", "城頭土", "白蠟金", "白蠟金", "楊柳木", "楊柳木",
  "泉中水", "泉中水", "屋上土", "屋上土", "霹靂火", "霹靂火", "松柏木", "松柏木", "長流水", "長流水",
  "沙中金", "沙中金", "山下火", "山下火", "平地木", "平地木", "壁上土", "壁上土", "金箔金", "金箔金",
  "覆燈火", "覆燈火", "天河水", "天河水", "大驛土", "大驛土", "釵釧金", "釵釧金", "桑柘木", "桑柘木",
  "大溪水", "大溪水", "沙中土", "沙中土", "天上火", "天上火", "石榴木", "石榴木", "大海水", "大海水",
];

// --- Five Element Relationships ---

function elementRelation(a: Element, b: Element): "same" | "generates" | "generated" | "controls" | "controlled" {
  if (a === b) return "same";
  const gen: Record<Element, Element> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
  if (gen[a] === b) return "generates";
  if (gen[b] === a) return "generated";
  const ctrl: Record<Element, Element> = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };
  if (ctrl[a] === b) return "controls";
  return "controlled";
}

// --- Branch Relationships ---

// Branch index: 0=Zi(Rat), 1=Chou(Ox), 2=Yin(Tiger)...11=Hai(Pig)

const SIX_HARMONIES: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const THREE_HARMONIES: number[][] = [[0, 4, 8], [2, 6, 10], [3, 7, 11], [1, 5, 9]];
const SIX_CLASHES: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
const SIX_HARMS: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const THREE_PUNISHMENTS: [number, number][] = [[2, 5], [5, 8], [2, 8], [1, 10], [10, 7], [1, 7]];
const SELF_PUNISHMENTS: number[] = [0, 3, 6, 9];
const SIX_DESTRUCTIONS: [number, number][] = [[0, 9], [1, 10], [2, 11], [3, 8], [4, 7], [5, 6]];

function getBranchIndex(branch: EarthlyBranch): number {
  const keys = ["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"];
  return keys.indexOf(branch.key);
}

function hasPair(pairs: [number, number][], a: number, b: number): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function hasTriangle(triangles: number[][], a: number, b: number): boolean {
  return triangles.some((tri) => tri.includes(a) && tri.includes(b));
}

type BranchRelType = "six-harmony" | "three-harmony" | "clash" | "harm" | "punishment" | "destruction" | "none";

function getBranchRelationships(a: number, b: number): BranchRelType[] {
  const rels: BranchRelType[] = [];
  if (hasPair(SIX_HARMONIES, a, b)) rels.push("six-harmony");
  if (hasTriangle(THREE_HARMONIES, a, b)) rels.push("three-harmony");
  if (hasPair(SIX_CLASHES, a, b)) rels.push("clash");
  if (hasPair(SIX_HARMS, a, b)) rels.push("harm");
  if (hasPair(THREE_PUNISHMENTS, a, b)) rels.push("punishment");
  if (SELF_PUNISHMENTS.includes(a) && a === b) rels.push("punishment");
  if (hasPair(SIX_DESTRUCTIONS, a, b)) rels.push("destruction");
  if (rels.length === 0) rels.push("none");
  return rels;
}

function branchRelScore(rels: BranchRelType[]): number {
  let score = 0;
  for (const r of rels) {
    switch (r) {
      case "six-harmony": score += 3; break;
      case "three-harmony": score += 2; break;
      case "clash": score -= 3; break;
      case "harm": score -= 2; break;
      case "punishment": score -= 2; break;
      case "destruction": score -= 1; break;
    }
  }
  return Math.max(-3, Math.min(3, score));
}

const REL_LABELS: Record<BranchRelType, { zh: string; en: string }> = {
  "six-harmony": { zh: "六合", en: "Six Harmony" },
  "three-harmony": { zh: "三合", en: "Three Harmony" },
  clash: { zh: "六冲", en: "Clash" },
  harm: { zh: "六害", en: "Harm" },
  punishment: { zh: "三刑", en: "Punishment" },
  destruction: { zh: "六破", en: "Destruction" },
  none: { zh: "平", en: "Neutral" },
};

// --- Factor Analyzers ---

function analyzeDayMaster(maleChart: BaziChart, femaleChart: BaziChart): CompatFactor {
  const mEl = maleChart.dayMaster.element;
  const fEl = femaleChart.dayMaster.element;
  const rel = elementRelation(mEl, fEl);

  let score: number;
  let description: string;
  switch (rel) {
    case "same":
      score = 2;
      description = `Both Day Masters are ${mEl} — mutual understanding and shared values, though potential competition.`;
      break;
    case "generates":
      score = 3;
      description = `Male ${mEl} generates Female ${fEl} — nurturing, supportive dynamic where one naturally sustains the other.`;
      break;
    case "generated":
      score = 3;
      description = `Female ${fEl} generates Male ${mEl} — a supportive flow where one partner naturally nurtures the other.`;
      break;
    case "controls":
      score = -1;
      description = `Male ${mEl} controls Female ${fEl} — can indicate structure but may create power imbalance.`;
      break;
    case "controlled":
      score = -1;
      description = `Female ${fEl} controls Male ${mEl} — can indicate tension if unchecked, but may provide needed discipline.`;
      break;
  }

  return {
    name: "Day Master Interaction",
    nameZh: "日主關係",
    score,
    maxScore: 3,
    description,
    detail: `Male Day Master: ${maleChart.dayMaster.chinese} ${maleChart.dayMaster.pinyin} (${mEl})\nFemale Day Master: ${femaleChart.dayMaster.chinese} ${femaleChart.dayMaster.pinyin} (${fEl})\nRelationship: ${rel}`,
  };
}

function analyzeBranchPillar(malePillar: Pillar, femalePillar: Pillar, pillarName: string, pillarNameZh: string): CompatFactor {
  const mIdx = getBranchIndex(malePillar.branch);
  const fIdx = getBranchIndex(femalePillar.branch);
  const rels = getBranchRelationships(mIdx, fIdx);
  const score = branchRelScore(rels);
  const relLabels = rels.filter(r => r !== "none").map(r => `${REL_LABELS[r].zh} ${REL_LABELS[r].en}`);

  let description: string;
  if (score >= 2) description = `Strong harmony in ${pillarName} pillars — ${relLabels.join(", ")}.`;
  else if (score > 0) description = `Positive connection in ${pillarName} pillars — ${relLabels.join(", ")}.`;
  else if (score === 0) description = `Neutral relationship in ${pillarName} pillars — no major conflict or harmony.`;
  else if (score > -2) description = `Mild tension in ${pillarName} pillars — ${relLabels.join(", ")}.`;
  else description = `Significant conflict in ${pillarName} pillars — ${relLabels.join(", ")}.`;

  return {
    name: `${pillarName} Branch`,
    nameZh: `${pillarNameZh}支`,
    score,
    maxScore: 3,
    description,
    detail: `Male: ${malePillar.branch.chinese} ${malePillar.branch.animal}\nFemale: ${femalePillar.branch.chinese} ${femalePillar.branch.animal}\nRelationships: ${relLabels.length ? relLabels.join(", ") : "None (neutral)"}`,
  };
}

function analyzeElementComplement(maleChart: BaziChart, femaleChart: BaziChart): CompatFactor {
  const mWeak = maleChart.weakElement;
  const fWeak = femaleChart.weakElement;
  const mDom = maleChart.dominantElement;
  const fDom = femaleChart.dominantElement;

  let score = 0;
  const notes: string[] = [];

  // Check if male's dominant helps female's weak
  if (elementRelation(mDom, fWeak) === "generates" || mDom === fWeak) {
    score += 1;
    notes.push(`Male's strong ${mDom} supports Female's weak ${fWeak}`);
  }
  // Check if female's dominant helps male's weak
  if (elementRelation(fDom, mWeak) === "generates" || fDom === mWeak) {
    score += 1;
    notes.push(`Female's strong ${fDom} supports Male's weak ${mWeak}`);
  }
  // Penalty if both are weak in the same element with no compensation
  if (mWeak === fWeak) {
    score -= 1;
    notes.push(`Both lack ${mWeak} — shared vulnerability`);
  }

  const description = notes.length > 0
    ? notes.join("; ") + "."
    : "No significant elemental complementarity or conflict.";

  return {
    name: "Elemental Complementarity",
    nameZh: "五行互補",
    score: Math.max(-3, Math.min(3, score)),
    maxScore: 2,
    description,
    detail: `Male dominant: ${mDom}, weak: ${mWeak}\nFemale dominant: ${fDom}, weak: ${fWeak}`,
  };
}

function analyzeYinYangBalance(maleChart: BaziChart, femaleChart: BaziChart): CompatFactor {
  // Classical ideal: male more Yang, female more Yin
  const mYang = maleChart.polarityCounts.Yang;
  const fYin = femaleChart.polarityCounts.Yin;
  const totalPillars = 8; // 4 stems each

  // Score based on complementary polarity distribution
  let score = 0;
  if (mYang >= 3 && fYin >= 3) {
    score = 2; // Classical ideal
  } else if (mYang >= 2 && fYin >= 2) {
    score = 1;
  } else if (maleChart.polarityCounts.Yin > maleChart.polarityCounts.Yang &&
             femaleChart.polarityCounts.Yang > femaleChart.polarityCounts.Yin) {
    score = 0; // Reversed but balanced
  } else {
    score = -1; // Both heavily same polarity
  }

  const description = score >= 2
    ? "Excellent Yin-Yang complementarity — classical male Yang / female Yin balance."
    : score >= 1
    ? "Good polarity balance between the charts."
    : score === 0
    ? "Reversed but balanced polarity — non-traditional but workable."
    : "Both charts lean toward the same polarity — may need conscious effort for balance.";

  return {
    name: "Yin-Yang Balance",
    nameZh: "陰陽平衡",
    score,
    maxScore: 2,
    description,
    detail: `Male: ${maleChart.polarityCounts.Yang} Yang / ${maleChart.polarityCounts.Yin} Yin\nFemale: ${femaleChart.polarityCounts.Yang} Yang / ${femaleChart.polarityCounts.Yin} Yin`,
  };
}

function getSexagenaryIndex(pillar: Pillar): number {
  const stems = ["jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui"];
  const branches = ["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"];
  const sIdx = stems.indexOf(pillar.stem.key);
  const bIdx = branches.indexOf(pillar.branch.key);
  // Sexagenary index: find n where n%10=sIdx and n%12=bIdx (both same parity)
  for (let i = 0; i < 60; i++) {
    if (i % 10 === sIdx && i % 12 === bIdx) return i;
  }
  return 0;
}

function analyzeNaYin(maleChart: BaziChart, femaleChart: BaziChart): CompatFactor {
  const mIdx = getSexagenaryIndex(maleChart.yearPillar);
  const fIdx = getSexagenaryIndex(femaleChart.yearPillar);
  const mElement = NA_YIN_ELEMENTS[mIdx];
  const fElement = NA_YIN_ELEMENTS[fIdx];
  const mName = NA_YIN_NAMES[mIdx];
  const fName = NA_YIN_NAMES[fIdx];

  const rel = elementRelation(mElement, fElement);
  let score: number;
  switch (rel) {
    case "same": score = 2; break;
    case "generates": case "generated": score = 2; break;
    case "controls": case "controlled": score = -1; break;
    default: score = 0;
  }

  const description = score >= 2
    ? `Na Yin elements are harmonious (${mElement} & ${fElement}) — compatible life energy.`
    : score < 0
    ? `Na Yin elements conflict (${mElement} controls ${fElement}) — underlying tension in life direction.`
    : `Na Yin elements are neutral.`;

  return {
    name: "Na Yin Compatibility",
    nameZh: "納音五行",
    score,
    maxScore: 2,
    description,
    detail: `Male: ${mName} (${mElement})\nFemale: ${fName} (${fElement})\nRelationship: ${rel}`,
  };
}

function analyzeDayMasterStrength(maleChart: BaziChart, femaleChart: BaziChart): CompatFactor {
  // Approximate strength: count of elements that support day master
  function strength(chart: BaziChart): number {
    const dm = chart.dayMaster.element;
    const gen: Record<Element, Element> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
    const mother = Object.entries(gen).find(([, v]) => v === dm)?.[0] as Element | undefined;
    return (chart.elementCounts[dm] || 0) + (mother ? (chart.elementCounts[mother] || 0) : 0);
  }

  const mStr = strength(maleChart);
  const fStr = strength(femaleChart);
  const diff = Math.abs(mStr - fStr);

  let score: number;
  let description: string;
  if (diff <= 1) {
    score = 2;
    description = "Both Day Masters have similar strength — balanced dynamic.";
  } else if (diff <= 3) {
    score = 1;
    description = "One Day Master is moderately stronger — complementary rather than competitive.";
  } else {
    score = 0;
    description = "Significant strength difference — one partner may dominate energetically.";
  }

  return {
    name: "Day Master Strength",
    nameZh: "日主強弱",
    score,
    maxScore: 2,
    description,
    detail: `Male strength index: ${mStr}\nFemale strength index: ${fStr}\nDifference: ${diff}`,
  };
}

// --- Main Export ---

export function calculateCompatibility(input: CompatInput): CompatResult {
  const maleChart = calculateBazi(input.male);
  const femaleChart = calculateBazi(input.female);

  const factors: CompatFactor[] = [
    analyzeDayMaster(maleChart, femaleChart),
    analyzeBranchPillar(maleChart.dayPillar, femaleChart.dayPillar, "Day (Marriage Palace)", "日柱"),
    analyzeBranchPillar(maleChart.yearPillar, femaleChart.yearPillar, "Year (Zodiac)", "年柱"),
    analyzeBranchPillar(maleChart.monthPillar, femaleChart.monthPillar, "Month (Social)", "月柱"),
    analyzeElementComplement(maleChart, femaleChart),
    analyzeYinYangBalance(maleChart, femaleChart),
    analyzeNaYin(maleChart, femaleChart),
    analyzeDayMasterStrength(maleChart, femaleChart),
  ];

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
  const maxPossibleScore = factors.reduce((sum, f) => sum + f.maxScore, 0);
  // Normalize: shift from [-maxNeg, maxPos] to [0, 100]
  const minPossibleScore = factors.reduce((sum, f) => sum + (-f.maxScore), 0);
  const range = maxPossibleScore - minPossibleScore;
  const percentage = Math.round(((totalScore - minPossibleScore) / range) * 100);

  let overallRating: string;
  if (percentage >= 80) overallRating = "Excellent";
  else if (percentage >= 60) overallRating = "Good";
  else if (percentage >= 40) overallRating = "Moderate";
  else overallRating = "Challenging";

  const interpretation = generateInterpretation(maleChart, femaleChart, factors, percentage, overallRating);

  return { maleChart, femaleChart, factors, totalScore, maxPossibleScore, percentage, overallRating, interpretation };
}

function generateInterpretation(
  maleChart: BaziChart, femaleChart: BaziChart,
  factors: CompatFactor[], percentage: number, rating: string
): string[] {
  const lines: string[] = [];

  lines.push("## Overall Compatibility / 整體相合度");
  lines.push(
    `This pairing scores ${percentage}% overall (${rating}). ` +
    (percentage >= 70
      ? "The charts show strong natural affinity and mutual support."
      : percentage >= 50
      ? "The charts show a workable connection with areas for growth."
      : "The charts indicate significant differences that require understanding and effort.")
  );

  lines.push("## Day Master Relationship / 日主關係");
  const dmFactor = factors[0];
  lines.push(`${dmFactor.description} The Day Master represents your core identity — this interaction sets the tone for how you relate at the deepest level.`);

  lines.push("## Marriage Palace / 日柱婚姻宮");
  const dayFactor = factors[1];
  lines.push(`${dayFactor.description} The Day Pillar branch is traditionally called the "Marriage Palace" (婚姻宮) and is considered the most important pillar for relationship compatibility.`);

  lines.push("## Year Pillar & Social Image / 年柱社會面");
  const yearFactor = factors[2];
  lines.push(`${yearFactor.description} The Year Pillar reflects family background and social presentation — harmony here suggests compatible family dynamics.`);

  lines.push("## Elemental Balance / 五行平衡");
  const elemFactor = factors[4];
  const yyFactor = factors[5];
  lines.push(`${elemFactor.description} ${yyFactor.description}`);

  lines.push("## Na Yin Life Energy / 納音");
  const naYinFactor = factors[6];
  lines.push(`${naYinFactor.description} Na Yin represents the overarching life energy derived from the year of birth — compatibility here indicates aligned life direction.`);

  lines.push("## Advice / 建議");
  if (percentage >= 70) {
    lines.push("This is a naturally harmonious pairing. Focus on maintaining balance and not taking the easy rapport for granted. Nurture the connection actively even when it flows naturally.");
  } else if (percentage >= 50) {
    lines.push("This pairing has solid foundations with some areas needing conscious attention. Communication and mutual respect for differences will strengthen the bond over time. Consider which elements each of you brings to complement the other.");
  } else {
    lines.push("This pairing faces natural challenges that require awareness and effort. The differences can become strengths if both partners commit to understanding each other's needs and communication styles. Consider consulting the elemental balance to find shared activities that nurture both charts.");
  }

  return lines;
}
