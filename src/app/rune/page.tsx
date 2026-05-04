"use client";

import { useState } from "react";
import { Stars } from "@/components/Stars";
import { performRuneReading, type RuneReading, type Rune } from "@/lib/rune";

// ─── RuneCard ─────────────────────────────────────────────────────────────────

function RuneCard({ rune, position }: { rune: Rune; position: string }) {
  return (
    <div className="rune-card">
      <div className="rune-card__position">{position}</div>
      <div className="rune-card__symbol">{rune.symbol || "⬜"}</div>
      <div className="rune-card__letter">{rune.letter || "—"}</div>
      <div className="rune-card__name">{rune.name}</div>
      <div className="rune-card__nameen">{rune.nameEn}</div>
      <p className="rune-card__meaning">{rune.meaning}</p>
      <div className="rune-card__keywords">
        {rune.keywords.map((kw) => (
          <span key={kw} className="rune-card__keyword-tag">{kw}</span>
        ))}
      </div>
      <div className={`rune-card__polarity rune-card__polarity--${rune.polarity}`}>
        {rune.polarity}
      </div>
    </div>
  );
}

// ─── ThreeRuneDraw ────────────────────────────────────────────────────────────

function ThreeRuneDraw({ reading }: { reading: RuneReading }) {
  const POSITION_LABELS: Record<string, string> = {
    past: "Past",
    present: "Present",
    future: "Future",
  };

  return (
    <div className="rune-result">
      <div className="rune-draw">
        {reading.drawnRunes.map((drawn) => (
          <RuneCard
            key={drawn.position}
            rune={drawn.rune}
            position={POSITION_LABELS[drawn.position]}
          />
        ))}
      </div>
      <div className="rune-interpretation">
        {reading.interpretation.slice(1).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RunePage() {
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<RuneReading | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setIsRunning(true);
    const result = performRuneReading(q);
    setReading(result);
    setIsRunning(false);
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <Stars />
        <div className="hero-zh">ᚱᚢᚾᛖᛋ</div>
        <div className="divider" />
        <div className="hero-en">Norse Rune Oracle</div>
        <p>
          Pose your question to the Elder Futhark. Three runes will be drawn — Past, Present, and
          Future — revealing the ancestral wisdom held in the runic tradition.
        </p>
      </section>

      <section className="workspace-grid">
        <form onSubmit={handleSubmit} className="oracle-question-form">
          <label htmlFor="rune-question" className="oracle-question-form__label">
            Your question
          </label>
          <textarea
            id="rune-question"
            className="oracle-question-form__textarea"
            placeholder="e.g., What should I focus on in my career right now?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            disabled={isRunning}
          />
          <button
            type="submit"
            className="oracle-question-form__submit btn-primary"
            disabled={!question.trim() || isRunning}
          >
            {isRunning ? "Drawing…" : "Draw Runes"}
          </button>
        </form>
      </section>

      {reading && <ThreeRuneDraw reading={reading} />}
    </main>
  );
}
