import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numerology — East-West Number Analysis (數理)",
  description: "Discover your numerological profile combining Western Pythagorean numerology (Life Path, Expression, Soul Urge) with the ancient Chinese Lo Shu Grid and Five Element analysis.",
  openGraph: {
    title: "Numerology — East-West Number Analysis",
    description: "Free cross-cultural numerology reading combining Pythagorean numbers with Chinese Lo Shu Grid analysis.",
  },
};

export default function NumerologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
