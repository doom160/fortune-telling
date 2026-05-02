"use client";

import type { YearSynthesis, PolarityValue } from "@/lib/synthesis";
import type { Pillar } from "@/lib/bazi";
import type { ZodiacAnimal } from "@/lib/zodiac";

export type LuckTimelineRowData = {
  synthesis: YearSynthesis;
  baziPillar: Pillar | null;
  personalYearNum: number;
  yearAnimal: ZodiacAnimal;
  zodiacPolarity: "auspicious" | "mixed" | "caution";
};

type Props = {
  rows: LuckTimelineRowData[];
  currentYear: number;
};

const POLARITY_LABELS: Record<PolarityValue, string> = {
  auspicious: "▲ Auspicious",
  mixed: "◈ Mixed",
  caution: "▼ Caution",
};

const PY_THEMES: Record<number, string> = {
  1: "New Beginnings",
  2: "Cooperation",
  3: "Expression",
  4: "Foundation",
  5: "Change",
  6: "Responsibility",
  7: "Reflection",
  8: "Abundance",
  9: "Completion",
};

export function LuckTimelineTable({ rows, currentYear }: Props) {
  return (
    <div className="luck-timeline">
      <h3 className="luck-timeline__title">Luck Timeline</h3>
      <div className="luck-timeline__table" role="table">
        <div className="luck-timeline__head" role="row">
          <span role="columnheader">Year</span>
          <span role="columnheader">BaZi Pillar</span>
          <span role="columnheader">Personal Year</span>
          <span role="columnheader">Zodiac Year</span>
          <span role="columnheader">Overall</span>
          <span role="columnheader">Synthesis</span>
        </div>

        {rows.map(({ synthesis, baziPillar, personalYearNum, yearAnimal, zodiacPolarity }) => {
          const isCurrent = synthesis.year === currentYear;
          return (
            <div
              key={synthesis.year}
              className={`luck-timeline__row${isCurrent ? " luck-timeline__row--current" : ""}`}
              role="row"
              aria-current={isCurrent ? "true" : undefined}
            >
              <span className="luck-timeline__cell luck-timeline__year" role="cell">
                {synthesis.year}
                {isCurrent && <span className="luck-timeline__now-badge">Now</span>}
              </span>

              <span className="luck-timeline__cell" role="cell">
                {baziPillar
                  ? `${baziPillar.stem.chinese}${baziPillar.branch.chinese} (${baziPillar.stem.pinyin} ${baziPillar.branch.animal})`
                  : <span className="luck-timeline__unavailable">—</span>}
              </span>

              <span className="luck-timeline__cell" role="cell">
                <span className="luck-timeline__py-num">{personalYearNum}</span>
                <span className="luck-timeline__py-theme">{PY_THEMES[personalYearNum] ?? ""}</span>
              </span>

              <span className="luck-timeline__cell" role="cell">
                <span className="luck-timeline__animal">
                  {yearAnimal.chinese} {yearAnimal.english}
                </span>
                <span className={`luck-timeline__zodiac-polarity luck-timeline__zodiac-polarity--${zodiacPolarity}`}>
                  {zodiacPolarity}
                </span>
              </span>

              <span
                className={`luck-timeline__cell luck-timeline__polarity luck-timeline__polarity--${synthesis.overallPolarity}`}
                role="cell"
              >
                {POLARITY_LABELS[synthesis.overallPolarity]}
              </span>

              <span className="luck-timeline__cell luck-timeline__summary" role="cell">
                {synthesis.summary}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
