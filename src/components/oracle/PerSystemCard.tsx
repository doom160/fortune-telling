"use client";

import type { ReactNode } from "react";

type Tradition = "Chinese" | "Western" | "East-West" | "Norse";

type Props = {
  systemId: string;
  nameZh: string;
  nameEn: string;
  tradition: Tradition;
  notice?: string;
  children: ReactNode;
};

const TRADITION_LABELS: Record<Tradition, string> = {
  Chinese: "Chinese",
  Western: "Western",
  "East-West": "East-West",
  Norse: "Norse",
};

export function PerSystemCard({ nameZh, nameEn, tradition, notice, children }: Props) {
  return (
    <div className="per-system-card">
      <div className="per-system-card__header">
        <span className="per-system-card__name-zh">{nameZh}</span>
        <span className="per-system-card__name-en">{nameEn}</span>
        <span className={`per-system-card__badge per-system-card__badge--${tradition.toLowerCase().replace("-", "")}`}>
          {TRADITION_LABELS[tradition]}
        </span>
      </div>
      {notice && (
        <p className="per-system-card__notice">{notice}</p>
      )}
      <div className="per-system-card__body">{children}</div>
    </div>
  );
}
