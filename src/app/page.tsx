import Link from "next/link";
import { Stars, Orbs } from "@/components/Stars";

const SYSTEMS = [
  { id: "bazi", href: "/bazi", zh: "八字", en: "Bazi", sub: "Four Pillars of Destiny" },
  { id: "zwds", href: "/ziwei", zh: "紫微斗數", en: "Zi Wei Dou Shu", sub: "Purple Star Astrology" },
  { id: "guanyin", href: "/guanyin", zh: "觀音靈籤", en: "Guan Yin Divination", sub: "Oracle of Compassion" },
  { id: "tarot", href: "/tarot", zh: "塔羅牌", en: "Tarot", sub: "Archetypal Wisdom" },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-banner">
        <Orbs />
        <Stars />
        <div className="hero-content">
          <p className="tagline-zh">天機 · Mystic Matrix</p>
          <div className="divider" />
          <h1>The Ancient Arts<br />of Divination</h1>
          <p className="subtitle">
            Seek clarity through the wisdom of the ages. Choose your path below.
          </p>
        </div>
        <div className="cards-grid">
          {SYSTEMS.map((s) => (
            <Link key={s.id} href={s.href} className="system-card">
              <div className="corner corner-tl" />
              <div className="corner corner-br" />
              <div className="card-zh">{s.zh}</div>
              <div className="card-en">{s.en}</div>
              <div className="card-sub">{s.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Welcome to Your Reading Studio</h2>
        <div className="about-content">
          <div className="about-block">
            <h3>Authentic Practices</h3>
            <p>
              Mystic Matrix combines traditional metaphysical practices with modern convenience.
              Whether you&apos;re drawn to the structured depth of BaZi or the intuitive guidance of Tarot,
              each tool offers a unique pathway to self-discovery.
            </p>
          </div>
          <div className="about-block">
            <h3>How to Use</h3>
            <p>
              <strong>BaZi:</strong> Enter your birth details for a detailed chart analysis
              including element balance, life luck periods, and hidden stem insights.
            </p>
            <p>
              <strong>Guanyin Lots:</strong> Draw a lot for poetic guidance and practical interpretation.
            </p>
            <p>
              <strong>Tarot:</strong> Choose your preferred spread and draw cards for reflection.
            </p>
            <p>
              <strong>Zi Wei Dou Shu:</strong> Generate a twelve-palace chart to examine your destiny.
            </p>
          </div>
          <div className="about-block">
            <h3>For Reflection</h3>
            <p>
              These readings are tools for self-reflection and personal growth. Use them to explore patterns,
              gain perspective, and connect with ancient wisdom traditions.
            </p>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <h2>Begin Your Journey</h2>
        <p>Choose a practice to explore and receive insights today.</p>
        <div className="cta-buttons">
          <Link href="/bazi" className="btn btn-primary">
            八字 BaZi Reading
          </Link>
          <Link href="/ziwei" className="btn btn-primary">
            紫微 Zi Wei Dou Shu
          </Link>
          <Link href="/guanyin" className="btn btn-primary">
            觀音 Guanyin Lots
          </Link>
          <Link href="/tarot" className="btn btn-secondary">
            塔羅 Tarot Reading
          </Link>
        </div>
      </section>
    </main>
  );
}
