import type { Metadata } from "next";
import { LifeForecastClient } from "./LifeForecastClient";

export const metadata: Metadata = {
  title: "生命預測 Life Forecast Oracle | Divine Secrets",
  description:
    "Enter your birth details to receive a whole-life profile and a year-by-year luck timeline from five traditions: BaZi, Numerology, Zi Wei Dou Shu, Chinese Zodiac, and Western Astrology.",
  openGraph: {
    title: "生命預測 Life Forecast Oracle",
    description:
      "BaZi · Numerology · Zi Wei · Zodiac · Astrology — five traditions, one synthesised life reading.",
  },
};

export default function LifeForecastPage() {
  return <LifeForecastClient />;
}
