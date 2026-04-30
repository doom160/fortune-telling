import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BaZi Compatibility — Marriage Chart Analysis (八字合婚)",
  description: "Compare two BaZi charts for relationship and marriage compatibility using classical methods: Day Master interaction, branch relationships, Na Yin, elemental complementarity, and Yin-Yang balance.",
  openGraph: {
    title: "BaZi Compatibility — Marriage Chart Analysis (八字合婚)",
    description: "Free BaZi compatibility analysis comparing two birth charts for marriage and relationship harmony using traditional Chinese metaphysics.",
  },
};

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
