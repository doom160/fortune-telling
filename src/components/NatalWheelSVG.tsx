"use client";

import type { PlanetPosition, Aspect, TransitAspect } from "@/lib/astrology";

type NatalWheelProps = {
  planets: PlanetPosition[];
  houses: number[];
  ascendant: number;
  aspects: Aspect[];
  transitPlanets?: PlanetPosition[];
  transitAspects?: TransitAspect[];
};

const CX = 300;
const CY = 300;
const R_OUTER = 280;
const R_SIGN_TEXT = 262;
const R_SIGN_INNER = 245;
const R_HOUSE_NUM = 220;
const R_HOUSE_INNER = 195;
const R_PLANET = 170;
const R_PLANET_INNER = 145;
const R_TRANSIT = 130;
const R_ASPECT = 110;

const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const SIGN_COLORS = [
  "#c4884a", "#b4882e", "#a8a898", "#6a8ea8", "#c4884a", "#b4882e",
  "#a8a898", "#6a8ea8", "#c4884a", "#b4882e", "#a8a898", "#6a8ea8",
];

const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#b4882e",
  trine: "#7ea87e",
  sextile: "#6a8ea8",
  square: "#c45050",
  opposition: "#c45050",
};

function lonToAngle(lon: number, ascLon: number): number {
  // Ascendant at 9 o'clock (180°), zodiac counter-clockwise
  return 180 - (lon - ascLon);
}

function polarToXY(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number): string {
  // SVG arc: angles go clockwise in SVG, our angles are counter-clockwise
  const s1 = polarToXY(startAngle, outerR);
  const e1 = polarToXY(endAngle, outerR);
  const s2 = polarToXY(endAngle, innerR);
  const e2 = polarToXY(startAngle, innerR);

  let sweep = startAngle - endAngle;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

function resolveCollisions(items: { lon: number; label: string }[], minGap: number): { lon: number; adjustedAngle: number; label: string }[] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.lon - b.lon);
  const result = sorted.map(it => ({ ...it, adjustedAngle: it.lon }));

  for (let pass = 0; pass < 5; pass++) {
    let moved = false;
    for (let i = 1; i < result.length; i++) {
      let diff = result[i].adjustedAngle - result[i - 1].adjustedAngle;
      if (diff < 0) diff += 360;
      if (diff < minGap) {
        const shift = (minGap - diff) / 2 + 0.5;
        result[i - 1].adjustedAngle = (result[i - 1].adjustedAngle - shift + 360) % 360;
        result[i].adjustedAngle = (result[i].adjustedAngle + shift) % 360;
        moved = true;
      }
    }
    // Check wrap-around
    let wrapDiff = result[0].adjustedAngle + 360 - result[result.length - 1].adjustedAngle;
    if (wrapDiff < minGap) {
      const shift = (minGap - wrapDiff) / 2 + 0.5;
      result[result.length - 1].adjustedAngle = (result[result.length - 1].adjustedAngle - shift + 360) % 360;
      result[0].adjustedAngle = (result[0].adjustedAngle + shift) % 360;
      moved = true;
    }
    if (!moved) break;
  }
  return result;
}

export function NatalWheelSVG({ planets, houses, ascendant, aspects, transitPlanets, transitAspects }: NatalWheelProps) {
  const hasHouses = houses.length === 12;

  return (
    <svg viewBox="0 0 600 600" className="natal-wheel-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx={CX} cy={CY} r={R_OUTER + 5} fill="#0a0812" />
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(180,136,46,0.3)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={R_SIGN_INNER} fill="none" stroke="rgba(180,136,46,0.2)" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r={R_HOUSE_INNER} fill="none" stroke="rgba(180,136,46,0.15)" strokeWidth="0.5" />

      {/* Zodiac sign segments */}
      {SIGN_GLYPHS.map((glyph, i) => {
        const startLon = i * 30;
        const endLon = (i + 1) * 30;
        const startAngle = lonToAngle(startLon, ascendant);
        const endAngle = lonToAngle(endLon, ascendant);
        const midAngle = lonToAngle(startLon + 15, ascendant);
        const textPos = polarToXY(midAngle, R_SIGN_TEXT);
        const lineStart = polarToXY(startAngle, R_OUTER);
        const lineEnd = polarToXY(startAngle, R_SIGN_INNER);

        return (
          <g key={`sign-${i}`}>
            <path
              d={arcPath(startAngle, endAngle, R_OUTER, R_SIGN_INNER)}
              fill={SIGN_COLORS[i]}
              fillOpacity="0.06"
              stroke="none"
            />
            <line
              x1={lineStart.x} y1={lineStart.y}
              x2={lineEnd.x} y2={lineEnd.y}
              stroke="rgba(180,136,46,0.25)" strokeWidth="0.5"
            />
            <text
              x={textPos.x} y={textPos.y}
              textAnchor="middle" dominantBaseline="central"
              fill={SIGN_COLORS[i]} fontSize="16" fontFamily="serif"
              opacity="0.8"
            >
              {glyph}
            </text>
          </g>
        );
      })}

      {/* House lines and numbers */}
      {hasHouses && houses.map((cusp, i) => {
        const angle = lonToAngle(cusp, ascendant);
        const outerPt = polarToXY(angle, R_SIGN_INNER);
        const innerPt = polarToXY(angle, i === 0 || i === 3 || i === 6 || i === 9 ? 30 : R_HOUSE_INNER);
        const isCardinal = i === 0 || i === 3 || i === 6 || i === 9;

        // House number at midpoint of house
        const nextCusp = houses[(i + 1) % 12];
        let midLon = cusp + ((nextCusp - cusp + 360) % 360) / 2;
        if (midLon >= 360) midLon -= 360;
        const midAngle = lonToAngle(midLon, ascendant);
        const numPos = polarToXY(midAngle, R_HOUSE_NUM);

        return (
          <g key={`house-${i}`}>
            <line
              x1={outerPt.x} y1={outerPt.y}
              x2={innerPt.x} y2={innerPt.y}
              stroke={isCardinal ? "rgba(180,136,46,0.6)" : "rgba(180,136,46,0.2)"}
              strokeWidth={isCardinal ? 1.5 : 0.5}
            />
            <text
              x={numPos.x} y={numPos.y}
              textAnchor="middle" dominantBaseline="central"
              fill="rgba(232,223,200,0.35)" fontSize="10" fontFamily="serif"
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* ASC / MC labels */}
      {hasHouses && (
        <>
          <AnchorLabel lon={ascendant} ascLon={ascendant} label="ASC" radius={R_SIGN_INNER + 18} />
          {houses[9] !== undefined && (
            <AnchorLabel lon={houses[9]} ascLon={ascendant} label="MC" radius={R_SIGN_INNER + 18} />
          )}
        </>
      )}

      {/* Aspect lines */}
      {aspects.slice(0, 12).map((a, i) => {
        const p1 = planets.find(p => p.planet === a.planet1);
        const p2 = planets.find(p => p.planet === a.planet2);
        if (!p1 || !p2) return null;
        const angle1 = lonToAngle(p1.longitude, ascendant);
        const angle2 = lonToAngle(p2.longitude, ascendant);
        const pt1 = polarToXY(angle1, R_ASPECT);
        const pt2 = polarToXY(angle2, R_ASPECT);
        return (
          <line
            key={`aspect-${i}`}
            x1={pt1.x} y1={pt1.y}
            x2={pt2.x} y2={pt2.y}
            stroke={ASPECT_COLORS[a.type] || "#666"}
            strokeWidth={a.orb < 2 ? 1.2 : 0.6}
            strokeOpacity={Math.max(0.15, 0.6 - a.orb * 0.06)}
            strokeDasharray={a.type === "opposition" ? "4 3" : "none"}
          />
        );
      })}

      {/* Natal planet glyphs */}
      <PlanetGlyphs
        planets={planets}
        ascendant={ascendant}
        radius={R_PLANET}
        opacity={1}
        fontSize={14}
        color="var(--foreground)"
      />

      {/* Transit planet glyphs */}
      {transitPlanets && transitPlanets.length > 0 && (
        <PlanetGlyphs
          planets={transitPlanets}
          ascendant={ascendant}
          radius={R_TRANSIT}
          opacity={0.45}
          fontSize={11}
          color="#6a8ea8"
        />
      )}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r="2" fill="rgba(180,136,46,0.4)" />
    </svg>
  );
}

function PlanetGlyphs({
  planets,
  ascendant,
  radius,
  opacity,
  fontSize,
  color,
}: {
  planets: PlanetPosition[];
  ascendant: number;
  radius: number;
  opacity: number;
  fontSize: number;
  color: string;
}) {
  const items = planets.map(p => ({
    lon: p.longitude,
    label: p.symbol,
    planet: p.planet,
    degreeInSign: p.degreeInSign,
    sign: p.sign,
    retrograde: p.retrograde,
  }));

  const resolved = resolveCollisions(
    items.map(it => ({ lon: it.lon, label: it.label })),
    8,
  );

  return (
    <g opacity={opacity}>
      {resolved.map((r, i) => {
        const angle = lonToAngle(r.adjustedAngle, ascendant);
        const pos = polarToXY(angle, radius);
        const item = items.find(it => it.label === r.label);
        return (
          <g key={`planet-${i}`}>
            <text
              x={pos.x} y={pos.y}
              textAnchor="middle" dominantBaseline="central"
              fill={color} fontSize={fontSize} fontFamily="serif"
            >
              {r.label}
            </text>
            {item?.retrograde && (
              <text
                x={pos.x + fontSize * 0.6} y={pos.y - fontSize * 0.3}
                textAnchor="middle" dominantBaseline="central"
                fill="#c45050" fontSize={fontSize * 0.5} fontFamily="serif"
              >
                ℞
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function AnchorLabel({ lon, ascLon, label, radius }: { lon: number; ascLon: number; label: string; radius: number }) {
  const angle = lonToAngle(lon, ascLon);
  const pos = polarToXY(angle, radius);
  return (
    <text
      x={pos.x} y={pos.y}
      textAnchor="middle" dominantBaseline="central"
      fill="#b4882e" fontSize="9" fontFamily="serif"
      fontWeight="600" letterSpacing="0.05em"
    >
      {label}
    </text>
  );
}
