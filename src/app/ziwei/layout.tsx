import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zi Wei Dou Shu — Purple Star Astrology (紫微斗數)",
  description: "Generate a Zi Wei Dou Shu twelve-palace chart with major and minor star placements, brightness analysis, and Four Transformations (四化). Explore life, career, wealth, and relationship palaces.",
  openGraph: {
    title: "Zi Wei Dou Shu — Purple Star Astrology",
    description: "Free online Zi Wei Dou Shu calculator with twelve-palace chart and star placement analysis.",
  },
};

export default function ZiweiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
