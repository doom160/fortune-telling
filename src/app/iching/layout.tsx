import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "易經 I Ching — Hexagram Oracle",
  description:
    "Cast an I Ching hexagram reading using the traditional three-coin method. Explore the 64 hexagrams, changing lines, and the resulting hexagram — all interpreted from the classical King Wen sequence.",
  openGraph: {
    title: "易經 I Ching — Hexagram Oracle",
    description:
      "Free online I Ching reading with coin-toss casting, changing lines, and classical hexagram interpretations.",
  },
};

export default function IChingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
