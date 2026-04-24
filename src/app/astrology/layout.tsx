import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Western Astrology — Natal Chart & Transits (星盤)",
  description: "Generate your natal chart with precise planet positions, Placidus house cusps, major aspects, and current transit overlays. Includes SVG wheel visualization and detailed interpretation.",
  openGraph: {
    title: "Western Astrology — Natal Chart & Transits",
    description: "Free online natal chart calculator with Placidus houses, aspects, transits, and interactive SVG wheel.",
  },
};

export default function AstrologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
