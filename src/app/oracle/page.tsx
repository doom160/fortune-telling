import type { Metadata } from "next";
import Link from "next/link";
import { Stars } from "@/components/Stars";

export const metadata: Metadata = {
  title: "合一神諭 Oracle — Cross-System Unified Reading | Divine Secrets",
  description:
    "Consult multiple divination traditions simultaneously. Life Directions Oracle (Guan Yin, Qi Men, Tarot) for guidance questions. Life Forecast Oracle (BaZi, Numerology, Zi Wei, Zodiac, Astrology) for birth-date life readings and luck timelines.",
  openGraph: {
    title: "合一神諭 Oracle — Cross-System Unified Reading",
    description:
      "One question, multiple traditions, one synthesised answer. Choose your oracle path below.",
  },
};

export default function OraclePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <Stars />
        <div className="hero-zh">合一神諭</div>
        <div className="divider" />
        <div className="hero-en">Oracle</div>
        <p>
          Consult multiple divination traditions at once. The Oracle synthesises overlapping signals
          across systems and surfaces the themes all traditions agree on — with a confidence score
          for each.
        </p>
      </section>

      <section className="workspace-grid oracle-hub-grid">
        <Link href="/oracle/life-directions" className="oracle-hub-card">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />
          <div className="oracle-hub-card__zh">問卦指引</div>
          <div className="oracle-hub-card__en">Life Directions</div>
          <div className="oracle-hub-card__sub">Guan Yin · Qi Men Dun Jia · Tarot</div>
          <p className="oracle-hub-card__desc">
            Ask a specific question and receive guidance from three complementary traditions —
            Chinese oracular wisdom, strategic timing divination, and Western archetypal insight.
            Overlapping signals are highlighted with a confidence score.
          </p>
          <span className="oracle-hub-card__cta">Ask a question →</span>
        </Link>

        <Link href="/oracle/life-forecast" className="oracle-hub-card">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />
          <div className="oracle-hub-card__zh">生命預測</div>
          <div className="oracle-hub-card__en">Life Forecast</div>
          <div className="oracle-hub-card__sub">
            BaZi · Numerology · Zi Wei · Zodiac · Astrology
          </div>
          <p className="oracle-hub-card__desc">
            Enter your birth details to receive a whole-life profile and a year-by-year luck
            timeline from five traditions. See which years multiple systems flag as auspicious or
            challenging.
          </p>
          <span className="oracle-hub-card__cta">Enter birth details →</span>
        </Link>
      </section>
    </main>
  );
}
