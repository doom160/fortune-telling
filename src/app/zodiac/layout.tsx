import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chinese Zodiac — Daily Animal Forecast (生肖運勢)",
  description: "Discover your Chinese zodiac animal profile and view a 28-day daily forecast based on classical Earthly Branch relationships including Six Harmonies, Three Harmonies, Clashes, and more.",
  openGraph: {
    title: "Chinese Zodiac — Daily Animal Forecast",
    description: "Free Chinese zodiac daily forecast with classical branch relationship analysis covering career, wealth, relationships, and health.",
  },
};

export default function ZodiacLayout({ children }: { children: React.ReactNode }) {
  return children;
}
