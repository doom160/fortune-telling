"use client";

import type { Theme } from "@/lib/synthesis";

type Props = {
  themes: Theme[];
};

const CLASS_ICONS: Record<string, string> = {
  polarity: "◈",
  domain: "◇",
  keyword: "◆",
};

const TAG_LABELS: Record<string, string> = {
  auspicious: "Auspicious",
  mixed: "Mixed",
  caution: "Caution",
  career: "Career",
  relationship: "Relationship",
  wealth: "Wealth",
  health: "Health",
  timing: "Timing",
};

export function ThemeOverlapPanel({ themes }: Props) {
  if (themes.length === 0) return null;

  return (
    <div className="theme-overlap-panel">
      <h3 className="theme-overlap-panel__title">Overlapping Signals</h3>
      <div className="theme-overlap-panel__rows">
        {themes.map((theme, i) => (
          <div key={`${theme.class}-${theme.tag}-${i}`} className="theme-overlap-row">
            <span
              className={`theme-overlap-row__icon theme-overlap-row__icon--${theme.class}`}
              aria-label={theme.class}
            >
              {CLASS_ICONS[theme.class] ?? "◇"}
            </span>

            <span className="theme-overlap-row__tag">
              {TAG_LABELS[theme.tag] ?? theme.tag}
            </span>

            <div className="theme-overlap-row__bar-wrapper" aria-label={`${Math.round(theme.confidenceScore * 100)}% confidence`}>
              <div
                className="theme-overlap-row__bar-fill"
                style={{ width: `${Math.round(theme.confidenceScore * 100)}%` }}
              />
            </div>

            <span className="theme-overlap-row__score">
              {Math.round(theme.confidenceScore * 100)}%
            </span>

            <span className="theme-overlap-row__systems">
              {theme.systems.join(" · ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
