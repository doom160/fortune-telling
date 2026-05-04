import {
  Body,
  GeoVector,
  Ecliptic,
  SunPosition,
  EclipticGeoMoon,
  SiderealTime,
} from "astronomy-engine";
import { DateTime } from "luxon";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AstrologyInput = {
  birthDate: string;        // YYYY-MM-DD
  birthTime?: string;       // HH:mm (optional, defaults to 12:00)
  lat: number;
  lng: number;
  timeZone: string;
};

export type PlanetPosition = {
  planet: string;
  symbol: string;
  longitude: number;        // 0-360
  sign: string;
  signIndex: number;        // 0-11
  degreeInSign: number;
  minuteInDegree: number;
  house: number;            // 1-12, 0 if no houses
  retrograde: boolean;
};

export type Aspect = {
  planet1: string;
  planet2: string;
  type: AspectType;
  angle: number;
  orb: number;              // how far from exact
  applying: boolean;        // approaching exact?
};

export type TransitAspect = {
  transitPlanet: string;
  natalPlanet: string;
  type: AspectType;
  orb: number;
};

export type AspectType = "conjunction" | "opposition" | "trine" | "square" | "sextile";

export type NatalChart = {
  input: AstrologyInput;
  hasBirthTime: boolean;
  planets: PlanetPosition[];
  ascendant: number | null;
  mc: number | null;
  houses: number[];         // 12 cusp longitudes, or empty
  aspects: Aspect[];
  transitPlanets: PlanetPosition[];
  transitAspects: TransitAspect[];
  interpretation: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const PLANET_LIST: { body: Body | "Sun" | "Moon"; name: string; symbol: string }[] = [
  { body: "Sun", name: "Sun", symbol: "☉" },
  { body: "Moon", name: "Moon", symbol: "☽" },
  { body: Body.Mercury, name: "Mercury", symbol: "☿" },
  { body: Body.Venus, name: "Venus", symbol: "♀" },
  { body: Body.Mars, name: "Mars", symbol: "♂" },
  { body: Body.Jupiter, name: "Jupiter", symbol: "♃" },
  { body: Body.Saturn, name: "Saturn", symbol: "♄" },
  { body: Body.Uranus, name: "Uranus", symbol: "♅" },
  { body: Body.Neptune, name: "Neptune", symbol: "♆" },
  { body: Body.Pluto, name: "Pluto", symbol: "♇" },
];

const ASPECT_DEFS: { type: AspectType; angle: number; orb: number; lumOrb: number }[] = [
  { type: "conjunction", angle: 0, orb: 8, lumOrb: 10 },
  { type: "opposition", angle: 180, orb: 8, lumOrb: 10 },
  { type: "trine", angle: 120, orb: 8, lumOrb: 8 },
  { type: "square", angle: 90, orb: 8, lumOrb: 8 },
  { type: "sextile", angle: 60, orb: 6, lumOrb: 6 },
];

const TRANSIT_ORB = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deg2rad(d: number): number { return d * Math.PI / 180; }
function rad2deg(r: number): number { return r * 180 / Math.PI; }
function mod360(d: number): number { return ((d % 360) + 360) % 360; }

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function meanObliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const eps0 = 84381.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  return eps0 / 3600.0;
}

function signFromLongitude(lon: number): { sign: string; signIndex: number; degreeInSign: number; minuteInDegree: number } {
  const idx = Math.floor(lon / 30) % 12;
  const deg = lon % 30;
  return {
    sign: SIGNS[idx],
    signIndex: idx,
    degreeInSign: Math.floor(deg),
    minuteInDegree: Math.round((deg - Math.floor(deg)) * 60),
  };
}

function isLuminary(name: string): boolean {
  return name === "Sun" || name === "Moon";
}

// ─── Planet Positions ────────────────────────────────────────────────────────

function getPlanetLongitude(body: Body | "Sun" | "Moon", date: Date): number {
  if (body === "Sun") {
    return SunPosition(date).elon;
  }
  if (body === "Moon") {
    return EclipticGeoMoon(date).lon;
  }
  const vec = GeoVector(body as Body, date, true);
  return Ecliptic(vec).elon;
}

function isRetrograde(body: Body | "Sun" | "Moon", date: Date): boolean {
  if (body === "Sun" || body === "Moon") return false;
  const lon1 = getPlanetLongitude(body, date);
  const next = new Date(date.getTime() + 86400000);
  const lon2 = getPlanetLongitude(body, next);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function calculatePlanetPositions(date: Date, houses: number[]): PlanetPosition[] {
  return PLANET_LIST.map(({ body, name, symbol }) => {
    const lon = getPlanetLongitude(body, date);
    const { sign, signIndex, degreeInSign, minuteInDegree } = signFromLongitude(lon);
    return {
      planet: name,
      symbol,
      longitude: lon,
      sign,
      signIndex,
      degreeInSign,
      minuteInDegree,
      house: houses.length === 12 ? getHouseForLongitude(lon, houses) : 0,
      retrograde: isRetrograde(body, date),
    };
  });
}

function getHouseForLongitude(lon: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (start < end) {
      if (lon >= start && lon < end) return i + 1;
    } else {
      if (lon >= start || lon < end) return i + 1;
    }
  }
  return 1;
}

// ─── Ascendant & MC ─────────────────────────────────────────────────────────

function calculateAscendant(lstDeg: number, lat: number, obliquity: number): number {
  const ramcRad = deg2rad(lstDeg);
  const latRad = deg2rad(lat);
  const oblRad = deg2rad(obliquity);
  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  return mod360(rad2deg(Math.atan2(y, x)));
}

function calculateMC(lstDeg: number, obliquity: number): number {
  const ramcRad = deg2rad(lstDeg);
  const oblRad = deg2rad(obliquity);
  const y = Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(oblRad);
  return mod360(rad2deg(Math.atan2(y, x)));
}

// ─── Placidus Houses ─────────────────────────────────────────────────────────

function calculatePlacidusHouses(ramcDeg: number, lat: number, obliquity: number): number[] | null {
  const asc = calculateAscendant(ramcDeg, lat, obliquity);
  const mc = calculateMC(ramcDeg, obliquity);
  const desc = mod360(asc + 180);
  const ic = mod360(mc + 180);

  const cusps: number[] = new Array(12);
  cusps[0] = asc;    // 1st house
  cusps[3] = ic;     // 4th house
  cusps[6] = desc;   // 7th house
  cusps[9] = mc;     // 10th house

  // Intermediate cusps via Placidus iteration
  const oblRad = deg2rad(obliquity);
  const latRad = deg2rad(lat);

  // Check if Placidus is possible at this latitude
  if (Math.abs(lat) > 66.5) return null;

  // Cusps 11, 12 (between MC and ASC) use semi-diurnal arc fractions
  // Cusps 2, 3 (between ASC and IC) use semi-nocturnal arc fractions
  const fractions: [number, number][] = [
    [10, 1 / 3], // cusp 11
    [10, 2 / 3], // cusp 12
    [10 + 3, 1 / 3], // cusp 2 (using IC side, fraction of semi-nocturnal)
    [10 + 3, 2 / 3], // cusp 3
  ];
  const cuspIndices = [10, 11, 1, 2]; // which cusp index

  for (let fi = 0; fi < 4; fi++) {
    const isAboveMC = fi < 2;
    const f = fractions[fi][1];

    let raGuess = isAboveMC
      ? ramcDeg + f * (mod360(asc - mc + (asc < mc ? 360 : 0)))
      : ramcDeg + 180 + f * (mod360(ic - asc + 180 + (ic < asc ? 360 : 0)));

    raGuess = mod360(raGuess);

    for (let iter = 0; iter < 20; iter++) {
      const raRad = deg2rad(raGuess);
      const tanDec = Math.sin(oblRad) * Math.sin(raRad) / Math.cos(oblRad * 0 + raRad * 0 + 0.0001);
      // Proper declination of ecliptic point at this RA
      const lambda = mod360(rad2deg(Math.atan2(Math.sin(raRad), Math.cos(raRad) * Math.cos(oblRad))));
      const sinDec = Math.sin(oblRad) * Math.sin(deg2rad(lambda));
      const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));

      const adArg = Math.tan(latRad) * Math.tan(dec);
      if (Math.abs(adArg) >= 1) return null; // degenerate

      const AD = rad2deg(Math.asin(adArg));
      const SA = 90 + AD;

      let targetRA: number;
      if (isAboveMC) {
        targetRA = ramcDeg + f * SA;
      } else {
        const SNA = 90 - AD;
        targetRA = ramcDeg + 180 + f * SNA;
      }
      targetRA = mod360(targetRA);

      let diff = targetRA - raGuess;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      if (Math.abs(diff) < 0.001) break;
      raGuess = mod360(raGuess + diff * 0.5);
    }

    // Convert final RA guess to ecliptic longitude
    const raRad = deg2rad(raGuess);
    const lambdaFinal = mod360(rad2deg(Math.atan2(
      Math.sin(raRad),
      Math.cos(raRad) * Math.cos(oblRad),
    )));

    cusps[cuspIndices[fi]] = lambdaFinal;
  }

  // Opposite cusps
  cusps[4] = mod360(cusps[10] + 180);  // 5th = opposite of 11th
  cusps[5] = mod360(cusps[11] + 180);  // 6th = opposite of 12th
  cusps[7] = mod360(cusps[1] + 180);   // 8th = opposite of 2nd
  cusps[8] = mod360(cusps[2] + 180);   // 9th = opposite of 3rd

  return cusps;
}

function calculateEqualHouses(asc: number): number[] {
  return Array.from({ length: 12 }, (_, i) => mod360(asc + i * 30));
}

// ─── Aspects ─────────────────────────────────────────────────────────────────

function angularSeparation(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function findAspects(positions: PlanetPosition[], ascLon: number | null, mcLon: number | null): Aspect[] {
  const points: { name: string; lon: number }[] = positions.map(p => ({ name: p.planet, lon: p.longitude }));
  if (ascLon !== null) points.push({ name: "Ascendant", lon: ascLon });
  if (mcLon !== null) points.push({ name: "Midheaven", lon: mcLon });

  const aspects: Aspect[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const sep = angularSeparation(points[i].lon, points[j].lon);
      for (const def of ASPECT_DEFS) {
        const orb = (isLuminary(points[i].name) || isLuminary(points[j].name)) ? def.lumOrb : def.orb;
        const diff = Math.abs(sep - def.angle);
        if (diff <= orb) {
          aspects.push({
            planet1: points[i].name,
            planet2: points[j].name,
            type: def.type,
            angle: def.angle,
            orb: Math.round(diff * 100) / 100,
            applying: false,
          });
          break;
        }
      }
    }
  }
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}

function findTransitAspects(transitPositions: PlanetPosition[], natalPositions: PlanetPosition[]): TransitAspect[] {
  const results: TransitAspect[] = [];
  // Prioritize slow-moving planets
  const transitOrder = ["Pluto", "Neptune", "Uranus", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Sun", "Moon"];

  for (const tName of transitOrder) {
    const tp = transitPositions.find(p => p.planet === tName);
    if (!tp) continue;
    for (const np of natalPositions) {
      const sep = angularSeparation(tp.longitude, np.longitude);
      for (const def of ASPECT_DEFS) {
        const diff = Math.abs(sep - def.angle);
        if (diff <= TRANSIT_ORB) {
          results.push({
            transitPlanet: tp.planet,
            natalPlanet: np.planet,
            type: def.type,
            orb: Math.round(diff * 100) / 100,
          });
          break;
        }
      }
    }
  }
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function calculateNatalChart(input: AstrologyInput): NatalChart {
  const { birthDate, birthTime, lat, lng, timeZone } = input;
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
  const hasBirthTime = !!birthTime;

  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: timeZone },
  );
  const jsDate = dt.toJSDate();
  const jd = toJulianDay(jsDate);
  const obliquity = meanObliquity(jd);

  // Sidereal time
  const gmst = SiderealTime(jsDate);
  const lstDeg = mod360(gmst * 15 + lng);

  // Houses
  let ascendant: number | null = null;
  let mc: number | null = null;
  let houses: number[] = [];

  if (hasBirthTime) {
    ascendant = calculateAscendant(lstDeg, lat, obliquity);
    mc = calculateMC(lstDeg, obliquity);
    const placidus = calculatePlacidusHouses(lstDeg, lat, obliquity);
    if (placidus) {
      houses = placidus;
    } else {
      houses = calculateEqualHouses(ascendant);
    }
  }

  // Natal planets
  const planets = calculatePlanetPositions(jsDate, houses);

  // Aspects
  const aspects = findAspects(planets, ascendant, mc);

  // Transits (current moment)
  const now = new Date();
  const transitPlanets = calculatePlanetPositions(now, houses);
  const transitAspects = findTransitAspects(transitPlanets, planets);

  // Interpretation
  const interpretation = buildInterpretation(planets, ascendant, mc, houses, aspects, transitAspects, hasBirthTime);

  return {
    input,
    hasBirthTime,
    planets,
    ascendant,
    mc,
    houses,
    aspects,
    transitPlanets,
    transitAspects,
    interpretation,
  };
}

export function calculateTransitsForDate(natalChart: NatalChart, date: Date): TransitAspect[] {
  const houses = natalChart.houses ?? [];
  const transitPositions = calculatePlanetPositions(date, houses);
  return findTransitAspects(transitPositions, natalChart.planets);
}

// ─── Interpretation Data ─────────────────────────────────────────────────────

type SignData = {
  element: string;
  modality: string;
  ruler: string;
  keywords: string;
  personality: string;
};

const SIGN_DATA: Record<string, SignData> = {
  Aries: { element: "Fire", modality: "Cardinal", ruler: "Mars", keywords: "initiative, courage, assertiveness", personality: "Bold and ambitious, Aries dives headfirst into even the most challenging situations. You are a natural leader with a pioneering spirit, driven by passion and a desire to be first. Your energy is infectious, though impatience can be your Achilles heel." },
  Taurus: { element: "Earth", modality: "Fixed", ruler: "Venus", keywords: "stability, sensuality, determination", personality: "Grounded and reliable, Taurus finds strength in consistency and comfort. You have a deep appreciation for beauty, luxury, and the finer things in life. Your patience is legendary, but once pushed too far, your stubborn nature emerges with formidable force." },
  Gemini: { element: "Air", modality: "Mutable", ruler: "Mercury", keywords: "communication, curiosity, adaptability", personality: "Quick-witted and endlessly curious, Gemini thrives on intellectual stimulation and social connection. You are a natural communicator who can adapt to any situation with ease. Your versatility is a gift, though it can sometimes manifest as restlessness or inconsistency." },
  Cancer: { element: "Water", modality: "Cardinal", ruler: "Moon", keywords: "nurturing, intuition, emotional depth", personality: "Deeply intuitive and sentimental, Cancer is the most emotionally attuned sign of the zodiac. You are fiercely protective of those you love, creating safe harbors wherever you go. Your sensitivity is your superpower, giving you remarkable empathy and emotional intelligence." },
  Leo: { element: "Fire", modality: "Fixed", ruler: "Sun", keywords: "creativity, confidence, generosity", personality: "Warm, creative, and charismatic, Leo commands attention wherever they go. You have a natural flair for drama and self-expression, combined with genuine generosity of spirit. Your confidence inspires others, and your loyalty to loved ones is unwavering." },
  Virgo: { element: "Earth", modality: "Mutable", ruler: "Mercury", keywords: "analysis, service, precision", personality: "Detail-oriented and analytical, Virgo approaches life with methodical precision. You have a deep desire to be of service and to improve everything you touch. Your practical intelligence and ability to see what needs fixing make you indispensable, though perfectionism can cause unnecessary stress." },
  Libra: { element: "Air", modality: "Cardinal", ruler: "Venus", keywords: "harmony, partnership, aesthetics", personality: "Graceful and diplomatic, Libra seeks balance and harmony in all things. You have a refined aesthetic sense and a natural talent for seeing multiple perspectives. Relationships are central to your identity, and you thrive when creating beauty and fairness in your world." },
  Scorpio: { element: "Water", modality: "Fixed", ruler: "Pluto", keywords: "transformation, intensity, depth", personality: "Intense and magnetic, Scorpio experiences life at a profound depth that few other signs can match. You possess remarkable emotional resilience and the power to transform yourself and your circumstances. Your penetrating insight sees through facades, and your loyalty runs as deep as your passions." },
  Sagittarius: { element: "Fire", modality: "Mutable", ruler: "Jupiter", keywords: "exploration, philosophy, freedom", personality: "Adventurous and optimistic, Sagittarius is the eternal explorer of the zodiac. You seek truth, meaning, and new horizons with boundless enthusiasm. Your philosophical nature and sense of humor inspire others, and your need for freedom shapes every aspect of your life journey." },
  Capricorn: { element: "Earth", modality: "Cardinal", ruler: "Saturn", keywords: "ambition, discipline, responsibility", personality: "Disciplined and ambitious, Capricorn approaches goals with unwavering determination and strategic planning. You understand that lasting success requires patience and hard work. Your sense of responsibility and natural authority earn deep respect, and your dry humor reveals a warmth beneath the serious exterior." },
  Aquarius: { element: "Air", modality: "Fixed", ruler: "Uranus", keywords: "innovation, humanitarianism, independence", personality: "Progressive and original, Aquarius marches to the beat of their own drum. You are a visionary thinker who cares deeply about humanity while maintaining fierce independence. Your innovative mind and humanitarian ideals drive you to challenge conventions and imagine better futures." },
  Pisces: { element: "Water", modality: "Mutable", ruler: "Neptune", keywords: "imagination, compassion, transcendence", personality: "Deeply empathic and imaginative, Pisces swims in the waters of collective consciousness. You possess extraordinary creative and spiritual gifts, along with a compassion that knows no bounds. Your intuitive wisdom and artistic sensitivity make you uniquely attuned to the unseen dimensions of life." },
};

const PLANET_IN_SIGN_BRIEF: Record<string, Record<string, string>> = {
  Mercury: {
    Aries: "Your mind is quick, direct, and competitive. You think fast and speak even faster, preferring bold ideas over cautious deliberation.",
    Taurus: "Your thinking is deliberate and practical. You process information slowly but thoroughly, with a gift for common-sense solutions.",
    Gemini: "Your mind is exceptionally agile and curious. You juggle multiple ideas effortlessly and communicate with wit and versatility.",
    Cancer: "Your thinking is colored by emotion and intuition. You have an excellent memory and communicate with empathy and sensitivity.",
    Leo: "Your mind gravitates toward big, creative ideas. You express yourself dramatically and persuasively, with natural authority.",
    Virgo: "Your analytical mind excels at detail and precision. You communicate clearly and practically, with a talent for problem-solving.",
    Libra: "Your thinking seeks balance and fairness. You weigh all sides carefully and communicate diplomatically, with charm and grace.",
    Scorpio: "Your mind penetrates beneath the surface. You think strategically and communicate with intensity, keeping your deepest thoughts private.",
    Sagittarius: "Your mind ranges far and wide, drawn to philosophy and big-picture thinking. You communicate with enthusiasm and directness.",
    Capricorn: "Your thinking is structured and goal-oriented. You communicate with authority and prefer ideas with practical application.",
    Aquarius: "Your mind is innovative and unconventional. You think independently and communicate ideas that challenge the status quo.",
    Pisces: "Your thinking is intuitive and imaginative. You communicate poetically and absorb information through feeling as much as logic.",
  },
  Venus: {
    Aries: "You love with passion and spontaneity, pursuing romance with bold directness. You value independence in relationships.",
    Taurus: "You love deeply and sensually, valuing loyalty, comfort, and physical affection. Beauty and material security matter greatly.",
    Gemini: "You love through communication and intellectual connection. You need variety and mental stimulation in relationships.",
    Cancer: "You love with nurturing devotion, creating emotional security for partners. Home and family are central to your heart.",
    Leo: "You love with warmth, generosity, and dramatic flair. You need to be adored and express affection lavishly.",
    Virgo: "You show love through acts of service and attention to detail. You value modesty and practical expressions of care.",
    Libra: "You are a true romantic, valuing harmony, beauty, and partnership above all. You thrive in committed, balanced relationships.",
    Scorpio: "You love with profound intensity and emotional depth. You desire complete, transformative union and loyalty.",
    Sagittarius: "You love with adventure and optimism, needing freedom and shared ideals. You value honesty and growth in relationships.",
    Capricorn: "You love with commitment and responsibility. You value stability and show devotion through long-term dedication.",
    Aquarius: "You love with intellectual connection and respect for independence. You value friendship as the foundation of romance.",
    Pisces: "You love with boundless compassion and romantic idealism. You give selflessly and seek transcendent, soulful connection.",
  },
  Mars: {
    Aries: "Your drive is fierce and direct. You act on impulse, pursue goals aggressively, and have remarkable energy and courage.",
    Taurus: "Your drive is steady and persistent. You pursue goals with patient determination, rarely quitting once committed.",
    Gemini: "Your energy is versatile and mentally directed. You pursue multiple interests simultaneously with restless enthusiasm.",
    Cancer: "Your drive is emotionally fueled. You fight hardest to protect loved ones and create emotional security.",
    Leo: "Your drive is bold and creative. You pursue goals with confidence and dramatic flair, needing recognition for your efforts.",
    Virgo: "Your drive is precise and methodical. You channel energy into improvement and service, working with careful efficiency.",
    Libra: "Your drive seeks fairness and cooperation. You assert yourself diplomatically and fight for justice and harmony.",
    Scorpio: "Your drive is intense and strategic. You pursue goals with unwavering focus and emotional power, never forgetting a slight.",
    Sagittarius: "Your drive is adventurous and idealistic. You channel energy into exploration, learning, and fighting for beliefs.",
    Capricorn: "Your drive is disciplined and ambitious. You pursue long-term goals with strategic patience and remarkable endurance.",
    Aquarius: "Your drive is unconventional and humanitarian. You channel energy into causes and innovations that serve the collective.",
    Pisces: "Your drive is guided by inspiration and compassion. You act on intuition and creative vision, sometimes lacking clear direction.",
  },
  Jupiter: {
    Aries: "Growth comes through bold initiative and independent action. You expand your world through courage and pioneering endeavors.",
    Taurus: "Growth comes through material development and sensory experience. You attract abundance through patience and appreciation of quality.",
    Gemini: "Growth comes through knowledge and communication. You expand your world through learning, teaching, and intellectual connections.",
    Cancer: "Growth comes through emotional wisdom and nurturing. You expand your world through family, home, and caring for others.",
    Leo: "Growth comes through creative self-expression and generosity. You expand your world through confidence and joyful leadership.",
    Virgo: "Growth comes through service and skill development. You expand your world through practical improvement and health awareness.",
    Libra: "Growth comes through relationships and artistic pursuits. You expand your world through partnerships and cultural refinement.",
    Scorpio: "Growth comes through deep transformation and shared resources. You expand your world through emotional intensity and regeneration.",
    Sagittarius: "Growth comes through exploration and philosophical understanding. You expand your world through travel, study, and spiritual seeking.",
    Capricorn: "Growth comes through discipline and institutional achievement. You expand your world through career success and responsible leadership.",
    Aquarius: "Growth comes through innovation and humanitarian vision. You expand your world through community involvement and progressive ideals.",
    Pisces: "Growth comes through compassion and spiritual awareness. You expand your world through faith, creativity, and selfless service.",
  },
  Saturn: {
    Aries: "Your life lessons involve mastering assertiveness and initiative. Learning to act decisively without recklessness builds inner strength.",
    Taurus: "Your life lessons involve mastering material security and self-worth. Building lasting value through patience develops true stability.",
    Gemini: "Your life lessons involve mastering communication and knowledge. Developing mental discipline and focus brings intellectual authority.",
    Cancer: "Your life lessons involve mastering emotional security and nurturing. Learning healthy boundaries with family builds inner foundations.",
    Leo: "Your life lessons involve mastering creative expression and authority. Learning to lead with humility and heart earns genuine respect.",
    Virgo: "Your life lessons involve mastering service and practical skills. Overcoming perfectionism through disciplined effort brings competence.",
    Libra: "Your life lessons involve mastering relationships and fairness. Learning to commit and maintain balance through difficulty builds wisdom.",
    Scorpio: "Your life lessons involve mastering emotional power and transformation. Facing deep fears with courage builds remarkable resilience.",
    Sagittarius: "Your life lessons involve mastering wisdom and truthfulness. Grounding expansive visions in reality creates meaningful philosophy.",
    Capricorn: "Your life lessons involve mastering ambition and responsibility. Building structures with integrity creates a lasting legacy.",
    Aquarius: "Your life lessons involve mastering individuality within community. Balancing personal freedom with social responsibility creates innovation.",
    Pisces: "Your life lessons involve mastering compassion and boundaries. Learning to serve without losing yourself builds spiritual maturity.",
  },
};

const ASPECT_MEANINGS: Record<string, Record<AspectType, string>> = {
  "Sun-Moon": {
    conjunction: "Your conscious will and emotional nature are unified. You express yourself authentically, with little conflict between what you want and what you feel.",
    opposition: "There is a dynamic tension between your identity and emotions. Full Moon births carry awareness of life's dualities and the challenge of integrating head and heart.",
    trine: "Your will and emotions flow together harmoniously. You have natural self-assurance and an easy relationship with your own inner life.",
    square: "Your conscious goals and emotional needs pull in different directions, creating inner tension that drives personal growth and accomplishment.",
    sextile: "Your mind and heart cooperate pleasantly. You have opportunities to align your goals with your emotional needs through conscious effort.",
  },
  "Sun-Mercury": {
    conjunction: "Your identity is closely tied to your intellect. You are a natural communicator whose self-expression and thinking are inseparable.",
    opposition: "This aspect does not occur naturally as Mercury is always close to the Sun.",
    trine: "This aspect does not occur naturally as Mercury is always close to the Sun.",
    square: "This aspect does not occur naturally as Mercury is always close to the Sun.",
    sextile: "This aspect does not occur naturally as Mercury is always close to the Sun.",
  },
  "Sun-Venus": {
    conjunction: "Your identity is infused with charm and grace. You naturally attract beauty and harmony, expressing yourself with warmth and artistic sensibility.",
    opposition: "This aspect does not occur naturally as Venus is always close to the Sun.",
    trine: "This aspect does not occur naturally as Venus is always close to the Sun.",
    square: "This aspect does not occur naturally as Venus is always close to the Sun.",
    sextile: "Your identity and values harmonize easily. You find opportunities to express yourself creatively and attract pleasant social connections.",
  },
  "Sun-Mars": {
    conjunction: "Your identity is charged with assertive energy. You are direct, competitive, and have tremendous drive to make your mark on the world.",
    opposition: "You experience tension between self-expression and assertive action. This can manifest as conflicts with authority figures or struggles with anger.",
    trine: "Your willpower and energy flow together naturally. You accomplish goals with confidence and have a healthy, vital self-expression.",
    square: "There is friction between your identity and your drive. This creates powerful motivation but also potential for conflict and frustration.",
    sextile: "Your energy and identity cooperate pleasantly. You have opportunities to channel your drive productively and express yourself dynamically.",
  },
  "Sun-Jupiter": {
    conjunction: "Your identity is expansive and optimistic. You have natural confidence, generosity, and a philosophical outlook that attracts good fortune.",
    opposition: "You alternate between inflation and deflation of self. Learning to balance confidence with humility brings genuine wisdom and growth.",
    trine: "Your identity and sense of expansion flow together beautifully. You have natural optimism, good fortune, and a generous spirit.",
    square: "Your desire for growth sometimes exceeds practical limits. This creates restlessness but also remarkable ambition and breadth of vision.",
    sextile: "Your identity and growth cooperate pleasantly. You find opportunities for expansion through education, travel, and philosophical exploration.",
  },
  "Sun-Saturn": {
    conjunction: "Your identity is shaped by discipline and responsibility. You are serious, hardworking, and develop authority through patient effort over time.",
    opposition: "You experience tension between self-expression and limitation. Authority figures play a significant role in shaping your path to maturity.",
    trine: "Your identity and sense of structure work together naturally. You have innate discipline and earn respect through consistent, responsible action.",
    square: "There is friction between your desire to shine and the weight of responsibility. This builds remarkable strength, ambition, and resilience over time.",
    sextile: "Your identity and discipline cooperate. You find opportunities to build lasting structures and earn authority through steady, practical effort.",
  },
};

const HOUSE_MEANINGS: Record<number, string> = {
  1: "Self, identity, physical appearance, and personal initiative",
  2: "Personal finances, values, material possessions, and self-worth",
  3: "Communication, siblings, short journeys, and early education",
  4: "Home, family, roots, emotional foundation, and private life",
  5: "Creativity, romance, children, pleasure, and self-expression",
  6: "Health, daily work, service, routines, and practical skills",
  7: "Partnerships, marriage, close relationships, and open enemies",
  8: "Transformation, shared resources, intimacy, death, and rebirth",
  9: "Higher education, philosophy, travel, religion, and worldview",
  10: "Career, public reputation, ambition, and social standing",
  11: "Friends, groups, aspirations, humanitarian causes, and ideals",
  12: "Subconscious, solitude, hidden strengths, spirituality, and karma",
};

const TRANSIT_MEANINGS: Record<string, Record<AspectType, string>> = {
  Pluto: {
    conjunction: "A profound transformation in this area of life. Old structures are dismantled to make way for rebirth. This is a multi-year process of deep change.",
    opposition: "External forces challenge you to transform. Power struggles and profound changes in relationships demand complete honesty with yourself.",
    trine: "Deep, empowering changes flow naturally. You have access to hidden reserves of strength and the ability to transform circumstances positively.",
    square: "Intense pressure to evolve. Power dynamics and control issues surface, demanding you release what no longer serves your growth.",
    sextile: "Opportunities for subtle but meaningful transformation. You can access deeper levels of personal power through conscious effort.",
  },
  Neptune: {
    conjunction: "Boundaries dissolve in this area of life. Heightened intuition and idealism, but also confusion and the need to distinguish dreams from reality.",
    opposition: "Others may seem deceptive or confusing. This transit asks you to see through illusions in relationships while maintaining compassion.",
    trine: "Spiritual and creative inspiration flows easily. Your intuition is heightened, and you may experience meaningful synchronicities.",
    square: "Confusion and disillusionment challenge you. What seemed certain becomes unclear, requiring you to develop faith and discernment.",
    sextile: "Gentle openings to spiritual and creative dimensions. You may discover new artistic talents or deepen your intuitive awareness.",
  },
  Saturn: {
    conjunction: "A time of increased responsibility and structure. You are called to mature, commit, and build lasting foundations in this area.",
    opposition: "External pressures test your commitments. Relationships and responsibilities demand accountability and mature responses.",
    trine: "Disciplined effort pays off naturally. This is a productive time for building structures and achieving long-term goals.",
    square: "Obstacles and frustrations test your resolve. These challenges, while difficult, build character and clarify your true priorities.",
    sextile: "Opportunities for steady progress through disciplined action. You can make practical improvements with focused, patient effort.",
  },
  Jupiter: {
    conjunction: "Expansion and opportunity in this area of life. New horizons open up, bringing optimism, growth, and the chance to reach further.",
    opposition: "Opportunities come through others, but excess is a risk. Balance enthusiasm with practicality and avoid overcommitting.",
    trine: "Lucky breaks and natural growth flow your way. This is an excellent time for education, travel, and expanding your worldview.",
    square: "Restless desire for more can lead to overextension. Channel this expansive energy into focused growth rather than scattered excess.",
    sextile: "Pleasant opportunities for growth and improvement. With some effort, you can expand your horizons in meaningful ways.",
  },
};

// ─── Interpretation Builder ──────────────────────────────────────────────────

function buildInterpretation(
  planets: PlanetPosition[],
  ascendant: number | null,
  mc: number | null,
  houses: number[],
  aspects: Aspect[],
  transitAspects: TransitAspect[],
  hasBirthTime: boolean,
): string {
  const lines: string[] = [];

  // 1. Sun Sign
  const sun = planets.find(p => p.planet === "Sun")!;
  const sunData = SIGN_DATA[sun.sign];
  lines.push("## Sun Sign & Core Identity / 太陽星座");
  lines.push(`Your Sun is in **${sun.sign}** (${sun.degreeInSign}°${sun.minuteInDegree}′) — a ${sunData.element} sign, ${sunData.modality} in modality, ruled by ${sunData.ruler}.`);
  lines.push("");
  lines.push(sunData.personality);
  lines.push("");
  lines.push(`**Core themes:** ${sunData.keywords}.`);

  // 2. Moon Sign
  const moon = planets.find(p => p.planet === "Moon")!;
  const moonData = SIGN_DATA[moon.sign];
  lines.push("");
  lines.push("## Moon Sign & Emotional Nature / 月亮星座");
  lines.push(`Your Moon is in **${moon.sign}** (${moon.degreeInSign}°${moon.minuteInDegree}′) — a ${moonData.element} sign.`);
  lines.push("");
  lines.push(`Your emotional world is colored by ${moon.sign} energy. ${moonData.personality.split(". ").slice(0, 2).join(". ")}.`);
  lines.push("");
  lines.push(`The ${sunData.element} Sun combined with a ${moonData.element} Moon creates ${sunData.element === moonData.element ? "a unified elemental nature, reinforcing your core tendencies" : "an interesting interplay between different elemental energies, adding complexity to your character"}.`);

  // 3. Rising Sign
  if (hasBirthTime && ascendant !== null) {
    const ascSign = signFromLongitude(ascendant);
    const ascData = SIGN_DATA[SIGNS[ascSign.signIndex]];
    lines.push("");
    lines.push("## Rising Sign & First Impressions / 上升星座");
    lines.push(`Your Ascendant is in **${SIGNS[ascSign.signIndex]}** (${ascSign.degreeInSign}°${ascSign.minuteInDegree}′).`);
    lines.push("");
    lines.push(`The Rising Sign is the mask you wear and how the world first perceives you. With ${SIGNS[ascSign.signIndex]} rising, you project an aura of ${ascData.keywords}. People see you as someone who embodies ${SIGNS[ascSign.signIndex]} qualities before getting to know your deeper Sun and Moon nature.`);

    if (mc !== null) {
      const mcSign = signFromLongitude(mc);
      lines.push("");
      lines.push(`Your Midheaven (MC) is in **${SIGNS[mcSign.signIndex]}**, pointing toward a career and public image shaped by ${SIGN_DATA[SIGNS[mcSign.signIndex]].keywords}.`);
    }
  }

  // 4. Planetary Placements
  lines.push("");
  lines.push("## Planetary Placements / 行星配置");
  for (const p of planets) {
    if (p.planet === "Sun" || p.planet === "Moon") continue;
    const signMeanings = PLANET_IN_SIGN_BRIEF[p.planet];
    if (signMeanings && signMeanings[p.sign]) {
      const retro = p.retrograde ? " (Retrograde ℞)" : "";
      const houseNote = p.house > 0 ? ` in the ${ordinal(p.house)} House` : "";
      lines.push("");
      lines.push(`**${p.planet} ${p.symbol} in ${p.sign}${houseNote}${retro}**`);
      lines.push(signMeanings[p.sign]);
      if (p.house > 0 && HOUSE_MEANINGS[p.house]) {
        lines.push(`This energy expresses primarily through the domain of: ${HOUSE_MEANINGS[p.house].toLowerCase()}.`);
      }
    } else {
      const retro = p.retrograde ? " ℞" : "";
      lines.push("");
      lines.push(`**${p.planet} ${p.symbol} in ${p.sign}${retro}** at ${p.degreeInSign}°${p.minuteInDegree}′${p.house > 0 ? ` (House ${p.house})` : ""}`);
    }
  }

  // 5. House Emphasis
  if (hasBirthTime && houses.length === 12) {
    lines.push("");
    lines.push("## House Emphasis / 宮位重點");
    const houseCounts: Record<number, string[]> = {};
    for (const p of planets) {
      if (p.house > 0) {
        if (!houseCounts[p.house]) houseCounts[p.house] = [];
        houseCounts[p.house].push(p.planet);
      }
    }
    const populated = Object.entries(houseCounts)
      .map(([h, ps]) => ({ house: Number(h), planets: ps }))
      .sort((a, b) => b.planets.length - a.planets.length);

    if (populated.length > 0) {
      const top = populated[0];
      if (top.planets.length >= 3) {
        lines.push(`You have a **stellium** (${top.planets.length} planets) in the **${ordinal(top.house)} House** — the area of ${HOUSE_MEANINGS[top.house]?.toLowerCase() || "life"}. This concentration of energy makes this house a dominant theme in your life.`);
        lines.push("");
      }
      for (const { house, planets: ps } of populated.slice(0, 4)) {
        lines.push(`**${ordinal(house)} House** (${ps.join(", ")}): ${HOUSE_MEANINGS[house] || ""}`);
      }

      const emptyHouses = Array.from({ length: 12 }, (_, i) => i + 1).filter(h => !houseCounts[h]);
      if (emptyHouses.length > 0 && emptyHouses.length <= 8) {
        lines.push("");
        lines.push(`Empty houses (${emptyHouses.join(", ")}) are not areas of deficiency — they simply operate smoothly without the intensity that planets bring.`);
      }
    }
  }

  // 6. Major Aspects
  if (aspects.length > 0) {
    lines.push("");
    lines.push("## Major Aspects / 主要相位");
    lines.push("Aspects reveal how planetary energies interact within your chart. Tighter orbs indicate stronger influence.");
    lines.push("");
    const topAspects = aspects.slice(0, 8);
    for (const a of topAspects) {
      const key1 = `${a.planet1}-${a.planet2}`;
      const key2 = `${a.planet2}-${a.planet1}`;
      const meanings = ASPECT_MEANINGS[key1] || ASPECT_MEANINGS[key2];
      const label = a.type.charAt(0).toUpperCase() + a.type.slice(1);
      lines.push(`**${a.planet1} ${label} ${a.planet2}** (orb ${a.orb}°)`);
      if (meanings && meanings[a.type]) {
        lines.push(meanings[a.type]);
      }
      lines.push("");
    }
  }

  // 7. Current Transits
  if (transitAspects.length > 0) {
    lines.push("");
    lines.push("## Current Transits / 當前行運");
    lines.push("These are the major planetary transits currently active in your chart, listed from slowest (most impactful) to fastest.");
    lines.push("");
    const top = transitAspects.slice(0, 10);
    for (const ta of top) {
      const label = ta.type.charAt(0).toUpperCase() + ta.type.slice(1);
      lines.push(`**Transit ${ta.transitPlanet} ${label} Natal ${ta.natalPlanet}** (orb ${ta.orb}°)`);
      const meanings = TRANSIT_MEANINGS[ta.transitPlanet];
      if (meanings && meanings[ta.type]) {
        lines.push(meanings[ta.type]);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
