// ─── Types ─────────────────────────────────────────────────────────────

export interface NumerologyInput {
  name?: string;
  birthDate: string;       // YYYY-MM-DD
  birthTime?: string;      // HH:mm
  gender: "male" | "female";
}

export interface LoShuArrow {
  name: string;
  nameZh: string;
  numbers: number[];
  meaning: string;
}

export interface NumberMeaning {
  number: number;
  chinese: string;
  pinyin: string;
  meaning: string;
}

export interface NumerologyChart {
  // Western
  lifePathNumber: number;
  expressionNumber: number | null;
  soulUrgeNumber: number | null;
  personalityNumber: number | null;
  birthdayNumber: number;
  personalYearNumber: number;

  // Chinese
  loShuGrid: number[][];         // 3×3 grid with digit counts
  loShuArrows: LoShuArrow[];
  missingNumbers: number[];
  dominantElement: string;
  elementBalance: Record<string, number>;
  birthHourElement?: string;
  numberMeanings: NumberMeaning[];

  // Bridge
  lifePathElement: string;

  // Interpretations
  interpretation: string[];
  notes: string[];
}

// ─── Pythagorean Letter Map ────────────────────────────────────────────

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

// ─── Lo Shu Magic Square ──────────────────────────────────────────────
// Layout:  4 9 2
//          3 5 7
//          8 1 6

const LO_SHU_POSITIONS: Record<number, [number, number]> = {
  4: [0, 0], 9: [0, 1], 2: [0, 2],
  3: [1, 0], 5: [1, 1], 7: [1, 2],
  8: [2, 0], 1: [2, 1], 6: [2, 2],
  0: [1, 1], // 0 → center (Earth)
};

// The number at each grid position [row][col]
const LO_SHU_GRID_NUMBERS: number[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const LO_SHU_ARROWS: LoShuArrow[] = [
  { name: "Determination", nameZh: "毅力", numbers: [4, 3, 8], meaning: "Exceptional persistence, willpower, and the drive to overcome obstacles." },
  { name: "Spirituality", nameZh: "靈性", numbers: [9, 5, 1], meaning: "Strong intuition, inner wisdom, and a deep connection to the spiritual realm." },
  { name: "Action", nameZh: "行動", numbers: [2, 7, 6], meaning: "Practical energy, the ability to manifest goals through decisive action." },
  { name: "Intellect", nameZh: "智慧", numbers: [4, 9, 2], meaning: "Sharp analytical mind, love of learning, and strong mental acuity." },
  { name: "Emotional Balance", nameZh: "情感", numbers: [3, 5, 7], meaning: "Emotional sensitivity, artistic nature, and deep capacity for empathy." },
  { name: "Practical Grounding", nameZh: "務實", numbers: [8, 1, 6], meaning: "Material stability, financial acumen, and a grounded approach to life." },
  { name: "Compassion", nameZh: "慈悲", numbers: [4, 5, 6], meaning: "Natural empathy, humanitarian instinct, and the drive to serve others." },
  { name: "Skepticism", nameZh: "明辨", numbers: [2, 5, 8], meaning: "Critical thinking, discernment, and the ability to question assumptions." },
];

// ─── Element Mappings ──────────────────────────────────────────────────

const DIGIT_TO_ELEMENT: Record<number, string> = {
  1: "Water", 6: "Water",
  2: "Fire",  7: "Fire",
  3: "Wood",  8: "Wood",
  4: "Metal", 9: "Metal",
  5: "Earth", 0: "Earth",
};

const LIFE_PATH_TO_ELEMENT: Record<number, string> = {
  1: "Water", 2: "Fire", 3: "Wood", 4: "Metal", 5: "Earth",
  6: "Water", 7: "Fire", 8: "Wood", 9: "Metal",
  11: "Fire", 22: "Metal", 33: "Water",
};

const ELEMENT_ZH: Record<string, string> = {
  Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水",
};

// ─── Chinese Number Symbolism ──────────────────────────────────────────

const NUMBER_MEANINGS: NumberMeaning[] = [
  { number: 0, chinese: "零 (líng)", pinyin: "líng", meaning: "Wholeness, infinity, the void from which all things emerge — represents unlimited potential." },
  { number: 1, chinese: "一 (yī)", pinyin: "yī", meaning: "Unity and new beginnings. Sounds like 要 (yào, 'want') — associated with ambition and the will to succeed." },
  { number: 2, chinese: "二 (èr)", pinyin: "èr", meaning: "Harmony and pairs. Sounds like 易 (yì, 'easy') — symbolises ease, cooperation, and balanced relationships." },
  { number: 3, chinese: "三 (sān)", pinyin: "sān", meaning: "Growth and vitality. Sounds like 生 (shēng, 'life/birth') — one of the most auspicious numbers, signifying creativity." },
  { number: 4, chinese: "四 (sì)", pinyin: "sì", meaning: "Stability and structure. Sounds like 死 (sǐ, 'death') — traditionally approached with caution, yet it also represents solid foundations." },
  { number: 5, chinese: "五 (wǔ)", pinyin: "wǔ", meaning: "Balance and the center. Linked to the Five Elements — represents wholeness, adaptability, and transformation." },
  { number: 6, chinese: "六 (liù)", pinyin: "liù", meaning: "Smooth flow and prosperity. Sounds like 流 (liú, 'flow') — signifies things going well, good fortune in business." },
  { number: 7, chinese: "七 (qī)", pinyin: "qī", meaning: "Spiritual energy and togetherness. Sounds like 氣 (qì, 'energy') — associated with inner vitality and reflection." },
  { number: 8, chinese: "八 (bā)", pinyin: "bā", meaning: "Wealth and abundance. Sounds like 發 (fā, 'prosper') — the most auspicious number, widely sought for its promise of success." },
  { number: 9, chinese: "九 (jiǔ)", pinyin: "jiǔ", meaning: "Longevity and completeness. Sounds like 久 (jiǔ, 'long-lasting') — the emperor's number, representing endurance." },
];

// ─── Chinese Double-Hour → Element ─────────────────────────────────────

interface DoubleHour {
  branch: string;
  branchZh: string;
  element: string;
  startHour: number;
  endHour: number;
}

const DOUBLE_HOURS: DoubleHour[] = [
  { branch: "Zi",   branchZh: "子", element: "Water", startHour: 23, endHour: 1 },
  { branch: "Chou", branchZh: "丑", element: "Earth", startHour: 1,  endHour: 3 },
  { branch: "Yin",  branchZh: "寅", element: "Wood",  startHour: 3,  endHour: 5 },
  { branch: "Mao",  branchZh: "卯", element: "Wood",  startHour: 5,  endHour: 7 },
  { branch: "Chen", branchZh: "辰", element: "Earth", startHour: 7,  endHour: 9 },
  { branch: "Si",   branchZh: "巳", element: "Fire",  startHour: 9,  endHour: 11 },
  { branch: "Wu",   branchZh: "午", element: "Fire",  startHour: 11, endHour: 13 },
  { branch: "Wei",  branchZh: "未", element: "Earth", startHour: 13, endHour: 15 },
  { branch: "Shen", branchZh: "申", element: "Metal", startHour: 15, endHour: 17 },
  { branch: "You",  branchZh: "酉", element: "Metal", startHour: 17, endHour: 19 },
  { branch: "Xu",   branchZh: "戌", element: "Earth", startHour: 19, endHour: 21 },
  { branch: "Hai",  branchZh: "亥", element: "Water", startHour: 21, endHour: 23 },
];

// ─── Life Path Interpretations ─────────────────────────────────────────

const LIFE_PATH_INTERP: Record<number, { title: string; keyword: string; text: string }> = {
  1: {
    title: "The Pioneer",
    keyword: "Leadership",
    text: "You are a born leader and innovator. Life Path 1 carries the energy of independence, originality, and self-determination. You are driven to forge your own trail rather than follow existing paths. Your natural confidence and assertiveness make you effective at initiating projects and inspiring others. The challenge lies in balancing your strong will with cooperation — learning that true leadership means empowering others, not dominating them. Your destiny is to develop courage and individuality while creating something uniquely your own.",
  },
  2: {
    title: "The Diplomat",
    keyword: "Harmony",
    text: "You are the peacemaker and mediator. Life Path 2 resonates with sensitivity, cooperation, and balance. You possess an extraordinary ability to understand different perspectives and bring people together. Your intuition is finely tuned, allowing you to sense the emotional undercurrents in any situation. While you may sometimes struggle with indecision or over-sensitivity, these qualities are also your greatest strengths. Your destiny is to create harmony, build meaningful partnerships, and demonstrate that gentle strength can move mountains.",
  },
  3: {
    title: "The Creator",
    keyword: "Expression",
    text: "You are a natural communicator and creative force. Life Path 3 vibrates with joy, artistic expression, and social charisma. Words, images, and ideas flow through you with ease, and you have a gift for uplifting others through your creative output. You thrive in environments where self-expression is valued and encouraged. The challenge is to focus your abundant creative energy rather than scattering it in too many directions. Your destiny is to inspire others through authentic self-expression and to find deep meaning in the creative process.",
  },
  4: {
    title: "The Builder",
    keyword: "Foundation",
    text: "You are the master architect of practical reality. Life Path 4 embodies discipline, hard work, and methodical progress. You have an innate understanding of systems and structures, and you excel at turning abstract ideas into concrete results. Your reliability and dedication make you the cornerstone of any endeavour you undertake. While you may sometimes feel restricted by routines, these very structures are what allow you to build lasting legacies. Your destiny is to create enduring foundations — whether in business, family, or community.",
  },
  5: {
    title: "The Adventurer",
    keyword: "Freedom",
    text: "You are a seeker of experience and freedom. Life Path 5 pulses with restless energy, curiosity, and the desire for variety. You learn through direct experience and are drawn to travel, change, and new horizons. Your versatility and adaptability allow you to thrive in situations that would overwhelm others. The challenge is to find freedom within commitment rather than constantly seeking escape. Your destiny is to embrace change as your greatest teacher, using your diverse experiences to develop wisdom and help others break free from limitation.",
  },
  6: {
    title: "The Nurturer",
    keyword: "Responsibility",
    text: "You are the guardian and healer. Life Path 6 radiates love, responsibility, and a deep commitment to family and community. You have a natural gift for creating beauty and harmony in your environment, and others instinctively turn to you for comfort and guidance. Your sense of justice is strong, and you feel compelled to right wrongs wherever you find them. The challenge is to avoid taking on too much responsibility for others' happiness. Your destiny is to demonstrate that love in action — practical, dedicated, and unwavering — is the most powerful force in the universe.",
  },
  7: {
    title: "The Seeker",
    keyword: "Wisdom",
    text: "You are the philosopher and mystic. Life Path 7 resonates with introspection, analysis, and the quest for deeper truth. You possess a brilliant analytical mind combined with strong intuitive abilities, making you uniquely equipped to bridge the rational and spiritual worlds. Solitude refreshes you, and your richest insights often come during periods of quiet reflection. The challenge is to balance your inner world with engagement in the outer world. Your destiny is to seek truth beneath the surface of things and share your wisdom with those ready to receive it.",
  },
  8: {
    title: "The Powerhouse",
    keyword: "Abundance",
    text: "You are the master of material mastery and achievement. Life Path 8 carries the vibration of authority, ambition, and financial acumen. You understand the flow of energy in the material world — how effort translates to results and how resources can be leveraged for greater impact. Your natural executive ability allows you to manage large-scale endeavours with confidence. The challenge is to wield your considerable power with integrity and generosity. Your destiny is to achieve material success while demonstrating that true abundance includes spiritual wealth.",
  },
  9: {
    title: "The Humanitarian",
    keyword: "Compassion",
    text: "You are the wise soul and universal servant. Life Path 9 vibrates with compassion, idealism, and a broad perspective that encompasses all of humanity. You have likely experienced a wide range of life situations, giving you extraordinary empathy and understanding. Your creative abilities are often channelled toward causes greater than yourself. The challenge is to release attachments and embrace the endings that make way for new beginnings. Your destiny is to serve as a beacon of compassion, demonstrating through your life that giving freely is the path to true fulfilment.",
  },
  11: {
    title: "The Illuminator",
    keyword: "Inspiration",
    text: "You carry the amplified energy of a Master Number. Life Path 11 is the channel of spiritual insight and inspiration. You possess heightened intuition that borders on psychic ability, and you are meant to be a bridge between the seen and unseen worlds. Your sensitivity is extraordinary — you can feel the energy of a room the moment you enter it. The challenge is managing the intense nervous energy that comes with this vibration and grounding your visions in practical reality. Your destiny is to illuminate the path for others through your spiritual gifts, creative expression, and unwavering commitment to a higher vision. The 11 also carries the qualities of the 2 (harmony and diplomacy), but elevated to a spiritual plane.",
  },
  22: {
    title: "The Master Builder",
    keyword: "Vision",
    text: "You hold one of the most powerful vibrations in numerology. Life Path 22 combines the spiritual insight of 11 with the practical mastery of 4, creating the potential to build something of lasting significance for humanity. You think in grand terms — not just for yourself, but for the collective good. Your ability to envision large-scale projects and bring them to fruition is unparalleled. The challenge is bearing the weight of such enormous potential without becoming overwhelmed or retreating into the safety of the mundane 4 vibration. Your destiny is to manifest visionary ideas into tangible reality, creating structures, systems, or works that benefit humanity for generations.",
  },
  33: {
    title: "The Master Healer",
    keyword: "Devotion",
    text: "You carry the rarest and most selfless Master Number. Life Path 33 is the Master Healer and Teacher, combining the inspiration of 11 with the nurturing devotion of 6. Your capacity for unconditional love is extraordinary, and you are driven to uplift humanity through compassionate service. You may find yourself drawn to healing arts, spiritual teaching, or humanitarian causes that demand complete self-sacrifice. The challenge is maintaining your own wellbeing while giving so generously to others. Your destiny is to embody the highest expression of love in action — not through grand gestures, but through the daily practice of compassion, patience, and devotion to the greater good.",
  },
};

// ─── Expression / Soul Urge / Personality Brief Interpretations ────────

const CORE_NUMBER_KEYWORDS: Record<number, { expression: string; soulUrge: string; personality: string }> = {
  1: { expression: "Your destiny calls you to lead and innovate. You express your talents through independence and pioneering action.", soulUrge: "Deep within, you crave autonomy and the freedom to chart your own course. Recognition for your originality matters greatly.", personality: "Others see you as confident, decisive, and self-reliant. You project an aura of capability and leadership." },
  2: { expression: "Your destiny unfolds through partnership and diplomacy. You express your gifts by bringing people and ideas together.", soulUrge: "Your heart yearns for deep connection, peace, and emotional intimacy. You are happiest when relationships are harmonious.", personality: "Others perceive you as gentle, approachable, and tactful. Your presence has a calming, reassuring quality." },
  3: { expression: "Your destiny is to create and communicate. You express yourself through words, art, and social engagement.", soulUrge: "You crave creative outlets and the joy of self-expression. Being heard and appreciated for your unique voice is essential.", personality: "Others see you as charming, witty, and vibrant. You light up social settings with your warmth and humour." },
  4: { expression: "Your destiny lies in building lasting structures. You express your talents through organisation, dedication, and practical skill.", soulUrge: "At your core, you desire security, order, and the satisfaction of a job well done. Stability grounds your spirit.", personality: "Others view you as dependable, hardworking, and trustworthy. You project an image of solid reliability." },
  5: { expression: "Your destiny is to experience life fully. You express your gifts through adaptability, exploration, and dynamic change.", soulUrge: "Your soul craves freedom, variety, and sensory experience. Routine feels like a cage to your adventurous spirit.", personality: "Others see you as exciting, versatile, and magnetic. You project an aura of vitality and restless energy." },
  6: { expression: "Your destiny calls you to nurture and heal. You express your talents through caregiving, beauty, and domestic harmony.", soulUrge: "Your deepest desire is to love and be loved unconditionally. Creating a beautiful, harmonious home fulfils you.", personality: "Others see you as warm, responsible, and aesthetically refined. You project an aura of caring stability." },
  7: { expression: "Your destiny unfolds through seeking truth. You express your gifts via analysis, research, and contemplation.", soulUrge: "You crave understanding, solitude for reflection, and the satisfaction of uncovering hidden truths.", personality: "Others perceive you as thoughtful, reserved, and intellectually sharp. You project quiet depth and mystery." },
  8: { expression: "Your destiny is material mastery. You express your talents through business acumen, executive ability, and resource management.", soulUrge: "You desire achievement, influence, and the power to shape the material world according to your vision.", personality: "Others see you as authoritative, ambitious, and capable. You project confidence and executive presence." },
  9: { expression: "Your destiny is compassionate service. You express your gifts through generosity, artistry, and universal understanding.", soulUrge: "Your soul yearns to make a difference. You are driven by idealism and a vision of a more compassionate world.", personality: "Others see you as wise, generous, and worldly. You project an aura of broad experience and kindness." },
  11: { expression: "Your destiny is spiritual illumination. You express through inspired creativity and visionary leadership.", soulUrge: "You crave transcendence and spiritual meaning. Ordinary existence feels insufficient for your luminous inner life.", personality: "Others sense something electric about you — an intensity and idealism that sets you apart from the crowd." },
  22: { expression: "Your destiny is to build for humanity. You express through grand visions realised with practical mastery.", soulUrge: "You desire to leave a monumental legacy. Your inner drive is to transform visionary ideas into lasting reality.", personality: "Others see you as powerfully capable, almost intimidatingly competent. You project immense potential." },
  33: { expression: "Your destiny is selfless healing and teaching. You express through unconditional love and compassionate service.", soulUrge: "You crave the opportunity to uplift others. Your deepest fulfilment comes through acts of pure, unconditional giving.", personality: "Others feel comforted in your presence. You radiate warmth, wisdom, and an almost saintly compassion." },
};

// ─── Personal Year Interpretations ─────────────────────────────────────

const PERSONAL_YEAR_INTERP: Record<number, { theme: string; text: string }> = {
  1: { theme: "New Beginnings", text: "This is a year of fresh starts and bold new initiatives. The energy favours planting seeds, launching projects, and asserting your independence. Take the lead on something that matters to you. Decisions made this year set the tone for the next nine-year cycle." },
  2: { theme: "Partnership & Patience", text: "A year of cooperation, relationships, and careful development. The seeds planted last year need tending. Be patient, diplomatic, and attentive to the needs of others. Partnerships formed or deepened this year carry special significance." },
  3: { theme: "Creative Expansion", text: "Joy, self-expression, and social activity define this year. Your creative energy is at a peak — write, paint, speak, perform. Expand your social circle and let your authentic personality shine. Opportunities come through communication and visibility." },
  4: { theme: "Building Foundations", text: "A year of hard work, discipline, and laying solid groundwork. Focus on structure, organisation, and long-term planning. It may feel demanding, but the foundations you build now will support years of future growth. Health and routines deserve attention." },
  5: { theme: "Change & Freedom", text: "Expect the unexpected. This dynamic year brings change, travel, and new experiences. Embrace flexibility and be willing to step outside your comfort zone. Freedom is the theme — release what no longer serves you and explore new possibilities." },
  6: { theme: "Home & Responsibility", text: "Family, home, and community take centre stage. This year asks you to step up in service to others and create harmony in your domestic life. Beautify your surroundings, strengthen family bonds, and accept the rewards and demands of responsibility." },
  7: { theme: "Reflection & Inner Growth", text: "A contemplative year ideal for study, spiritual exploration, and self-discovery. The outer world slows down to give your inner world room to expand. Trust your intuition, seek knowledge, and don't force results — wisdom comes through patience and stillness." },
  8: { theme: "Achievement & Power", text: "This is your power year — a time for material advancement, career breakthroughs, and financial growth. The effort of previous years now bears fruit. Step into your authority, make bold business decisions, and claim the recognition you have earned." },
  9: { theme: "Completion & Release", text: "A year of endings, culmination, and letting go. The nine-year cycle is completing, and it is time to release what has run its course. Forgive, donate, declutter, and make space for the new cycle ahead. Compassion and generosity bring the deepest rewards." },
};

// ─── Lo Shu Missing Number Meanings ────────────────────────────────────

const MISSING_NUMBER_MEANINGS: Record<number, string> = {
  1: "Communication and self-expression may require conscious development. You might need to work on speaking up and articulating your ideas clearly.",
  2: "Sensitivity and intuition could be areas for growth. Developing patience and emotional awareness will strengthen your relationships.",
  3: "Creative confidence may not come naturally. Actively engaging in creative pursuits and embracing imagination will unlock hidden talents.",
  4: "Organisation and discipline might need deliberate cultivation. Building routines and systems will help you achieve your goals more effectively.",
  5: "Emotional freedom and adaptability may be growth areas. Learning to embrace change and express feelings openly will bring greater balance.",
  6: "Domestic responsibility and nurturing could require conscious attention. Strengthening family bonds and accepting care duties brings fulfilment.",
  7: "Spiritual depth and analytical thinking may need encouragement. Seek quiet reflection and trust that not everything needs to be proven rationally.",
  8: "Financial acumen and material confidence could be underdeveloped. Learning about money management and valuing your practical contributions will help.",
  9: "Global perspective and humanitarian awareness may need broadening. Travel, volunteering, and engaging with diverse cultures expand your worldview.",
};

// ─── Element Interaction Descriptions ──────────────────────────────────

const ELEMENT_QUALITIES: Record<string, string> = {
  Wood: "growth, creativity, and expansion — like a tree reaching toward the light",
  Fire: "passion, transformation, and illumination — the spark that ignites action",
  Earth: "stability, nourishment, and groundedness — the fertile soil of practical wisdom",
  Metal: "precision, clarity, and refinement — the blade that cuts through confusion",
  Water: "wisdom, adaptability, and depth — the flowing current that finds its way around all obstacles",
};

const GENERATING_CYCLE: Record<string, string> = {
  Wood: "Fire",   // Wood feeds Fire
  Fire: "Earth",  // Fire creates Earth (ash)
  Earth: "Metal", // Earth yields Metal
  Metal: "Water", // Metal collects Water
  Water: "Wood",  // Water nourishes Wood
};

// ─── Calculation Functions ─────────────────────────────────────────────

function reduceToSingleDigit(n: number): number {
  // Preserve master numbers
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

function sumDigits(n: number): number {
  let sum = 0;
  const abs = Math.abs(n);
  let remaining = abs;
  while (remaining > 0) {
    sum += remaining % 10;
    remaining = Math.floor(remaining / 10);
  }
  return sum;
}

function calculateLifePath(birthDate: string): number {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const monthSum = reduceToSingleDigit(sumDigits(parseInt(monthStr, 10)));
  const daySum = reduceToSingleDigit(sumDigits(parseInt(dayStr, 10)));
  const yearSum = reduceToSingleDigit(sumDigits(parseInt(yearStr, 10)));
  return reduceToSingleDigit(monthSum + daySum + yearSum);
}

function calculateNameNumber(name: string, filter?: "vowels" | "consonants"): number | null {
  let total = 0;
  let hasValidLetter = false;
  for (const char of name.toUpperCase()) {
    const val = PYTHAGOREAN_MAP[char];
    if (val === undefined) continue;
    const isVowel = VOWELS.has(char);
    if (filter === "vowels" && !isVowel) continue;
    if (filter === "consonants" && isVowel) continue;
    total += val;
    hasValidLetter = true;
  }
  if (!hasValidLetter) return null;
  return reduceToSingleDigit(total);
}

function calculatePersonalYear(birthDate: string): number {
  const [, monthStr, dayStr] = birthDate.split("-");
  const currentYear = new Date().getFullYear();
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const total = sumDigits(month) + sumDigits(day) + sumDigits(currentYear);
  return reduceToSingleDigit(total);
}

function reduceBirthdayNumber(day: number): number {
  return reduceToSingleDigit(day);
}

// ─── Lo Shu Grid Functions ─────────────────────────────────────────────

function buildLoShuGrid(birthDate: string): number[][] {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  // Format as DDMMYYYY for Lo Shu
  const dateStr = dayStr + monthStr + yearStr;
  const grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const ch of dateStr) {
    const digit = parseInt(ch, 10);
    const [row, col] = LO_SHU_POSITIONS[digit];
    grid[row][col]++;
  }
  return grid;
}

function detectArrows(digitCounts: Map<number, number>): LoShuArrow[] {
  const arrows: LoShuArrow[] = [];
  for (const arrow of LO_SHU_ARROWS) {
    const present = arrow.numbers.every((n) => (digitCounts.get(n) ?? 0) >= 1);
    if (present) arrows.push(arrow);
  }
  return arrows;
}

function findMissingNumbers(digitCounts: Map<number, number>): number[] {
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if ((digitCounts.get(i) ?? 0) === 0) missing.push(i);
  }
  return missing;
}

function getDigitCounts(birthDate: string): Map<number, number> {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const dateStr = dayStr + monthStr + yearStr;
  const counts = new Map<number, number>();
  for (const ch of dateStr) {
    const digit = parseInt(ch, 10);
    // Map 0 to 5 for counting purposes (0 and 5 share the center)
    const mapped = digit === 0 ? 5 : digit;
    counts.set(mapped, (counts.get(mapped) ?? 0) + 1);
  }
  return counts;
}

// ─── Element Analysis ──────────────────────────────────────────────────

function calculateElementBalance(birthDate: string): Record<string, number> {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const dateStr = dayStr + monthStr + yearStr;
  const balance: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const ch of dateStr) {
    const digit = parseInt(ch, 10);
    const element = DIGIT_TO_ELEMENT[digit];
    balance[element]++;
  }
  return balance;
}

function getDominantElement(balance: Record<string, number>): string {
  let max = 0;
  let dominant = "Earth";
  for (const [element, count] of Object.entries(balance)) {
    if (count > max) {
      max = count;
      dominant = element;
    }
  }
  return dominant;
}

function getHourElement(birthTime: string): string | undefined {
  if (!birthTime) return undefined;
  const [hourStr] = birthTime.split(":");
  const hour = parseInt(hourStr, 10);
  for (const dh of DOUBLE_HOURS) {
    if (dh.startHour === 23) {
      if (hour >= 23 || hour < dh.endHour) return dh.element;
    } else {
      if (hour >= dh.startHour && hour < dh.endHour) return dh.element;
    }
  }
  return undefined;
}

function getHourBranch(birthTime: string): DoubleHour | undefined {
  if (!birthTime) return undefined;
  const [hourStr] = birthTime.split(":");
  const hour = parseInt(hourStr, 10);
  for (const dh of DOUBLE_HOURS) {
    if (dh.startHour === 23) {
      if (hour >= 23 || hour < dh.endHour) return dh;
    } else {
      if (hour >= dh.startHour && hour < dh.endHour) return dh;
    }
  }
  return undefined;
}

// ─── Interpretation Builder ────────────────────────────────────────────

function buildInterpretation(
  lifePath: number,
  expression: number | null,
  soulUrge: number | null,
  personality: number | null,
  birthday: number,
  personalYear: number,
  loShuArrows: LoShuArrow[],
  missingNumbers: number[],
  elementBalance: Record<string, number>,
  dominantElement: string,
  lifePathElement: string,
  birthHourElement: string | undefined,
  digitCounts: Map<number, number>,
): string[] {
  const lines: string[] = [];
  const lp = LIFE_PATH_INTERP[lifePath];
  const lpKeywords = CORE_NUMBER_KEYWORDS[lifePath > 9 ? lifePath : lifePath];

  // ── Section 1: Core Numbers Overview ──
  lines.push("## Core Numbers / 核心數字");
  lines.push(`Your numerological profile reveals a unique constellation of numbers, each illuminating a different facet of your nature and destiny.`);
  lines.push(`• Life Path ${lifePath} — ${lp.title}: ${lp.keyword}. The central thread of your life's purpose.`);
  lines.push(`• Birthday Number ${birthday} — The specific gift you bring from the day you were born.`);
  if (expression !== null) {
    const expInterp = CORE_NUMBER_KEYWORDS[expression];
    lines.push(`• Expression ${expression} — Your outward talents and the way you manifest your destiny.`);
    if (soulUrge !== null) lines.push(`• Soul Urge ${soulUrge} — The inner desires that drive you at the deepest level.`);
    if (personality !== null) lines.push(`• Personality ${personality} — How you appear to others and the image you project.`);
  } else {
    lines.push("• Name-based numbers (Expression, Soul Urge, Personality) require a name input for calculation.");
  }
  lines.push(`• Personal Year ${personalYear} — ${PERSONAL_YEAR_INTERP[personalYear].theme}. The energy shaping your current year.`);

  // ── Section 2: Life Path ──
  lines.push("## Life Path / 生命靈數");
  if (lifePath === 11 || lifePath === 22 || lifePath === 33) {
    lines.push(`You carry Master Number ${lifePath} — a vibration of heightened potential and responsibility. Master Numbers are not reduced further because they hold special spiritual significance.`);
  }
  lines.push(lp.text);
  lines.push(`In Chinese elemental terms, your Life Path ${lifePath} corresponds to ${lifePathElement} (${ELEMENT_ZH[lifePathElement]}) — the energy of ${ELEMENT_QUALITIES[lifePathElement]}. This elemental resonance colours how your life purpose manifests in the world.`);

  // ── Section 3: Expression & Soul ──
  lines.push("## Expression & Soul / 表達與靈魂");
  if (expression !== null && lpKeywords) {
    const ek = CORE_NUMBER_KEYWORDS[expression];
    lines.push(`Expression Number ${expression}: ${ek.expression}`);
    if (soulUrge !== null) {
      const sk = CORE_NUMBER_KEYWORDS[soulUrge];
      lines.push(`Soul Urge Number ${soulUrge}: ${sk.soulUrge}`);
    }
    if (personality !== null) {
      const pk = CORE_NUMBER_KEYWORDS[personality];
      lines.push(`Personality Number ${personality}: ${pk.personality}`);
    }
    // Relationship between expression and life path
    if (expression === lifePath) {
      lines.push("Your Expression and Life Path share the same number — a powerful alignment indicating that your natural talents are perfectly suited to your life purpose. There is little internal conflict between who you are and what you are meant to do.");
    } else {
      lines.push(`Your Expression ${expression} and Life Path ${lifePath} create a dynamic interplay. Your natural talents (${expression}) serve as tools for fulfilling your deeper purpose (${lifePath}). Embracing both energies creates a richer, more nuanced expression of your destiny.`);
    }
  } else {
    lines.push("Name-based numbers (Expression, Soul Urge, and Personality) provide deeper insight into your talents, inner desires, and social persona. Enter your full birth name to unlock these additional dimensions of your numerological profile.");
  }

  // ── Section 4: Lo Shu Grid ──
  lines.push("## Lo Shu Grid / 洛書九宮");
  lines.push("The Lo Shu Grid is one of the oldest known numerological tools, originating from ancient China over 4,000 years ago. Legend says that a divine tortoise emerged from the Lo River bearing a mystical 3×3 grid on its shell. By mapping your birth date digits onto this sacred grid, we reveal the energetic patterns woven into your being.");

  if (loShuArrows.length > 0) {
    lines.push(`Your grid reveals ${loShuArrows.length} Arrow${loShuArrows.length > 1 ? "s" : ""} of Strength:`);
    for (const arrow of loShuArrows) {
      lines.push(`• Arrow of ${arrow.name} (${arrow.nameZh}, numbers ${arrow.numbers.join("-")}): ${arrow.meaning}`);
    }
  } else {
    lines.push("Your grid contains no complete arrows, which is not uncommon. This suggests a more individualised energy pattern where strengths are distributed rather than concentrated along traditional lines. Your unique combination of present and absent numbers creates a distinctive personal signature.");
  }

  if (missingNumbers.length > 0) {
    lines.push(`Numbers absent from your grid: ${missingNumbers.join(", ")}. These represent areas where conscious development can yield significant personal growth:`);
    for (const n of missingNumbers) {
      if (MISSING_NUMBER_MEANINGS[n]) {
        lines.push(`• Missing ${n}: ${MISSING_NUMBER_MEANINGS[n]}`);
      }
    }
  } else {
    lines.push("Remarkably, all numbers 1-9 are represented in your grid. This is quite rare and indicates a well-rounded energetic foundation with access to the full spectrum of numerological qualities.");
  }

  // Highlight concentrated numbers
  const concentrated: string[] = [];
  digitCounts.forEach((count, digit) => {
    if (count >= 3) concentrated.push(`${digit} (appears ${count} times)`);
  });
  if (concentrated.length > 0) {
    lines.push(`Concentrated energy: ${concentrated.join(", ")}. Multiple occurrences amplify that number's qualities, creating a dominant energetic signature in your grid.`);
  }

  // ── Section 5: Five Elements ──
  lines.push("## Five Elements / 五行分析");
  lines.push("In Chinese numerology, each digit carries the essence of one of the Five Elements (五行). By analysing the elemental distribution of your birth date digits, we can identify your natural elemental strengths and areas that may benefit from balancing.");

  const sorted = Object.entries(elementBalance).sort(([, a], [, b]) => b - a);
  const total = Object.values(elementBalance).reduce((s, c) => s + c, 0);
  for (const [element, count] of sorted) {
    const pct = Math.round((count / total) * 100);
    lines.push(`• ${element} (${ELEMENT_ZH[element]}): ${count} digit${count !== 1 ? "s" : ""} (${pct}%) — ${ELEMENT_QUALITIES[element]}.`);
  }

  lines.push(`Your dominant element is ${dominantElement} (${ELEMENT_ZH[dominantElement]}), giving you a natural affinity for ${ELEMENT_QUALITIES[dominantElement]}.`);

  // Weakest element
  const weakest = sorted[sorted.length - 1];
  if (weakest[1] === 0) {
    lines.push(`${weakest[0]} (${ELEMENT_ZH[weakest[0]]}) is entirely absent from your birth digits. In the Five Element cycle, ${weakest[0]} represents ${ELEMENT_QUALITIES[weakest[0]]}. Cultivating this element through conscious practice can bring greater balance to your life.`);
  }

  if (birthHourElement) {
    lines.push(`Your birth hour adds ${birthHourElement} (${ELEMENT_ZH[birthHourElement]}) energy to your elemental profile, ${birthHourElement === dominantElement ? "reinforcing your dominant element and intensifying its qualities" : `introducing a complementary ${birthHourElement} influence that adds depth and versatility to your elemental constitution`}.`);
  }

  // ── Section 6: East Meets West Synthesis ──
  lines.push("## East Meets West / 東西交匯");
  lines.push("The deepest insights emerge when we weave together Western numerological wisdom and Chinese elemental philosophy. These two ancient traditions, developed independently across millennia, offer complementary lenses through which to understand your nature.");

  // Life Path element + dominant birth element relationship
  if (lifePathElement === dominantElement) {
    lines.push(`A powerful harmony exists in your chart: your Western Life Path element (${lifePathElement}) and your Chinese birth-digit dominant element (${dominantElement}) are one and the same. This alignment suggests a strong, focused energy — you are deeply attuned to the qualities of ${lifePathElement}, and this element is woven into the very fabric of your being.`);
  } else {
    const generates = GENERATING_CYCLE[lifePathElement] === dominantElement;
    const isGenerated = GENERATING_CYCLE[dominantElement] === lifePathElement;
    if (generates) {
      lines.push(`Your Life Path element ${lifePathElement} (${ELEMENT_ZH[lifePathElement]}) generates your dominant birth element ${dominantElement} (${ELEMENT_ZH[dominantElement]}) in the creative cycle. This means your life purpose naturally feeds and empowers your innate strengths — a fortunate and productive alignment.`);
    } else if (isGenerated) {
      lines.push(`Your dominant birth element ${dominantElement} (${ELEMENT_ZH[dominantElement]}) generates your Life Path element ${lifePathElement} (${ELEMENT_ZH[lifePathElement]}). Your natural constitution provides the raw material that fuels your life purpose — your innate gifts serve your destiny well.`);
    } else {
      lines.push(`Your Life Path element ${lifePathElement} (${ELEMENT_ZH[lifePathElement]}) and dominant birth element ${dominantElement} (${ELEMENT_ZH[dominantElement]}) represent different energies. This creative tension gives you versatility — you can draw on ${lifePathElement}'s ${ELEMENT_QUALITIES[lifePathElement]} when pursuing your purpose, while your natural ${dominantElement} energy provides a complementary foundation.`);
    }
  }

  // Lo Shu arrows + Western personality synthesis
  if (loShuArrows.length > 0 && lp) {
    const arrowNames = loShuArrows.map((a) => a.name).join(", ");
    lines.push(`Your Lo Shu Arrow${loShuArrows.length > 1 ? "s" : ""} of ${arrowNames} complement${loShuArrows.length === 1 ? "s" : ""} your Life Path ${lifePath} (${lp.title}) beautifully. Together, these Eastern and Western indicators paint a picture of someone who ${lifePath <= 5 ? "combines initiative with deep-rooted energetic patterns" : "blends wisdom and inner strength with ancient archetypal forces"}.`);
  }

  // ── Section 7: Personal Year ──
  lines.push("## Personal Year / 流年運勢");
  const py = PERSONAL_YEAR_INTERP[personalYear];
  lines.push(`You are currently in a Personal Year ${personalYear}: ${py.theme}.`);
  lines.push(py.text);

  // Relate personal year to elements
  const pyElement = LIFE_PATH_TO_ELEMENT[personalYear] ?? "Earth";
  lines.push(`This Personal Year ${personalYear} carries ${pyElement} (${ELEMENT_ZH[pyElement]}) energy. ${pyElement === dominantElement ? "This resonates strongly with your natural elemental constitution, amplifying your inherent strengths this year." : `This ${pyElement} energy introduces a different quality to your year — embrace the energy of ${ELEMENT_QUALITIES[pyElement]} to make the most of this cycle.`}`);

  // ── Section 8: Guidance ──
  lines.push("## Guidance / 指引");
  lines.push("Drawing from both Western numerology and Chinese elemental wisdom, here are practical insights for your path:");

  // Lucky numbers
  const luckyNumbers: number[] = [lifePath];
  if (expression !== null && !luckyNumbers.includes(expression)) luckyNumbers.push(expression);
  if (!luckyNumbers.includes(8)) luckyNumbers.push(8); // universally auspicious in Chinese tradition
  lines.push(`• Auspicious Numbers: ${luckyNumbers.join(", ")} — these numbers resonate with your personal vibration. Notice them in addresses, dates, and opportunities.`);

  // Element cultivation
  if (weakest[1] <= 1) {
    lines.push(`• Element Cultivation: Strengthen your ${weakest[0]} (${ELEMENT_ZH[weakest[0]]}) element through activities associated with ${ELEMENT_QUALITIES[weakest[0]]}. This brings balance to your overall energetic constitution.`);
  }

  // Life Path guidance
  lines.push(`• Life Purpose: As a Life Path ${lifePath} (${lp.title}), your greatest fulfilment comes through embracing ${lp.keyword.toLowerCase()}. Let this quality be your compass when making important decisions.`);

  // Personal year guidance
  lines.push(`• This Year's Focus: Personal Year ${personalYear} (${py.theme}) suggests prioritising ${personalYear <= 3 ? "initiative and growth" : personalYear <= 6 ? "building and nurturing" : "reflection and completion"} in the months ahead.`);

  // Missing number guidance
  if (missingNumbers.length > 0) {
    const first = missingNumbers[0];
    lines.push(`• Growth Opportunity: Your Lo Shu Grid highlights ${first} as an area for development. Consciously engaging with the energy of ${first} — ${MISSING_NUMBER_MEANINGS[first]?.split(".")[0].toLowerCase() ?? "developing this quality"} — will unlock new dimensions of your potential.`);
  }

  return lines;
}

// ─── Main Export ───────────────────────────────────────────────────────

export function calculateNumerology(input: NumerologyInput): NumerologyChart {
  const { birthDate, birthTime, name } = input;

  // Validate birth date
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  if (!yearStr || !monthStr || !dayStr) {
    throw new Error("Invalid birth date format. Please use YYYY-MM-DD.");
  }
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error("Invalid birth date values.");
  }

  // Western calculations
  const lifePathNumber = calculateLifePath(birthDate);
  const expressionNumber = name ? calculateNameNumber(name) : null;
  const soulUrgeNumber = name ? calculateNameNumber(name, "vowels") : null;
  const personalityNumber = name ? calculateNameNumber(name, "consonants") : null;
  const birthdayNumber = reduceBirthdayNumber(day);
  const personalYearNumber = calculatePersonalYear(birthDate);

  // Chinese calculations
  const loShuGrid = buildLoShuGrid(birthDate);
  const digitCounts = getDigitCounts(birthDate);
  const loShuArrows = detectArrows(digitCounts);
  const missingNumbers = findMissingNumbers(digitCounts);
  const elementBalance = calculateElementBalance(birthDate);
  const dominantElement = getDominantElement(elementBalance);
  const birthHourElement = birthTime ? getHourElement(birthTime) : undefined;

  // Bridge
  const lifePathElement = LIFE_PATH_TO_ELEMENT[lifePathNumber] ?? "Earth";

  // Number meanings (for digits present in birth date)
  const numberMeanings = NUMBER_MEANINGS;

  // Interpretation
  const interpretation = buildInterpretation(
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    birthdayNumber,
    personalYearNumber,
    loShuArrows,
    missingNumbers,
    elementBalance,
    dominantElement,
    lifePathElement,
    birthHourElement,
    digitCounts,
  );

  // Notes
  const notes: string[] = [
    "Western numerology uses the Pythagorean letter-to-number system (A=1 through Z=8).",
    "The Lo Shu Grid is based on the ancient Chinese magic square, with birth date digits mapped in DDMMYYYY format.",
    "Element mappings follow traditional Chinese numerology: 1,6→Water; 2,7→Fire; 3,8→Wood; 4,9→Metal; 5,0→Earth.",
    "Master Numbers (11, 22, 33) are preserved during reduction due to their special spiritual significance.",
    "Name-based calculations work best with alphabetic Latin characters. Non-Latin names may yield partial results.",
    "These readings are tools for self-reflection. Use them to explore patterns and gain perspective.",
  ];

  return {
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    birthdayNumber,
    personalYearNumber,
    loShuGrid,
    loShuArrows,
    missingNumbers,
    dominantElement,
    elementBalance,
    birthHourElement,
    numberMeanings,
    lifePathElement,
    interpretation,
    notes,
  };
}
