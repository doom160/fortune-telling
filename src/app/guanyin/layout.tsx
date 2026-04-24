import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guanyin Lots — Oracle of Compassion (觀音靈籤)",
  description: "Draw a Guanyin divination lot for poetic guidance and practical interpretation. 100 traditional temple lots covering relationships, career, health, and general outlook.",
  openGraph: {
    title: "Guanyin Lots — Oracle of Compassion",
    description: "Free online Guanyin Lots (觀音靈籤) divination with classical poetry and practical interpretation.",
  },
};

export default function GuanyinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
