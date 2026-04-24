import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qi Men Dun Jia — Strategic Divination (奇門遁甲)",
  description: "Generate a Qi Men Dun Jia nine-palace chart for strategic timing and directional guidance. Supports time-based and year-based modes with Nine Stars, Eight Gates, and Eight Deities analysis.",
  openGraph: {
    title: "Qi Men Dun Jia — Strategic Divination",
    description: "Free online Qi Men Dun Jia calculator with nine-palace chart, formation detection, and strategic interpretation.",
  },
};

export default function QmdjLayout({ children }: { children: React.ReactNode }) {
  return children;
}
