import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Common questions about 天機 Heavenly Secrets: privacy, accuracy, birth time requirements, calculation methods, and how to use each divination system.",
  openGraph: {
    title: "FAQ — Frequently Asked Questions",
    description:
      "Answers to common questions about BaZi, Zi Wei Dou Shu, Astrology, Tarot, Numerology, and other divination tools on 天機 Heavenly Secrets.",
  },
};

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is 天機 Heavenly Secrets?",
    a: "天機 Heavenly Secrets is a collection of traditional divination and metaphysical tools brought together in one application. It includes Chinese systems (BaZi, Zi Wei Dou Shu, Qi Men Dun Jia, Guanyin Lots), Western systems (Astrology, Tarot), and a cross-cultural Numerology reading. All calculations are performed locally in your browser — no data is sent to any server.",
  },
  {
    q: "Is my personal information stored or shared?",
    a: "No. All calculations run entirely in your browser. Your birth details, name, and any other inputs are never transmitted to a server, stored in a database, or shared with third parties. When you close the page, the data is gone.",
  },
  {
    q: "Do I need an exact birth time?",
    a: "It depends on the system. BaZi and Zi Wei Dou Shu use the Chinese double-hour (two-hour block), so an approximate time within a couple of hours is often sufficient. Western Astrology requires an exact birth time for the Ascendant, house cusps, and precise Moon position — without it, these are omitted. Numerology and Guanyin Lots do not require a birth time at all.",
  },
  {
    q: "How accurate are the BaZi calculations?",
    a: "The BaZi engine uses astronomical solar term calculations (via the astronomy-engine library) to determine month boundaries precisely. This matches the accuracy of professional BaZi software. The Four Pillars, hidden stems, and Ten-Year Luck Periods are all calculated using standard classical methods.",
  },
  {
    q: "What is Zi Wei Dou Shu and how does it differ from BaZi?",
    a: "Zi Wei Dou Shu (Purple Star Astrology) is a star-based Chinese astrological system that maps over 100 stars across 12 life palaces. While BaZi focuses on elemental balance through the Five Elements, Zi Wei provides a more detailed view of specific life domains like career, wealth, relationships, and health through star interactions.",
  },
  {
    q: "What is Qi Men Dun Jia used for?",
    a: "Qi Men Dun Jia is a strategic divination system originally developed for military planning. It constructs a nine-palace chart based on the current moment to assess timing, directional guidance, and decision-making. It answers questions like \"Is now a good time to act?\" and \"Which direction is most favorable?\" rather than analyzing personality traits.",
  },
  {
    q: "How does the Numerology reading combine Eastern and Western systems?",
    a: "The reading calculates Western Pythagorean numbers (Life Path, Expression, Soul Urge, Personality) alongside the Chinese Lo Shu Grid analysis. Your birth date digits are mapped onto the 3×3 Lo Shu magic square to reveal Arrows of Strength and Weakness, while also assigning Five Element attributes (Wood, Fire, Earth, Metal, Water) to each number.",
  },
  {
    q: "How are the Western Astrology planet positions calculated?",
    a: "Planet positions are calculated as geocentric ecliptic longitude using the astronomy-engine library, which implements high-precision astronomical algorithms. The Sun, Moon, and all planets through Pluto are computed for your exact birth moment. House cusps use the Placidus system with an Equal House fallback for extreme latitudes.",
  },
  {
    q: "What are transits in Western Astrology?",
    a: "Transits show where the planets are right now relative to where they were when you were born. When a current (transiting) planet forms an aspect to one of your natal planets, it activates that energy. Slow-moving planets like Pluto, Neptune, and Saturn create the most significant transits because their influence lasts longer.",
  },
  {
    q: "Are the Tarot readings truly random?",
    a: "Yes. Card draws use your browser's cryptographic random number generator (crypto.getRandomValues) for genuine randomness. No algorithm predetermines the cards — each draw is as random as digital technology allows.",
  },
  {
    q: "What are the Guanyin Lots (觀音靈籤)?",
    a: "Guanyin Lots is a traditional Chinese temple divination practice associated with the Bodhisattva of Compassion. You draw one of 100 numbered lots, each containing a classical poem with layered guidance. The interpretation covers general outlook, relationships, career, health, and practical advice.",
  },
  {
    q: "Can I export or save my readings?",
    a: "Yes. Every reading page has an Export PDF button (generates a downloadable PDF) and a Copy & Share button (copies a formatted text version to your clipboard). You can save these for personal reference or share with friends.",
  },
  {
    q: "What does the \"How It Works\" button do?",
    a: "Each calculation-based page (BaZi, Zi Wei, Numerology, Qi Men Dun Jia, Western Astrology) has a \"How It Works\" modal that explains the methodology and formulas behind the calculations in detail. It covers the theoretical foundations, the specific algorithms used, and any relevant cultural or historical context.",
  },
  {
    q: "Should I take these readings as absolute truth?",
    a: "No. These tools are meant for self-reflection, personal exploration, and connecting with ancient wisdom traditions. They can offer fresh perspectives and prompt useful introspection, but they should not replace professional advice for important life decisions. Think of them as mirrors that reflect patterns — the interpretation and application is always in your hands.",
  },
  {
    q: "Why does the same BaZi chart sometimes show different results on different websites?",
    a: "Differences typically come from how solar term boundaries are calculated (astronomical vs. fixed-date approximations), how the early hours (11 PM - 1 AM) are handled, and whether True Solar Time adjustments are applied. 天機 uses precise astronomical calculations for solar terms, which matches professional-grade software.",
  },
  {
    q: "What technologies power this application?",
    a: "The app is built with Next.js and React, using TypeScript for type safety. Astronomical calculations use the astronomy-engine library. All fortune-telling logic runs client-side as pure functions — there is no backend server or database. The design uses custom CSS with a dark theme and gold accents inspired by classical East Asian aesthetics.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="hero-panel">
        <div className="hero-zh">常問</div>
        <div className="divider" />
        <div className="hero-en">Frequently Asked Questions</div>
        <p>
          Common questions about 天機 Heavenly Secrets, its methods, and how to get the most from your readings.
        </p>
      </section>

      <section className="faq-container">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="faq-item" open={i === 0}>
            <summary className="faq-question">{item.q}</summary>
            <p className="faq-answer">{item.a}</p>
          </details>
        ))}

        <div className="faq-footer">
          <p>
            Still have questions? Each reading page includes a detailed &quot;How It Works&quot; explanation
            of the methodology behind the calculations.
          </p>
          <Link href="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
