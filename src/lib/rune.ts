// ─── Types ────────────────────────────────────────────────────────────────────

export type RunePolarity = "auspicious" | "challenging" | "neutral";
export type RuneDomain = "career" | "finance" | "love" | "health" | "general";

export type Rune = {
  number: number;
  name: string;
  letter: string;
  symbol: string;
  nameEn: string;
  meaning: string;
  keywords: string[];
  polarity: RunePolarity;
  domain: RuneDomain;
};

export type DrawnRune = {
  position: "past" | "present" | "future";
  rune: Rune;
};

export type RuneReading = {
  drawnRunes: [DrawnRune, DrawnRune, DrawnRune];
  interpretation: string[];
  question?: string;
};

// ─── Rune Data (Elder Futhark order 1–25) ────────────────────────────────────

export const RUNES: Rune[] = [
  {
    number: 1,
    name: "Fehu",
    letter: "F",
    symbol: "ᚠ",
    nameEn: "Cattle / Wealth",
    meaning:
      "Fehu speaks of earned wealth, abundance, and the energy of new beginnings rooted in material gain. It encourages you to steward resources wisely — prosperity is within reach when you act with intention.",
    keywords: ["wealth", "abundance", "new beginnings", "resources", "fertility"],
    polarity: "auspicious",
    domain: "finance",
  },
  {
    number: 2,
    name: "Uruz",
    letter: "U",
    symbol: "ᚢ",
    nameEn: "Aurochs / Strength",
    meaning:
      "Uruz carries raw, untamed strength and vital force. It heralds a period of physical or inner renewal, urging you to draw on your primal energy and resilience to overcome obstacles.",
    keywords: ["strength", "vitality", "health", "primal force", "renewal"],
    polarity: "auspicious",
    domain: "health",
  },
  {
    number: 3,
    name: "Thurisaz",
    letter: "Th",
    symbol: "ᚦ",
    nameEn: "Giant / Thorn",
    meaning:
      "Thurisaz is the thorn that both protects and pierces. It warns of reactive forces, conflict, or the need to confront a difficult threshold. Pause before acting — what looks like an obstacle may be a necessary gate.",
    keywords: ["conflict", "threshold", "caution", "defence", "catalyst"],
    polarity: "challenging",
    domain: "general",
  },
  {
    number: 4,
    name: "Ansuz",
    letter: "A",
    symbol: "ᚨ",
    nameEn: "Message / Divine Breath",
    meaning:
      "Ansuz is the rune of communication, divine inspiration, and the spoken word. It signals a time to listen for guidance — through dreams, conversations, or sudden insight. Express yourself clearly and truth will find its way.",
    keywords: ["communication", "wisdom", "inspiration", "messages", "clarity"],
    polarity: "auspicious",
    domain: "career",
  },
  {
    number: 5,
    name: "Raidho",
    letter: "R",
    symbol: "ᚱ",
    nameEn: "Journey / Ride",
    meaning:
      "Raidho governs the journey — physical travel, spiritual progress, and the rhythms of ordered movement. Trust the road ahead. Decisions made now set the direction; stay aligned with your true path.",
    keywords: ["journey", "progress", "direction", "movement", "alignment"],
    polarity: "auspicious",
    domain: "general",
  },
  {
    number: 6,
    name: "Kenaz",
    letter: "K",
    symbol: "ᚲ",
    nameEn: "Torch / Vision",
    meaning:
      "Kenaz is the torch in the darkness — illuminating knowledge, creative fire, and technical skill. A time of clarity arrives; use this light to craft, learn, or reveal what was hidden. Passion fuels mastery.",
    keywords: ["illumination", "creativity", "knowledge", "craft", "passion"],
    polarity: "auspicious",
    domain: "career",
  },
  {
    number: 7,
    name: "Gebo",
    letter: "G",
    symbol: "ᚷ",
    nameEn: "Gift / Partnership",
    meaning:
      "Gebo is the gift freely given and received — the rune of exchange, generosity, and sacred partnership. Balance in giving and receiving is key. A meaningful bond or reciprocal arrangement is highlighted.",
    keywords: ["gift", "partnership", "exchange", "generosity", "balance"],
    polarity: "auspicious",
    domain: "love",
  },
  {
    number: 8,
    name: "Wunjo",
    letter: "W",
    symbol: "ᚹ",
    nameEn: "Joy / Harmony",
    meaning:
      "Wunjo is the rune of joy, fellowship, and harmony achieved. After striving comes reward. Relationships flourish, goals align with personal happiness, and a sense of rightness pervades the moment.",
    keywords: ["joy", "harmony", "fellowship", "fulfilment", "happiness"],
    polarity: "auspicious",
    domain: "love",
  },
  {
    number: 9,
    name: "Hagalaz",
    letter: "H",
    symbol: "ᚺ",
    nameEn: "Hail / Disruption",
    meaning:
      "Hagalaz is hailstorm — sudden, uncontrollable disruption that clears the field for new growth. External forces may upend plans, but transformation follows destruction. Yield rather than resist; the seeds beneath will germinate.",
    keywords: ["disruption", "transformation", "crisis", "release", "renewal"],
    polarity: "challenging",
    domain: "general",
  },
  {
    number: 10,
    name: "Nauthiz",
    letter: "N",
    symbol: "ᚾ",
    nameEn: "Need / Necessity",
    meaning:
      "Nauthiz is the friction of need — the constraint that builds character. It marks a time of hardship, restriction, or unfulfilled desire. Patience and self-discipline are called for; necessity itself becomes the teacher.",
    keywords: ["constraint", "patience", "necessity", "discipline", "endurance"],
    polarity: "challenging",
    domain: "general",
  },
  {
    number: 11,
    name: "Isa",
    letter: "I",
    symbol: "ᛁ",
    nameEn: "Ice / Stillness",
    meaning:
      "Isa is pure ice — a standstill, a pause, a crystallised moment. Progress is blocked or frozen. This is not failure but gestation; use the stillness to develop inner clarity and await the natural thaw.",
    keywords: ["stillness", "patience", "blockage", "introspection", "waiting"],
    polarity: "neutral",
    domain: "general",
  },
  {
    number: 12,
    name: "Jera",
    letter: "J",
    symbol: "ᛃ",
    nameEn: "Year / Harvest",
    meaning:
      "Jera is the turning year and the rightful harvest — the reward for right effort over right time. Cycles complete, what was planted now bears fruit. This rune affirms that patient, consistent work yields its due return.",
    keywords: ["harvest", "cycles", "reward", "patience", "completion"],
    polarity: "auspicious",
    domain: "finance",
  },
  {
    number: 13,
    name: "Eihwaz",
    letter: "Ei",
    symbol: "ᛇ",
    nameEn: "Yew / Endurance",
    meaning:
      "Eihwaz is the eternal yew — the axis between worlds, death and rebirth, enduring strength. A situation requiring steadfast resolve is indicated. Do not be swayed by fear; your roots run deeper than you know.",
    keywords: ["endurance", "resilience", "transformation", "axis", "depth"],
    polarity: "neutral",
    domain: "health",
  },
  {
    number: 14,
    name: "Perthro",
    letter: "P",
    symbol: "ᛈ",
    nameEn: "Lot Cup / Mystery",
    meaning:
      "Perthro is the casting cup, the seat of fate and hidden knowledge. It speaks of chance, wyrd, and the secrets that shape destiny. Something concealed may be revealed — or luck may pivot unexpectedly.",
    keywords: ["mystery", "fate", "chance", "secrets", "hidden forces"],
    polarity: "neutral",
    domain: "general",
  },
  {
    number: 15,
    name: "Algiz",
    letter: "Z",
    symbol: "ᛉ",
    nameEn: "Elk-Sedge / Protection",
    meaning:
      "Algiz is the protective rune — the elk whose antlers ward off predators. It signals divine protection, a safe passage, or the need to guard yourself or loved ones. Trust your instincts; they are your shield.",
    keywords: ["protection", "instinct", "guardian", "sanctuary", "awareness"],
    polarity: "auspicious",
    domain: "health",
  },
  {
    number: 16,
    name: "Sowilo",
    letter: "S",
    symbol: "ᛋ",
    nameEn: "Sun / Victory",
    meaning:
      "Sowilo is the sun wheel — radiant success, clarity of purpose, and vital life force. Achievement is highlighted; goals pursued with clarity and confidence will find their mark. Let the light guide decisive action.",
    keywords: ["success", "clarity", "victory", "energy", "confidence"],
    polarity: "auspicious",
    domain: "career",
  },
  {
    number: 17,
    name: "Tiwaz",
    letter: "T",
    symbol: "ᛏ",
    nameEn: "Tyr / Justice",
    meaning:
      "Tiwaz is the warrior god Tyr — courage, sacrifice, and righteous victory. Justice and fair dealing prevail. You may be called to make a personal sacrifice for a greater good; integrity leads to honour.",
    keywords: ["justice", "courage", "honour", "sacrifice", "victory"],
    polarity: "auspicious",
    domain: "career",
  },
  {
    number: 18,
    name: "Berkano",
    letter: "B",
    symbol: "ᛒ",
    nameEn: "Birch / New Beginnings",
    meaning:
      "Berkano is the birch goddess — birth, nurturing, and fresh beginnings. New life stirs: a relationship deepens, a project is born, or healing takes root. Tend the tender shoots with care and patience.",
    keywords: ["birth", "nurturing", "growth", "new beginnings", "family"],
    polarity: "auspicious",
    domain: "love",
  },
  {
    number: 19,
    name: "Ehwaz",
    letter: "E",
    symbol: "ᛖ",
    nameEn: "Horse / Progress",
    meaning:
      "Ehwaz is the horse and rider — loyal partnership, swift progress, and harmonious movement. Trust the dynamic between you and those you work with. Forward momentum comes through cooperation and mutual trust.",
    keywords: ["partnership", "progress", "trust", "movement", "cooperation"],
    polarity: "auspicious",
    domain: "general",
  },
  {
    number: 20,
    name: "Mannaz",
    letter: "M",
    symbol: "ᛗ",
    nameEn: "Human / The Self",
    meaning:
      "Mannaz is humanity and the individual self — the mirror of who you are within community. It calls for honest self-examination, humility, and awareness of your interconnection with others. Know thyself.",
    keywords: ["self", "awareness", "community", "reflection", "humanity"],
    polarity: "neutral",
    domain: "general",
  },
  {
    number: 21,
    name: "Laguz",
    letter: "L",
    symbol: "ᛚ",
    nameEn: "Water / Flow",
    meaning:
      "Laguz is the deep waters of the unconscious — intuition, emotional flow, and the pull of the unseen. Trust feelings over logic now. Let go of rigid control and allow the current of life to carry you forward.",
    keywords: ["intuition", "flow", "emotion", "depth", "surrender"],
    polarity: "auspicious",
    domain: "love",
  },
  {
    number: 22,
    name: "Ingwaz",
    letter: "Ng",
    symbol: "ᛜ",
    nameEn: "Ing / Fertility",
    meaning:
      "Ingwaz is the rune of the earth god Ing — fertile completion, inner gestation, and peace earned. A cycle concludes; now is a time to store energy and prepare for the next phase in quiet contentment.",
    keywords: ["fertility", "completion", "peace", "rest", "potential"],
    polarity: "auspicious",
    domain: "love",
  },
  {
    number: 23,
    name: "Dagaz",
    letter: "D",
    symbol: "ᛞ",
    nameEn: "Day / Breakthrough",
    meaning:
      "Dagaz is the dawn — the transformative breakthrough between night and day. A sudden shift in consciousness, fortune, or circumstance is at hand. The darkness has passed; clarity and opportunity arrive together.",
    keywords: ["breakthrough", "dawn", "clarity", "transformation", "opportunity"],
    polarity: "auspicious",
    domain: "career",
  },
  {
    number: 24,
    name: "Othala",
    letter: "O",
    symbol: "ᛟ",
    nameEn: "Heritage / Home",
    meaning:
      "Othala is the ancestral homestead — inherited wealth, family bonds, and the wisdom passed through generations. What is enduringly yours — values, lineage, land — is highlighted. Honour roots while building the future.",
    keywords: ["heritage", "home", "ancestry", "tradition", "belonging"],
    polarity: "neutral",
    domain: "general",
  },
  {
    number: 25,
    name: "Wyrd",
    letter: "",
    symbol: "",
    nameEn: "Wyrd — The Unknown",
    meaning:
      "The blank rune represents Wyrd — the weave of fate beyond all known runes. The outcome lies entirely in the hands of the Norns. There is no fixed answer; only the invitation to release attachment and trust the unfolding.",
    keywords: ["fate", "mystery", "unknown", "surrender", "trust"],
    polarity: "neutral",
    domain: "general",
  },
];

// ─── Draw Logic ───────────────────────────────────────────────────────────────

function shuffleCopy<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawRunes(): [DrawnRune, DrawnRune, DrawnRune] {
  const pool = shuffleCopy(RUNES);
  const positions: ["past", "present", "future"] = ["past", "present", "future"];
  return [
    { position: positions[0], rune: pool[0] },
    { position: positions[1], rune: pool[1] },
    { position: positions[2], rune: pool[2] },
  ];
}

export function buildRuneInterpretation(
  reading: Omit<RuneReading, "interpretation">
): string[] {
  const lines: string[] = [];
  const [past, present, future] = reading.drawnRunes;

  if (reading.question) {
    lines.push(`Regarding your question: "${reading.question}"`);
  }

  lines.push(`Past (${past.rune.symbol || "⬜"} ${past.rune.name}): ${past.rune.meaning}`);
  lines.push(`Present (${present.rune.symbol || "⬜"} ${present.rune.name}): ${present.rune.meaning}`);
  lines.push(`Future (${future.rune.symbol || "⬜"} ${future.rune.name}): ${future.rune.meaning}`);

  const polarities = reading.drawnRunes.map((d) => d.rune.polarity);
  const auspicious = polarities.filter((p) => p === "auspicious").length;
  const challenging = polarities.filter((p) => p === "challenging").length;

  if (auspicious >= 2) {
    lines.push("The runes speak with an auspicious voice — momentum and favour attend your path.");
  } else if (challenging >= 2) {
    lines.push("The runes urge patience and careful navigation — obstacles carry hidden lessons.");
  } else {
    lines.push("The runes offer a balanced perspective; both opportunity and caution are present in this reading.");
  }

  return lines;
}

export function performRuneReading(question?: string): RuneReading {
  const drawnRunes = drawRunes();
  const base = { drawnRunes, question };
  const interpretation = buildRuneInterpretation(base);
  return { ...base, interpretation };
}
