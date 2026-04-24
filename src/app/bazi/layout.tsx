import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BaZi Reading — Four Pillars of Destiny (八字)",
  description: "Generate your BaZi (Four Pillars of Destiny) chart with precise astronomical solar term calculations. Analyze element balance, hidden stems, Day Master strength, and Ten-Year Luck Periods.",
  openGraph: {
    title: "BaZi Reading — Four Pillars of Destiny",
    description: "Free online BaZi calculator with element balance, hidden stems, and life luck period analysis.",
  },
};

export default function BaziLayout({ children }: { children: React.ReactNode }) {
  return children;
}
