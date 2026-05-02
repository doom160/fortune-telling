import type { Metadata } from "next";
import { LifeDirectionsClient } from "./LifeDirectionsClient";

export const metadata: Metadata = {
  title: "問卦指引 Life Directions Oracle | Divine Secrets",
  description:
    "Ask a question and receive guidance from three complementary traditions: Guan Yin divinity lots, Qi Men Dun Jia strategic timing, and Tarot archetypal insight. Overlapping signals are synthesised with a confidence score.",
  openGraph: {
    title: "問卦指引 Life Directions Oracle",
    description:
      "One question, three traditions, one synthesised answer. Guan Yin · Qi Men Dun Jia · Tarot.",
  },
};

export default function LifeDirectionsPage() {
  return <LifeDirectionsClient />;
}
