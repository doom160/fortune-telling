export type GuanyinOutcome = "Auspicious" | "Mixed" | "Caution";

export type GuanyinLot = {
  number: number;
  title: string;
  poem: string;
  outcome: GuanyinOutcome;
  summary: string;
  career: string;
  finance: string;
  love: string;
  health: string;
  guidance: string;
};

const REFERENCE_SOURCE =
  "https://kuanyinlots.blogspot.com/2009/02/goddess-of-mercy-kuan-yin-100-divine.html";

type LotSeed = {
  number: number;
  title: string;
};

const LOT_SEEDS: LotSeed[] = [
  { number: 1, title: "Creation and Ripeness" },
  { number: 2, title: "Young Fish Awaiting Dragon Gate" },
  { number: 3, title: "Swallow Building Against Rain" },
  { number: 4, title: "Broken Mirror Restored" },
  { number: 5, title: "Digging Deep to Find Water" },
  { number: 6, title: "Hermit in the Cave" },
  { number: 7, title: "Boat in Muddy Current" },
  { number: 8, title: "Pine and Cypress Endure" },
  { number: 9, title: "Full Moon of Upright Heart" },
  { number: 10, title: "Treasure at Home" },
  { number: 11, title: "Arrow Hits Running Deer" },
  { number: 12, title: "Misfortune Turns to Fortune" },
  { number: 13, title: "Golden Mantle and Noble Rise" },
  { number: 14, title: "Fairy Crane Escapes the Cage" },
  { number: 15, title: "Bird Seeking Forest Shelter" },
  { number: 16, title: "Jade Found in Dung" },
  { number: 17, title: "Drawing a Cake to Satisfy Hunger" },
  { number: 18, title: "Sun and Moon in Balance" },
  { number: 19, title: "Ferry Through Swirling Gorge" },
  { number: 20, title: "Long Rain Clears" },
  { number: 21, title: "Dragon and Serpent Union" },
  { number: 22, title: "Timely Rain After Drought" },
  { number: 23, title: "Moon Laurel Beyond Reach" },
  { number: 24, title: "Withered Blossoms on Ocean" },
  { number: 25, title: "Old Well Replenished" },
  { number: 26, title: "Empty Glory and Titles" },
  { number: 27, title: "Strong Fence and Secure Home" },
  { number: 28, title: "Moon Veiled by Clouds" },
  { number: 29, title: "Sacred Sword Unsheathed" },
  { number: 30, title: "Secret Arrow and Hidden Snake" },
  { number: 31, title: "Calm Tea After Labor" },
  { number: 32, title: "Jade Hidden in Rock" },
  { number: 33, title: "Searching Gold, Missing Nearby Jade" },
  { number: 34, title: "Red Sun and Upright Conduct" },
  { number: 35, title: "Restoring Family Name" },
  { number: 36, title: "Monkey Frees from Golden Chain" },
  { number: 37, title: "Candle Flickers in Wind" },
  { number: 38, title: "Dark Clouds Cover Moon" },
  { number: 39, title: "Stone Cannot Become Mirror" },
  { number: 40, title: "Moon Rises as Sun Wanes" },
  { number: 41, title: "Treating Thief as Son" },
  { number: 42, title: "Heavenly Favor Bestowed" },
  { number: 43, title: "Heaven and Earth in Concord" },
  { number: 44, title: "Diamond Meets Diamond" },
  { number: 45, title: "Tenderness Conquers Strength" },
  { number: 46, title: "Withered Tree Blossoms Again" },
  { number: 47, title: "Embroidered Silk and Honor" },
  { number: 48, title: "Partridge Turns to Roc" },
  { number: 49, title: "Water Freezes Then Thaws" },
  { number: 50, title: "Treasure Ship with Favorable Wind" },
  { number: 51, title: "Heat Relieved by Cool Breeze" },
  { number: 52, title: "Moon Reflection Cannot Be Caught" },
  { number: 53, title: "Tiger and Dragon Triumphant" },
  { number: 54, title: "Dream Riches Are Empty" },
  { number: 55, title: "Bamboo and Lasting Prosperity" },
  { number: 56, title: "Rocky Stream and Hard Effort" },
  { number: 57, title: "Motherly Care and Shared Joy" },
  { number: 58, title: "Remain Still and Content" },
  { number: 59, title: "Hide and Wait Through Storm" },
  { number: 60, title: "Adding Fuel to Fire" },
  { number: 61, title: "Festival Songs and Impermanence" },
  { number: 62, title: "Buddha Behind the Screen" },
  { number: 63, title: "Compass Lost at Sea" },
  { number: 64, title: "Fish Trapped in a Net" },
  { number: 65, title: "Cutting Flesh to Patch Wound" },
  { number: 66, title: "Wrecked Boat in Rapids" },
  { number: 67, title: "Golden Scale of Fairness" },
  { number: 68, title: "Spring Blossoms and Celebration" },
  { number: 69, title: "Winter Plum Restored" },
  { number: 70, title: "Busy Bees in Fading Spring" },
  { number: 71, title: "One Bow, Two Arrows" },
  { number: 72, title: "Honey and Bee Stings" },
  { number: 73, title: "Spring Thunder Awakens All" },
  { number: 74, title: "Snow Goose in a Cage" },
  { number: 75, title: "Climbing with a Tiger" },
  { number: 76, title: "Fish and Dragon Waiting Deep" },
  { number: 77, title: "Dream Fortune and Empty Fame" },
  { number: 78, title: "Middle Way of Warm Water" },
  { number: 79, title: "False Vow Before Heaven" },
  { number: 80, title: "Sun and Moon Shine on Rule" },
  { number: 81, title: "Phoenix Leaves and Homeward Ship" },
  { number: 82, title: "Water-Lily Survives Flame" },
  { number: 83, title: "Crescent Becoming Full Moon" },
  { number: 84, title: "Fish Out of Water" },
  { number: 85, title: "Clouds Clear, Family Reunites" },
  { number: 86, title: "Audience with the Emperor" },
  { number: 87, title: "Sifting Sand for Gold" },
  { number: 88, title: "Wooden Tiger at the Gate" },
  { number: 89, title: "Hidden Jade with Noble Patron" },
  { number: 90, title: "Message from Heaven" },
  { number: 91, title: "Wide Road Opens Ahead" },
  { number: 92, title: "Merchant Rises by Diligence" },
  { number: 93, title: "Phoenix Feathers Soaked by Rain" },
  { number: 94, title: "Virtuous Keep Apart from Villains" },
  { number: 95, title: "Step-by-Step Achievement" },
  { number: 96, title: "Seven-Storey Pagoda of Merit" },
  { number: 97, title: "Candle Shadow in Wind" },
  { number: 98, title: "Bird Trapped in Waiting Net" },
  { number: 99, title: "Whipping Horse Without Reins" },
  { number: 100, title: "Final Lot: Stay Unchanged" },
];

const AUSPICIOUS = new Set<number>([
  1, 4, 8, 9, 11, 13, 14, 18, 20, 21, 22, 25, 29, 34, 35, 42, 43, 45, 47, 48, 50,
  55, 56, 57, 61, 62, 67, 68, 73, 78, 80, 81, 86, 89, 90, 91, 92, 96,
]);

const CAUTION = new Set<number>([
  3, 6, 7, 15, 17, 19, 24, 26, 28, 30, 37, 38, 39, 41, 49, 52, 54, 58, 60, 63, 64,
  65, 66, 70, 71, 72, 74, 75, 77, 79, 82, 84, 88, 93, 94, 97, 98, 99, 100,
]);

const LOTS: GuanyinLot[] = LOT_SEEDS.map((seed) => buildLot(seed));

function buildLot(seed: LotSeed): GuanyinLot {
  const outcome: GuanyinOutcome = AUSPICIOUS.has(seed.number)
    ? "Auspicious"
    : CAUTION.has(seed.number)
      ? "Caution"
      : "Mixed";

  return {
    number: seed.number,
    title: seed.title,
    poem: buildPoem(seed, outcome),
    outcome,
    summary: buildSummary(seed.title, outcome),
    career: buildDomainLine("career", outcome, seed.title),
    finance: buildDomainLine("finance", outcome, seed.title),
    love: buildDomainLine("love", outcome, seed.title),
    health: buildDomainLine("health", outcome, seed.title),
    guidance: buildGuidance(outcome),
  };
}

function buildPoem(seed: LotSeed, outcome: GuanyinOutcome): string {
  if (outcome === "Auspicious") {
    return `Lot ${seed.number}: ${seed.title}.\n\nThe image of "${seed.title}" speaks of momentum aligning with virtue. When the time is ripe, even small efforts bear abundant fruit. Heaven favors those who prepare with sincerity and act with humility. Trust the process — what you have set in motion is finding its natural course.`;
  }
  if (outcome === "Caution") {
    return `Lot ${seed.number}: ${seed.title}.\n\nThe image of "${seed.title}" urges restraint and careful observation. Not every open door leads to safety, and not every invitation should be accepted. This is a time for protecting what you have, strengthening your foundations, and waiting for clearer signs before committing to major changes.`;
  }
  return `Lot ${seed.number}: ${seed.title}.\n\nThe image of "${seed.title}" suggests a crossroads where neither path is entirely clear. Partial progress is still progress — move forward in measured steps, verify each decision before committing fully, and remain flexible. The situation holds both promise and uncertainty in equal measure.`;
}

function buildSummary(title: string, outcome: GuanyinOutcome): string {
  if (outcome === "Auspicious") {
    return `The sign of "${title}" carries a favorable reading. This lot indicates supportive momentum when action is grounded and ethical. The energy surrounding your question is constructive — conditions are aligning in your favor, provided you remain sincere and diligent. This is a good time to advance plans, build relationships, and trust in the direction you are heading.`;
  }
  if (outcome === "Caution") {
    return `The sign of "${title}" carries a cautionary reading. This lot warns against haste, pride, or overreach. The energy surrounding your question calls for patience and protection of what is already stable. Avoid making irreversible decisions during this period. Instead, focus on strengthening your position, resolving existing issues, and waiting for a clearer signal before expanding.`;
  }
  return `The sign of "${title}" carries a mixed reading. This lot suggests partial progress — conditions are neither fully favorable nor hostile. Advance carefully while strengthening fundamentals. The energy invites you to be strategic: take small, verified steps rather than bold leaps. Reassess regularly and be willing to adjust your approach as new information emerges.`;
}

function buildDomainLine(
  area: "career" | "finance" | "love" | "health",
  outcome: GuanyinOutcome,
  title: string,
): string {
  const lines = {
    career: {
      Auspicious: `The image of "${title}" suggests favorable conditions for career advancement. This is a good time for structured moves, proposals, and taking on visible responsibility. Your professional efforts are likely to be recognized and rewarded. If you have been considering a new role, project, or collaboration, the timing supports action — move forward with confidence while maintaining your integrity and attention to detail.`,
      Mixed: `The image of "${title}" suggests a period of gradual professional development. Career progress is possible, but it requires patience, careful sequencing, and clear communication. Avoid rushing into major changes or expecting immediate results. Focus on building competence, strengthening relationships with colleagues and mentors, and positioning yourself for the next opening rather than forcing one.`,
      Caution: `The image of "${title}" advises caution in professional matters. This is not the time for risky career shifts, confrontations with authority, or political maneuvering. Consolidate your current position before seeking expansion. If conflicts arise at work, handle them with diplomacy and restraint. Protect your reputation and focus on steady, reliable performance rather than attention-seeking moves.`,
    },
    finance: {
      Auspicious: `The image of "${title}" points to steady financial conditions. Gains are likely through disciplined planning, practical investments, and deals built on real value. Your financial instincts are reliable during this period — trust them while maintaining prudent reserves. This is a favorable time for negotiating contracts, making purchases you have carefully considered, or investing in things that will appreciate over time.`,
      Mixed: `The image of "${title}" calls for a balanced approach to finances. Keep a careful budget and prioritize resilience over aggressive growth. Some financial movement is expected, but results may be uneven. Avoid large speculative commitments and focus instead on maintaining a healthy cash flow. This is a time for financial discipline rather than bold bets — the steady approach will serve you best.`,
      Caution: `The image of "${title}" warns of financial vulnerability. Guard your cash flow carefully, avoid speculation and unnecessary spending, and cut non-essential outflows. If presented with investment opportunities that seem too good to be true, they likely are. This is a period for conservation, not expansion. Pay down debts, build emergency reserves, and delay major purchases until the energy shifts to a more supportive pattern.`,
    },
    love: {
      Auspicious: `The image of "${title}" smiles on matters of the heart. Relationships benefit from sincerity, consistency, and genuine warmth during this period. If you are in a partnership, this is a time for deepening connection, resolving old misunderstandings, and building shared plans. If you are seeking love, remain open and authentic — the conditions favor meaningful encounters over superficial ones.`,
      Mixed: `The image of "${title}" suggests a period of relational adjustment. Slow, honest conversations and realistic expectations will prevent friction. Relationships may feel somewhat uncertain or in transition — this is normal and not a cause for alarm. Focus on understanding rather than persuading, listening rather than demanding. Patience now builds the foundation for stronger connection later.`,
      Caution: `The image of "${title}" advises emotional restraint in relationships. Reduce escalation, avoid reactive arguments, and choose honesty and clear boundaries over dramatic gestures. If a relationship is under strain, this is not the time to force resolution — give space and allow emotions to settle. Protect your emotional wellbeing by being selective about who you invest energy in during this period.`,
    },
    health: {
      Auspicious: `The image of "${title}" indicates a supportive period for health and vitality. Recovery, energy, and overall wellbeing improve with consistent routine, adequate rest, and moderation. Your body is responsive to positive changes during this time — establishing healthy habits now will yield lasting benefits. Trust your body's signals and give yourself permission to rest when needed.`,
      Mixed: `The image of "${title}" suggests uneven energy levels. Pay close attention to sleep quality, digestive health, and stress regulation. You may have days of strong vitality followed by periods of fatigue — this fluctuation is part of the current pattern. Support yourself with regular meals, gentle movement, and boundaries around overcommitment. Don't push through exhaustion; listen to your body.`,
      Caution: `The image of "${title}" calls for heightened attention to health. Prioritize preventive care, regular check-ups, and avoid exhaustion from overcommitment. This is not the time to start intense new fitness programs or ignore warning signs from your body. Rest, recover, and focus on maintenance rather than peak performance. If you have been delaying medical appointments, schedule them now.`,
    },
  } as const;

  return lines[area][outcome];
}

function buildGuidance(outcome: GuanyinOutcome): string {
  if (outcome === "Auspicious") {
    return "Act with humility and follow through on your intentions. Favorable timing still requires disciplined effort and genuine sincerity. Do not become complacent or take good fortune for granted — the blessing deepens when met with gratitude and continued diligence. Share your good fortune with others when possible.";
  }
  if (outcome === "Caution") {
    return "Pause, simplify, and protect your foundations. This is a time for patience, not action. Delay irreversible decisions until you have greater clarity. Focus on what is within your control — your attitude, your habits, your integrity. The storm will pass, and your steadiness during this period will define what comes next.";
  }
  return "Take the middle way: move forward in small, verified steps and reassess often. Neither rush nor freeze — stay present and responsive. This is a period that rewards flexibility, humility, and honest self-assessment. Trust that clarity will emerge gradually as you take each next right step.";
}

export type GuanyinReading = {
  lot: GuanyinLot;
  question?: string;
  focus?: string;
};

export function drawRandomGuanyinLot(): GuanyinLot {
  const idx = Math.floor(Math.random() * LOTS.length);
  return LOTS[idx];
}

export function getGuanyinLotByNumber(number: number): GuanyinLot | undefined {
  return LOTS.find((lot) => lot.number === number);
}

export function buildGuanyinReading(params: {
  question?: string;
  focus?: string;
  lotNumber?: number;
}): GuanyinReading {
  const lot =
    typeof params.lotNumber === "number" && Number.isFinite(params.lotNumber)
      ? getGuanyinLotByNumber(params.lotNumber) || drawRandomGuanyinLot()
      : drawRandomGuanyinLot();

  return {
    lot,
    question: params.question?.trim() || undefined,
    focus: params.focus?.trim() || undefined,
  };
}

export const GUANYIN_FOCUS_OPTIONS = [
  "General",
  "Career",
  "Finance",
  "Love",
  "Health",
  "Family",
  "Legal",
  "Travel",
];

export const GUANYIN_MAX_LOT = LOTS.length;
