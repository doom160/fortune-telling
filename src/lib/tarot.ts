export type TarotSuit = "Wands" | "Cups" | "Swords" | "Pentacles" | "Major";
export type TarotPosition = "Past" | "Present" | "Future" | "Advice" | "Outcome" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
export type CardOrientation = "Upright" | "Reversed";

export type TarotCard = {
  id: number;
  name: string;
  suit: TarotSuit;
  number: number | string;
  imagePath: string;
  upright: {
    meaning: string;
    keywords: string[];
  };
  reversed: {
    meaning: string;
    keywords: string[];
  };
  archetype: string;
  element?: string;
  astrology?: string;
};

export type TarotReading = {
  id: string;
  name?: string;
  timestamp: string;
  spread: TarotSpread;
  cards: TarotCardInstance[];
  interpretation: string[];
  notes: string[];
};

export type TarotCardInstance = {
  position: TarotPosition;
  card: TarotCard;
  orientation: CardOrientation;
};

export type TarotSpread = "ThreeCard" | "Celtic" | "Horseshoe" | "DailyCard" | "Relationship" | "Career";

export type TarotSpreadPosition = {
  key: TarotPosition;
  label: string;
  layoutArea: string;
};

const MAJOR_ARCANA_NAMES = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
] as const;

const SUIT_THEME: Record<Exclude<TarotSuit, "Major">, string> = {
  Cups: "emotional flow, relationships, and intuition",
  Wands: "motivation, action, and creative spark",
  Swords: "clarity, truth, and mental challenge",
  Pentacles: "resources, work, and practical growth",
};

const MINOR_RANKS: Array<{ code: string; number: string | number; label: string }> = [
  { code: "ac", number: "A", label: "Ace" },
  { code: "02", number: "2", label: "Two" },
  { code: "03", number: "3", label: "Three" },
  { code: "04", number: "4", label: "Four" },
  { code: "05", number: "5", label: "Five" },
  { code: "06", number: "6", label: "Six" },
  { code: "07", number: "7", label: "Seven" },
  { code: "08", number: "8", label: "Eight" },
  { code: "09", number: "9", label: "Nine" },
  { code: "10", number: "10", label: "Ten" },
  { code: "pa", number: "Page", label: "Page" },
  { code: "kn", number: "Knight", label: "Knight" },
  { code: "qu", number: "Queen", label: "Queen" },
  { code: "ki", number: "King", label: "King" },
];

const MINOR_SUITS: Array<{ suit: Exclude<TarotSuit, "Major">; code: string }> = [
  { suit: "Cups", code: "cu" },
  { suit: "Wands", code: "wa" },
  { suit: "Swords", code: "sw" },
  { suit: "Pentacles", code: "pe" },
];

const MAJOR_ARCANA_DATA: Array<{
  name: string;
  upright: { meaning: string; keywords: string[] };
  reversed: { meaning: string; keywords: string[] };
  archetype: string;
}> = [
  { name: "The Fool", archetype: "The Innocent Adventurer",
    upright: { meaning: "The Fool signals a leap of faith — the beginning of an adventure where the path is unknown but the spirit is willing. This card invites you to trust the process, embrace spontaneity, and step into new territory with open-hearted curiosity. It is the energy of pure potential before experience shapes it.", keywords: ["new beginning", "spontaneity", "innocence", "leap of faith", "freedom"] },
    reversed: { meaning: "The Fool reversed warns of recklessness, naivety, or hesitation that prevents necessary growth. You may be taking unnecessary risks without preparation, or conversely, fear is holding you back from a new chapter that awaits. Check whether you are avoiding a leap out of wisdom or out of fear.", keywords: ["recklessness", "hesitation", "poor judgment", "fear of change", "stagnation"] },
  },
  { name: "The Magician", archetype: "The Manifestor",
    upright: { meaning: "The Magician represents mastery, willpower, and the ability to turn vision into reality. All the tools you need are already at your disposal — this card asks you to channel your focus, commit to your intention, and act with confidence. You have more power in this situation than you may realize.", keywords: ["manifestation", "willpower", "skill", "resourcefulness", "concentration"] },
    reversed: { meaning: "The Magician reversed suggests manipulation, wasted talent, or poor planning. Your skills and resources may be scattered or misdirected. There may also be deception at play — either self-deception or someone else's. Realign your intentions before taking action.", keywords: ["manipulation", "untapped potential", "deception", "poor planning", "scattered energy"] },
  },
  { name: "The High Priestess", archetype: "The Keeper of Secrets",
    upright: { meaning: "The High Priestess calls you inward. She represents intuition, hidden knowledge, and the wisdom that comes from stillness. Not everything needs to be said or acted upon right now — trust your inner knowing, pay attention to dreams and subtle signs, and allow understanding to surface naturally.", keywords: ["intuition", "mystery", "inner wisdom", "patience", "subconscious"] },
    reversed: { meaning: "The High Priestess reversed indicates disconnection from intuition, repressed feelings, or secrets that need to surface. You may be ignoring your inner voice or over-relying on logic at the expense of deeper knowing. Take time for quiet reflection and honest self-inquiry.", keywords: ["disconnection", "repressed intuition", "secrets", "over-rationalization", "inner conflict"] },
  },
  { name: "The Empress", archetype: "The Nurturer",
    upright: { meaning: "The Empress embodies abundance, fertility, and nurturing energy. She invites you to connect with nature, creativity, and sensual pleasure. This card signals a period of growth, comfort, and creative expression — allow yourself to receive as well as give.", keywords: ["abundance", "fertility", "nurturing", "creativity", "sensuality"] },
    reversed: { meaning: "The Empress reversed suggests creative blocks, neglect of self-care, or smothering behavior. You may be giving too much without replenishing, or struggling to connect with your creative and nurturing side. Re-establish your relationship with pleasure, nature, and self-compassion.", keywords: ["creative block", "neglect", "dependence", "smothering", "disconnection from body"] },
  },
  { name: "The Emperor", archetype: "The Authority",
    upright: { meaning: "The Emperor represents structure, authority, and strategic leadership. This card calls you to establish order, set clear boundaries, and take responsibility. It is the energy of building lasting systems and leading with discipline, logic, and earned respect.", keywords: ["authority", "structure", "discipline", "leadership", "stability"] },
    reversed: { meaning: "The Emperor reversed warns of rigidity, tyranny, or loss of control. Authority may be misused — either yours or someone else's. There may be excessive control, inflexibility, or a power struggle. Question whether structure is serving you or imprisoning you.", keywords: ["rigidity", "domination", "loss of control", "inflexibility", "power struggle"] },
  },
  { name: "The Hierophant", archetype: "The Teacher",
    upright: { meaning: "The Hierophant represents tradition, spiritual wisdom, and established institutions. This card points toward learning from mentors, following time-tested practices, or seeking guidance from established systems. It honors the wisdom that has been passed down and the value of structure in spiritual growth.", keywords: ["tradition", "mentorship", "spiritual wisdom", "conformity", "institutions"] },
    reversed: { meaning: "The Hierophant reversed suggests rebellion against convention, personal belief over dogma, or disillusionment with authority. You may be questioning traditions that once served you, or seeking your own spiritual path outside institutional frameworks. Trust your own inner teacher.", keywords: ["nonconformity", "personal beliefs", "questioning tradition", "freedom", "inner authority"] },
  },
  { name: "The Lovers", archetype: "The Union",
    upright: { meaning: "The Lovers represents deep connection, alignment of values, and meaningful choice. More than romance, this card speaks to partnerships built on authenticity and the courage to choose what truly resonates with your heart. A significant decision about values, relationships, or alignment awaits.", keywords: ["love", "harmony", "partnership", "values", "meaningful choice"] },
    reversed: { meaning: "The Lovers reversed indicates disharmony, misalignment, or avoidance of a necessary choice. A relationship or decision may be out of balance — values may conflict, or you may be compromising too much. Honest self-examination about what you truly want is needed.", keywords: ["disharmony", "imbalance", "avoidance", "misaligned values", "broken trust"] },
  },
  { name: "The Chariot", archetype: "The Conqueror",
    upright: { meaning: "The Chariot signals determined forward movement, willpower, and victory through focused effort. Opposing forces are being harnessed and directed toward a goal. This card demands discipline, confidence, and the courage to stay the course despite obstacles.", keywords: ["determination", "willpower", "victory", "focus", "self-discipline"] },
    reversed: { meaning: "The Chariot reversed suggests loss of direction, aggression, or scattered energy. You may be trying to force outcomes or feeling pulled in opposing directions without resolution. Pause, realign your goals, and ensure your drive comes from clarity rather than anxiety.", keywords: ["loss of direction", "aggression", "scattered focus", "lack of control", "frustration"] },
  },
  { name: "Strength", archetype: "The Gentle Force",
    upright: { meaning: "Strength is not about brute force — it is quiet courage, compassion, and the mastery of one's inner nature. This card calls you to meet challenges with patience, lead with heart, and trust that gentle persistence overcomes far more than aggression ever could.", keywords: ["courage", "patience", "compassion", "inner strength", "self-mastery"] },
    reversed: { meaning: "Strength reversed indicates self-doubt, weakness, or losing composure under pressure. You may be struggling with confidence or allowing fear and insecurity to drive your actions. Reconnect with your inner resolve — the strength you need is already within you.", keywords: ["self-doubt", "insecurity", "weakness", "raw emotion", "loss of confidence"] },
  },
  { name: "The Hermit", archetype: "The Seeker",
    upright: { meaning: "The Hermit invites withdrawal and introspection. This is a time for solitude, soul-searching, and inner illumination. Step away from noise and distraction to find the answers that can only be heard in silence. Wisdom comes not from seeking outside, but from lighting your own lantern within.", keywords: ["introspection", "solitude", "inner guidance", "wisdom", "soul-searching"] },
    reversed: { meaning: "The Hermit reversed warns of isolation, withdrawal from life, or refusing needed guidance. Solitude can become avoidance. You may be overthinking in isolation rather than engaging with the world. Consider whether your withdrawal serves your growth or prevents it.", keywords: ["isolation", "loneliness", "withdrawal", "overthinking", "refusing guidance"] },
  },
  { name: "Wheel of Fortune", archetype: "The Cycle",
    upright: { meaning: "The Wheel of Fortune signals change, cycles, and the turning of fate. What goes up must come down, and what has been down is rising. This card reminds you that life moves in rhythms — embrace the changes, ride the momentum, and trust that this shift is part of a larger pattern.", keywords: ["change", "cycles", "destiny", "turning point", "luck"] },
    reversed: { meaning: "The Wheel reversed suggests resistance to change, bad luck, or feeling stuck in an unwanted cycle. External circumstances may feel beyond your control. Focus on what you can influence — your attitude, your choices, your response to the situation.", keywords: ["resistance to change", "setback", "stagnation", "bad timing", "loss of control"] },
  },
  { name: "Justice", archetype: "The Arbiter",
    upright: { meaning: "Justice demands truth, fairness, and accountability. This card represents consequences — the natural result of past actions. A decision is being made, and it will be fair. Approach your situation with honesty and integrity, knowing that what you put in is what you will receive.", keywords: ["truth", "fairness", "accountability", "cause and effect", "clarity"] },
    reversed: { meaning: "Justice reversed indicates unfairness, dishonesty, or avoiding accountability. A situation may feel unjust, or you may be rationalizing behavior that doesn't align with your values. Examine where honesty is being compromised — in yourself or in those around you.", keywords: ["unfairness", "dishonesty", "avoidance", "lack of accountability", "bias"] },
  },
  { name: "The Hanged Man", archetype: "The Surrenderer",
    upright: { meaning: "The Hanged Man asks you to pause, release control, and see your situation from a completely different angle. This is not a card of passivity but of intentional surrender — letting go of one perspective to gain a deeper understanding. Sometimes the most powerful move is to stop moving.", keywords: ["surrender", "new perspective", "letting go", "pause", "sacrifice"] },
    reversed: { meaning: "The Hanged Man reversed suggests stalling, unnecessary martyrdom, or resistance to a needed shift in perspective. You may be stuck in a pattern of sacrifice that serves no one, or stubbornly clinging to a viewpoint that no longer works. Release what isn't serving you.", keywords: ["stalling", "martyrdom", "resistance", "indecision", "needless sacrifice"] },
  },
  { name: "Death", archetype: "The Transformer",
    upright: { meaning: "Death is the card of profound transformation — an ending that makes way for a new beginning. Something in your life is concluding, and while the process may be uncomfortable, it is necessary and ultimately liberating. Let go of what has run its course so something new can be born.", keywords: ["transformation", "ending", "release", "renewal", "transition"] },
    reversed: { meaning: "Death reversed indicates resistance to necessary change, clinging to the past, or a transition that is stalled. You may know something needs to end but can't bring yourself to let go. The longer you resist, the more difficult the eventual transition becomes.", keywords: ["resistance to change", "stagnation", "clinging", "fear of endings", "delayed transformation"] },
  },
  { name: "Temperance", archetype: "The Alchemist",
    upright: { meaning: "Temperance represents balance, patience, and the art of blending opposing forces into harmony. This card calls for moderation, finding the middle way, and trusting the slow process of integration. Healing, diplomacy, and creative synthesis are all favored now.", keywords: ["balance", "patience", "moderation", "harmony", "healing"] },
    reversed: { meaning: "Temperance reversed warns of excess, impatience, or lack of balance. You may be overindulging, rushing a process that needs time, or struggling to find equilibrium between competing demands. Step back and recalibrate before things tip further out of alignment.", keywords: ["imbalance", "excess", "impatience", "discord", "lack of moderation"] },
  },
  { name: "The Devil", archetype: "The Shadow",
    upright: { meaning: "The Devil represents bondage, temptation, and shadow patterns — the attachments, addictions, or limiting beliefs that keep you chained. This card does not mean evil; it asks you to honestly examine what controls you. Awareness is the first step toward liberation.", keywords: ["bondage", "shadow self", "attachment", "temptation", "materialism"] },
    reversed: { meaning: "The Devil reversed signals liberation from restriction, breaking free from unhealthy patterns, or the beginning of recovery. You are gaining awareness of what has been controlling you and finding the courage to reclaim your freedom. This is a powerful turning point.", keywords: ["liberation", "breaking free", "recovery", "awareness", "release"] },
  },
  { name: "The Tower", archetype: "The Destroyer",
    upright: { meaning: "The Tower represents sudden upheaval, revelation, and the destruction of structures built on false foundations. This can be shocking and destabilizing, but it ultimately clears the way for truth and rebuilding on more authentic ground. What falls was never truly solid.", keywords: ["upheaval", "revelation", "sudden change", "destruction", "awakening"] },
    reversed: { meaning: "The Tower reversed suggests a crisis averted, delayed upheaval, or internal transformation rather than external collapse. You may be sensing that something unstable is about to shift but still have time to prepare. Use this grace period wisely.", keywords: ["averted crisis", "fear of change", "internal shift", "delayed reckoning", "resistance to upheaval"] },
  },
  { name: "The Star", archetype: "The Hope",
    upright: { meaning: "The Star brings hope, inspiration, and renewed faith after difficulty. This is a card of healing and spiritual clarity — the calm after the storm. Trust that you are on the right path. Allow yourself to be vulnerable, to dream, and to believe that the best is yet to come.", keywords: ["hope", "inspiration", "healing", "renewal", "serenity"] },
    reversed: { meaning: "The Star reversed indicates loss of faith, despair, or disconnection from hope. You may feel uninspired, doubtful, or questioning whether things will improve. This is a temporary state — reconnect with what gives you meaning, and the light will return.", keywords: ["loss of faith", "despair", "disconnection", "hopelessness", "lack of inspiration"] },
  },
  { name: "The Moon", archetype: "The Dreamer",
    upright: { meaning: "The Moon represents illusion, fear, and the realm of the subconscious. Not everything is as it appears — trust your intuition but question your assumptions. This card signals a period of uncertainty where clarity must be earned through patience and honest self-reflection.", keywords: ["illusion", "fear", "subconscious", "uncertainty", "intuition"] },
    reversed: { meaning: "The Moon reversed brings clarity emerging from confusion, fears being confronted, or truths surfacing. What was hidden or unclear is beginning to resolve. You may be releasing anxieties that have held you back and seeing your situation with greater objectivity.", keywords: ["clarity emerging", "facing fears", "truth surfacing", "release of anxiety", "deception revealed"] },
  },
  { name: "The Sun", archetype: "The Radiant",
    upright: { meaning: "The Sun is one of the most positive cards in the deck — it radiates joy, success, vitality, and the pure pleasure of being alive. Whatever you have been working toward is coming to fruition. Celebrate your achievements, share your warmth with others, and trust in the abundance of this moment.", keywords: ["joy", "success", "vitality", "abundance", "positivity"] },
    reversed: { meaning: "The Sun reversed suggests dampened enthusiasm, temporary setbacks, or difficulty seeing the positive in your situation. The light is still there but may be partially obscured. Reconnect with simple pleasures and the things that bring you genuine happiness.", keywords: ["dampened joy", "temporary setback", "over-optimism", "delayed success", "inner child needs"] },
  },
  { name: "Judgement", archetype: "The Awakener",
    upright: { meaning: "Judgement calls for a reckoning — a moment of honest self-evaluation, absolution, and spiritual awakening. This card asks you to answer a higher calling, to rise above past mistakes, and to embrace the person you are becoming. It is time for renewal and decisive action aligned with your deepest truth.", keywords: ["reckoning", "renewal", "awakening", "absolution", "higher calling"] },
    reversed: { meaning: "Judgement reversed suggests self-doubt, refusal to learn from the past, or avoiding a necessary reckoning. You may be stuck in old patterns because you haven't fully processed or forgiven what came before. The call to evolve is persistent — answer it.", keywords: ["self-doubt", "avoidance", "stagnation", "unlearned lessons", "harsh self-judgment"] },
  },
  { name: "The World", archetype: "The Completionist",
    upright: { meaning: "The World represents completion, wholeness, and the successful end of a major cycle. You have arrived at a place of accomplishment and integration. Celebrate how far you have come while preparing for the next chapter. This is a moment of fulfillment, travel, and expanded horizons.", keywords: ["completion", "wholeness", "accomplishment", "integration", "fulfillment"] },
    reversed: { meaning: "The World reversed suggests incompletion, delays in reaching a goal, or a feeling of being close but not quite there. There may be loose ends to tie up or inner work needed before this cycle can truly close. Don't rush the ending — complete what needs completing.", keywords: ["incompletion", "delay", "lack of closure", "shortcuts", "unfinished business"] },
  },
];

const MAJOR_ARCANA: TarotCard[] = MAJOR_ARCANA_DATA.map((data, idx) => ({
  id: idx,
  name: data.name,
  suit: "Major",
  number: idx,
  imagePath: `/tarot/ar${String(idx).padStart(2, "0")}.jpg`,
  upright: data.upright,
  reversed: data.reversed,
  archetype: data.archetype,
}));

const RANK_ENERGY: Record<string, { upright: string; reversed: string }> = {
  Ace: {
    upright: "the seed of new potential — a pure burst of elemental energy signaling fresh beginnings and raw opportunity",
    reversed: "blocked potential or a false start — the energy is present but cannot yet find expression",
  },
  Two: {
    upright: "partnership, balance, and early-stage decisions that shape direction",
    reversed: "indecision, imbalance, or difficulty finding the right partner or approach",
  },
  Three: {
    upright: "expansion, collaboration, and the first fruits of effort beginning to show",
    reversed: "overextension, lack of planning, or creative blocks that stall growth",
  },
  Four: {
    upright: "stability, structure, and a period of consolidation and rest",
    reversed: "restlessness, rigidity, or refusing to adapt when change is needed",
  },
  Five: {
    upright: "conflict, challenge, and the growth that comes from navigating difficulty",
    reversed: "avoidance of necessary struggle, or a conflict reaching its resolution",
  },
  Six: {
    upright: "harmony, generosity, and the rewards of past effort flowing naturally",
    reversed: "imbalance in giving and receiving, or nostalgia preventing forward movement",
  },
  Seven: {
    upright: "reflection, assessment, and strategic patience before the next move",
    reversed: "deception, impatience, or taking shortcuts that undermine long-term progress",
  },
  Eight: {
    upright: "momentum, mastery, and rapid progress through focused discipline",
    reversed: "stagnation, perfectionism, or feeling trapped in repetitive patterns",
  },
  Nine: {
    upright: "near-completion, personal fulfillment, and the wisdom of experience",
    reversed: "anxiety about outcomes, isolation, or lingering doubts despite progress",
  },
  Ten: {
    upright: "completion of a cycle, culmination, and the full expression of the suit's energy",
    reversed: "burden of excess, resistance to closure, or an ending that feels unresolved",
  },
  Page: {
    upright: "curiosity, new messages, and the enthusiastic beginning of learning in this realm",
    reversed: "immaturity, unreliable information, or reluctance to engage with growth opportunities",
  },
  Knight: {
    upright: "action, pursuit, and passionate movement toward a goal with youthful energy",
    reversed: "reckless action, scattered direction, or burnout from pursuing too many things",
  },
  Queen: {
    upright: "mastery through nurturing, emotional intelligence, and receptive power",
    reversed: "codependence, moodiness, or suppressed emotional wisdom needing expression",
  },
  King: {
    upright: "authority, mature command, and the wise integration of this elemental energy",
    reversed: "misuse of authority, emotional detachment, or rigid control that alienates others",
  },
};

const MINOR_ARCANA: TarotCard[] = MINOR_SUITS.flatMap(({ suit, code }, suitIdx) =>
  MINOR_RANKS.map((rank, rankIdx) => {
    const name = `${rank.label} of ${suit}`;
    const rankEnergy = RANK_ENERGY[rank.label] || RANK_ENERGY["Ace"];
    return {
      id: suitIdx * 100 + rankIdx,
      name,
      suit,
      number: rank.number,
      imagePath: `/tarot/${code}${rank.code}.jpg`,
      upright: {
        meaning: `${name} represents ${rankEnergy.upright}. In the realm of ${SUIT_THEME[suit]}, this signals a constructive phase where these themes move forward with clarity and purpose.`,
        keywords: [suit.toLowerCase(), rank.label.toLowerCase(), "progress", "clarity", "momentum"],
      },
      reversed: {
        meaning: `${name} reversed indicates ${rankEnergy.reversed}. Around themes of ${SUIT_THEME[suit]}, there may be friction, delay, or a need to reconsider your approach before proceeding.`,
        keywords: [suit.toLowerCase(), rank.label.toLowerCase(), "reflection", "adjustment", "patience"],
      },
      archetype: `${suit} archetype — ${rank.label}`,
    };
  }),
);

const ALL_TAROT_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

const SPREAD_DEFINITIONS: Record<
  TarotSpread,
  {
    label: string;
    description: string;
    positions: TarotSpreadPosition[];
  }
> = {
  ThreeCard: {
    label: "Three-Card Reading",
    description: "Past, present, and future shown in a straight line.",
    positions: [
      { key: "Past", label: "Past", layoutArea: "past" },
      { key: "Present", label: "Present", layoutArea: "present" },
      { key: "Future", label: "Future", layoutArea: "future" },
    ],
  },
  DailyCard: {
    label: "Daily Guidance",
    description: "A single card for the energy of the day.",
    positions: [{ key: "1", label: "Daily Insight", layoutArea: "single" }],
  },
  Relationship: {
    label: "Relationship Spread",
    description: "Six cards mapping both sides of a connection and where it is heading.",
    positions: [
      { key: "1", label: "You", layoutArea: "r1" },
      { key: "2", label: "Other Person", layoutArea: "r2" },
      { key: "3", label: "Shared Dynamic", layoutArea: "r3" },
      { key: "4", label: "Challenge", layoutArea: "r4" },
      { key: "5", label: "Guidance", layoutArea: "r5" },
      { key: "6", label: "Outcome", layoutArea: "r6" },
    ],
  },
  Career: {
    label: "Career Spread",
    description: "Six cards focused on current work, obstacles, opportunities, and next steps.",
    positions: [
      { key: "1", label: "Current Role", layoutArea: "r1" },
      { key: "2", label: "Strength", layoutArea: "r2" },
      { key: "3", label: "Obstacle", layoutArea: "r3" },
      { key: "4", label: "Opportunity", layoutArea: "r4" },
      { key: "5", label: "Advice", layoutArea: "r5" },
      { key: "6", label: "Outcome", layoutArea: "r6" },
    ],
  },
  Horseshoe: {
    label: "Horseshoe Spread",
    description: "Seven cards arcing from past through outcome for a broad situation scan.",
    positions: [
      { key: "1", label: "Past", layoutArea: "h1" },
      { key: "2", label: "Present", layoutArea: "h2" },
      { key: "3", label: "Hidden Influences", layoutArea: "h3" },
      { key: "4", label: "Obstacle", layoutArea: "h4" },
      { key: "5", label: "External Forces", layoutArea: "h5" },
      { key: "6", label: "Advice", layoutArea: "h6" },
      { key: "7", label: "Outcome", layoutArea: "h7" },
    ],
  },
  Celtic: {
    label: "Celtic Cross",
    description: "The classic ten-card cross and staff layout for a full reading.",
    positions: [
      { key: "1", label: "Present Situation", layoutArea: "center" },
      { key: "2", label: "Challenge", layoutArea: "center" },
      { key: "3", label: "Foundation", layoutArea: "bottom" },
      { key: "4", label: "Past", layoutArea: "left" },
      { key: "5", label: "Conscious Aim", layoutArea: "top" },
      { key: "6", label: "Near Future", layoutArea: "right" },
      { key: "7", label: "Self", layoutArea: "staff1" },
      { key: "8", label: "Environment", layoutArea: "staff2" },
      { key: "9", label: "Hopes and Fears", layoutArea: "staff3" },
      { key: "10", label: "Outcome", layoutArea: "staff4" },
    ],
  },
};

const SUIT_SYMBOLS: Record<TarotSuit, string> = {
  Major: "Sun",
  Cups: "Cup",
  Wands: "Wand",
  Swords: "Blade",
  Pentacles: "Coin",
};

const SUIT_COLORS: Record<TarotSuit, { frame: string; accent: string; glow: string }> = {
  Major: { frame: "#2b2e59", accent: "#f2c84b", glow: "#8f6de1" },
  Cups: { frame: "#275d8c", accent: "#9ad7ff", glow: "#5a92d6" },
  Wands: { frame: "#7d3f1c", accent: "#ffb15e", glow: "#cf6b2d" },
  Swords: { frame: "#4a5463", accent: "#dce7ef", glow: "#7d8da1" },
  Pentacles: { frame: "#5b5a22", accent: "#efdf83", glow: "#aa9a3a" },
};

export function getRandomCard(): TarotCard {
  return ALL_TAROT_CARDS[Math.floor(Math.random() * ALL_TAROT_CARDS.length)];
}

export function getRandomCards(count: number): TarotCard[] {
  const cards: TarotCard[] = [];
  const used = new Set<number>();

  while (cards.length < Math.min(count, ALL_TAROT_CARDS.length)) {
    const index = Math.floor(Math.random() * ALL_TAROT_CARDS.length);
    if (!used.has(index)) {
      used.add(index);
      cards.push(ALL_TAROT_CARDS[index]);
    }
  }

  return cards;
}

export function getCardOrientation(): CardOrientation {
  return Math.random() > 0.5 ? "Upright" : "Reversed";
}

export function getSpreadDefinition(spread: TarotSpread) {
  return SPREAD_DEFINITIONS[spread];
}

export function getSpreadPositionLabel(spread: TarotSpread, position: TarotPosition): string {
  return (
    SPREAD_DEFINITIONS[spread].positions.find((entry) => entry.key === position)?.label ?? position
  );
}

export function getTarotCardImageSrc(
  card: TarotCard,
  orientation: CardOrientation,
): string {
  if (card.imagePath) {
    return card.imagePath;
  }

  return getTarotCardArtDataUri(card, orientation);
}

export function getTarotCardArtDataUri(
  card: TarotCard,
  orientation: CardOrientation,
): string {
  const palette = SUIT_COLORS[card.suit];
  const orientationMark = orientation === "Reversed" ? "Reversed" : "Upright";
  const cardNumber = typeof card.number === "number" ? String(card.number) : card.number;
  const symbol = SUIT_SYMBOLS[card.suit];
  const safeName = escapeXml(card.name);
  const safeSuit = escapeXml(card.suit);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="460" viewBox="0 0 280 460" role="img" aria-label="${safeName}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${palette.frame}" />
          <stop offset="100%" stop-color="#10151d" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.8" />
          <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect x="10" y="10" width="260" height="440" rx="20" fill="url(#bg)" stroke="#e5d8b8" stroke-width="4" />
      <rect x="24" y="24" width="232" height="412" rx="14" fill="none" stroke="${palette.accent}" stroke-opacity="0.6" />
      <circle cx="140" cy="170" r="74" fill="url(#glow)" />
      <text x="36" y="52" fill="#f8f2de" font-family="Georgia, serif" font-size="24">${escapeXml(cardNumber)}</text>
      <text x="244" y="52" fill="#f8f2de" font-family="Georgia, serif" font-size="18" text-anchor="end">${escapeXml(symbol)}</text>
      <g transform="translate(140 190)">
        <circle cx="0" cy="0" r="52" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-dasharray="4 8" />
        <text x="0" y="10" fill="#fff7df" font-family="Georgia, serif" font-size="28" text-anchor="middle">${escapeXml(symbol)}</text>
      </g>
      <text x="140" y="308" fill="#f8f2de" font-family="Georgia, serif" font-size="24" text-anchor="middle">${safeName}</text>
      <text x="140" y="338" fill="${palette.accent}" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">${safeSuit} · ${escapeXml(orientationMark)}</text>
      <text x="140" y="395" fill="#d3d9e8" font-family="Arial, sans-serif" font-size="13" text-anchor="middle">${escapeXml(card.archetype)}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function performTarotReading(
  spread: TarotSpread,
  name?: string,
): TarotReading {
  const positions = SPREAD_DEFINITIONS[spread].positions.map((entry) => entry.key);

  const cards = getRandomCards(positions.length);
  const instances: TarotCardInstance[] = cards.map((card, idx) => ({
    position: positions[idx],
    card,
    orientation: getCardOrientation(),
  }));

  const interpretation = buildTarotInterpretation(instances, spread, name);

  return {
    id: Math.random().toString(36).substring(7),
    name,
    timestamp: new Date().toISOString(),
    spread,
    cards: instances,
    interpretation,
    notes: [
      `Tarot spread: ${spread}`,
      "This reading is for entertainment and reflection purposes.",
      "Consider this as guidance for personal growth and understanding.",
    ],
  };
}

function cardMeaning(c: TarotCardInstance): string {
  return c.orientation === "Upright" ? c.card.upright.meaning : c.card.reversed.meaning;
}

function cardKeywords(c: TarotCardInstance): string {
  const kw = c.orientation === "Upright" ? c.card.upright.keywords : c.card.reversed.keywords;
  return kw.join(", ");
}

function buildTarotInterpretation(
  cards: TarotCardInstance[],
  spread: TarotSpread,
  name?: string,
): string[] {
  const profileName = name?.trim() ? name.trim() : "This reading";
  const lines: string[] = [];

  lines.push("## Spread Overview");
  const cardSummary = cards
    .map((c) => `${getSpreadPositionLabel(spread, c.position)}: ${c.card.name} (${c.orientation})`)
    .join(", ");
  lines.push(`${profileName} draws the cards in a ${SPREAD_DEFINITIONS[spread].label}: ${cardSummary}.`);

  const majorCount = cards.filter((c) => c.card.suit === "Major").length;
  const reversedCount = cards.filter((c) => c.orientation === "Reversed").length;
  if (majorCount > 0) {
    lines.push(`This spread contains ${majorCount} Major Arcana card${majorCount > 1 ? "s" : ""}, suggesting significant life themes and karmic lessons are at play. Major Arcana cards carry heavier weight and point to forces that shape your deeper journey.`);
  }
  if (reversedCount > 0) {
    lines.push(`${reversedCount} card${reversedCount > 1 ? "s appear" : " appears"} reversed, indicating areas where energy is blocked, internalized, or in the process of being integrated. Reversals invite you to look beneath the surface.`);
  }

  if (spread === "ThreeCard") {
    buildThreeCardInterpretation(cards, lines);
  } else if (spread === "DailyCard") {
    buildDailyCardInterpretation(cards, lines);
  } else if (spread === "Relationship") {
    buildRelationshipInterpretation(cards, lines);
  } else if (spread === "Career") {
    buildCareerInterpretation(cards, lines);
  } else if (spread === "Horseshoe") {
    buildHorseshoeInterpretation(cards, lines);
  } else if (spread === "Celtic") {
    buildCelticInterpretation(cards, lines);
  }

  lines.push("## Synthesis");
  lines.push(buildSynthesisParagraph(cards, spread, profileName));

  return lines;
}

function buildThreeCardInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const past = cards.find((c) => c.position === "Past");
  const present = cards.find((c) => c.position === "Present");
  const future = cards.find((c) => c.position === "Future");

  lines.push("## Past");
  if (past) {
    lines.push(`The ${past.card.name} (${past.orientation}) represents the energies and events that have shaped your current situation. ${cardMeaning(past)} This card illuminates what you are carrying forward — lessons learned, patterns established, and foundations laid.`);
  }

  lines.push("## Present");
  if (present) {
    lines.push(`The ${present.card.name} (${present.orientation}) captures the essence of where you stand right now. ${cardMeaning(present)} This is the energy you are actively working with — the central force shaping your day-to-day experience and decision-making.`);
  }

  lines.push("## Future");
  if (future) {
    lines.push(`The ${future.card.name} (${future.orientation}) reveals the trajectory emerging from your current path. ${cardMeaning(future)} Remember that the future is not fixed — this card shows the most likely outcome given your present course, and conscious choices can always redirect the flow.`);
  }
}

function buildDailyCardInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const card = cards[0];
  lines.push("## Daily Insight");
  lines.push(`Your card for the day is the ${card.card.name} (${card.orientation}). ${cardMeaning(card)}`);
  lines.push(`Themes to carry with you today: ${cardKeywords(card)}. Let these qualities inform your interactions, decisions, and inner dialogue throughout the day. Notice where this energy shows up naturally and where it asks you to stretch.`);
  lines.push(`As an archetype, the ${card.card.name} invites you to embody the energy of "${card.card.archetype}" — consider what aspect of this role resonates with your current circumstances and how you can channel it constructively.`);
}

function buildRelationshipInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const positions = ["You", "Other Person", "Shared Dynamic", "Challenge", "Guidance", "Outcome"];
  const keys: TarotPosition[] = ["1", "2", "3", "4", "5", "6"];

  for (let i = 0; i < keys.length; i++) {
    const c = cards.find((card) => card.position === keys[i]);
    if (!c) continue;
    lines.push(`## ${positions[i]}`);
    const context = i === 0
      ? "This card reflects your energy, role, and emotional posture within this connection."
      : i === 1
        ? "This card reflects the other person's energy, perspective, and emotional stance."
        : i === 2
          ? "This card reveals the shared energy between you — the dynamic that emerges when you come together."
          : i === 3
            ? "This card highlights the primary challenge or tension within the relationship that needs attention."
            : i === 4
              ? "This card offers guidance on how to navigate the relationship with greater wisdom and care."
              : "This card suggests the most likely direction the relationship is heading given the current energies.";
    lines.push(`${c.card.name} (${c.orientation}) — ${context} ${cardMeaning(c)}`);
  }
}

function buildCareerInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const positions = ["Current Role", "Strength", "Obstacle", "Opportunity", "Advice", "Outcome"];
  const keys: TarotPosition[] = ["1", "2", "3", "4", "5", "6"];
  const contexts = [
    "This card reflects your current professional standing, how you are perceived, and the energy you bring to your work.",
    "This card highlights your core professional strength — the asset you can leverage most effectively right now.",
    "This card reveals the primary obstacle or resistance in your career path that requires attention or strategy.",
    "This card points to an emerging opportunity — a door that is opening or about to open if you position yourself well.",
    "This card offers professional guidance on how to navigate your career with greater clarity and purpose.",
    "This card suggests the most likely professional outcome given the current trajectory and energies at play.",
  ];

  for (let i = 0; i < keys.length; i++) {
    const c = cards.find((card) => card.position === keys[i]);
    if (!c) continue;
    lines.push(`## ${positions[i]}`);
    lines.push(`${c.card.name} (${c.orientation}) — ${contexts[i]} ${cardMeaning(c)}`);
  }
}

function buildHorseshoeInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const positions = ["Past", "Present", "Hidden Influences", "Obstacle", "External Forces", "Advice", "Outcome"];
  const keys: TarotPosition[] = ["1", "2", "3", "4", "5", "6", "7"];
  const contexts = [
    "This card reveals the recent past — events, decisions, and energies that have led to your current situation.",
    "This card captures the essence of your present moment and the central energy you are working with.",
    "This card exposes hidden influences — factors operating beneath the surface that you may not be fully aware of yet.",
    "This card highlights the primary obstacle standing between you and your desired outcome.",
    "This card reveals external forces and environmental factors beyond your direct control that are shaping the situation.",
    "This card offers wise counsel on the best approach to take in navigating the current landscape.",
    "This card suggests the most probable outcome given the interplay of all the forces revealed in this spread.",
  ];

  for (let i = 0; i < keys.length; i++) {
    const c = cards.find((card) => card.position === keys[i]);
    if (!c) continue;
    lines.push(`## ${positions[i]}`);
    lines.push(`${c.card.name} (${c.orientation}) — ${contexts[i]} ${cardMeaning(c)}`);
  }
}

function buildCelticInterpretation(cards: TarotCardInstance[], lines: string[]): void {
  const positions = [
    "Present Situation", "Challenge", "Foundation", "Past", "Conscious Aim",
    "Near Future", "Self", "Environment", "Hopes and Fears", "Outcome",
  ];
  const keys: TarotPosition[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const contexts = [
    "This is the heart of the matter — the central issue or energy that defines your current situation.",
    "This card crosses you, representing the immediate challenge or opposing force that creates tension.",
    "This card lies beneath you, representing the foundation and root cause of the situation — what it is truly built upon.",
    "This card represents the recent past and the influences that are now receding but still color the present.",
    "This card crowns you, representing your conscious aim, best possible outcome, or the ideal you are reaching toward.",
    "This card represents the near future — what is about to enter your experience in the coming weeks.",
    "This card reveals how you see yourself in this situation — your inner attitude, self-perception, and personal stance.",
    "This card reveals your environment — how others perceive you and the external influences surrounding you.",
    "This card exposes your deepest hopes and fears — often two sides of the same coin, revealing what drives and what haunts you.",
    "This is the final outcome — the culmination of all forces, choices, and energies revealed in this spread.",
  ];

  for (let i = 0; i < keys.length; i++) {
    const c = cards.find((card) => card.position === keys[i]);
    if (!c) continue;
    lines.push(`## ${positions[i]}`);
    lines.push(`${c.card.name} (${c.orientation}) — ${contexts[i]} ${cardMeaning(c)}`);
  }
}

function buildSynthesisParagraph(cards: TarotCardInstance[], spread: TarotSpread, profileName: string): string {
  const suits = cards.map((c) => c.card.suit);
  const suitCounts: Partial<Record<TarotSuit, number>> = {};
  for (const s of suits) {
    suitCounts[s] = (suitCounts[s] || 0) + 1;
  }

  const dominantSuit = Object.entries(suitCounts).sort(([, a], [, b]) => b - a)[0];
  const suitNote = dominantSuit
    ? dominantSuit[0] === "Major"
      ? "The prevalence of Major Arcana cards emphasizes that significant, life-defining forces are at work — these are not minor adjustments but deeper shifts in your journey."
      : `The concentration of ${dominantSuit[0]} cards (${dominantSuit[1]}) suggests a strong emphasis on ${SUIT_THEME[dominantSuit[0] as Exclude<TarotSuit, "Major">] || "this elemental energy"}.`
    : "";

  const orientationBalance = cards.filter((c) => c.orientation === "Upright").length;
  const orientationNote = orientationBalance === cards.length
    ? "All cards appear upright, suggesting clear, unobstructed energy flowing through this reading. The path ahead is relatively straightforward."
    : orientationBalance === 0
      ? "All cards appear reversed, indicating a period of deep internal processing, blocked energy, or significant shifts happening beneath the surface."
      : `The balance of ${orientationBalance} upright and ${cards.length - orientationBalance} reversed cards suggests a dynamic interplay between expressed and internalized energies.`;

  return `${profileName} — looking across the entire spread, the cards paint a coherent picture. ${suitNote} ${orientationNote} Take time to sit with this reading and notice which cards draw your attention most strongly — those are the messages your intuition is asking you to explore further.`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
