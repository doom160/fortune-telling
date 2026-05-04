import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Norse Runes — Elder Futhark Oracle | Divine Secrets",
  description:
    "Draw three Elder Futhark runes (Past, Present, Future) and receive a traditional Norse divination reading. Consult the wisdom of the ancient runic tradition.",
  openGraph: {
    title: "Norse Runes — Elder Futhark Oracle",
    description: "Draw three Elder Futhark runes and receive a Norse divination reading.",
    type: "website",
  },
};

export default function RuneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
