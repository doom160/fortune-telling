import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarot Reading — Archetypal Wisdom (塔羅牌)",
  description: "Draw Tarot cards with multiple spread options for reflection and guidance. Featuring the full 78-card Rider-Waite deck with upright and reversed interpretations.",
  openGraph: {
    title: "Tarot Reading — Archetypal Wisdom",
    description: "Free online Tarot reading with multiple spreads and detailed card interpretations.",
  },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
