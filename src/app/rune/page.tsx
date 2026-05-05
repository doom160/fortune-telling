"use client";

import { useState } from "react";
import { Stars } from "@/components/Stars";
import { performRuneReading, type RuneReading, type Rune } from "@/lib/rune";
import { MethodologyModal } from "@/components/MethodologyModal";

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
  const [showMethodology, setShowMethodology] = useState(false);

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
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
      </section>

      <section className="workspace-grid">
        <form onSubmit={handleSubmit} className="panel">
          <h2>Draw Runes / 抽盧恩</h2>
          <label htmlFor="rune-question">Your question / 問題</label>
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
            className="btn-primary"
            disabled={!question.trim() || isRunning}
          >
            {isRunning ? "Drawing…" : "Draw Runes / 抽盧恩"}
          </button>
        </form>

        <section className="panel result-panel">
          <h2>Reading / 盧恩解讀</h2>
          {!reading ? (
            <p className="placeholder">
              Enter your question and draw the runes to receive guidance.
            </p>
          ) : (
            <ThreeRuneDraw reading={reading} />
          )}
        </section>
      </section>

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How Norse Runes Work / 盧恩占卜原理">
        <h3>Overview</h3>
        <p>
          The Elder Futhark (ᚠᚢᚦᚨᚱᚲ) is the oldest form of the runic alphabet, used by Germanic peoples
          from roughly the 2nd to 8th centuries CE. Its 24 runes are more than letters — each carries a
          rich web of symbolic meaning, mythology, and practical wisdom used for divination, protection,
          and understanding life&apos;s patterns.
        </p>

        <h3>The 24 Runes</h3>
        <p>
          The Elder Futhark is divided into three groups of eight called <strong>Ættir</strong> (families),
          each associated with a Norse deity:
        </p>
        <table>
          <thead>
            <tr><th>Ætt</th><th>Deity</th><th>Themes</th></tr>
          </thead>
          <tbody>
            <tr><td>First (ᚠ–ᚹ)</td><td>Freyr &amp; Freyja</td><td>Abundance, fertility, primal forces</td></tr>
            <tr><td>Second (ᚺ–ᛊ)</td><td>Heimdall</td><td>Protection, journey, transformation</td></tr>
            <tr><td>Third (ᛏ–ᛟ)</td><td>Tyr</td><td>Justice, ancestry, sacred order</td></tr>
          </tbody>
        </table>
        <p>
          Each rune has a name, a letter equivalent, a core meaning, associated keywords, and a
          polarity — <strong>light</strong> (constructive energy) or <strong>shadow</strong> (challenging energy to work through).
          No rune is wholly negative; even shadow runes carry lessons.
        </p>

        <h3>The Three-Rune Draw</h3>
        <p>
          Three runes are drawn at random and placed in three positions:
        </p>
        <table>
          <thead>
            <tr><th>Position</th><th>Meaning</th></tr>
          </thead>
          <tbody>
            <tr><td>Past</td><td>The root or background energy — what has shaped the situation</td></tr>
            <tr><td>Present</td><td>The active energy right now — the core of your question</td></tr>
            <tr><td>Future</td><td>The likely direction — the energy approaching if the current path continues</td></tr>
          </tbody>
        </table>
        <p>
          The Present rune is the most significant and its meaning is emphasised in the reading.
          All three are read together as a narrative arc.
        </p>

        <h3>Interpretation</h3>
        <p>
          Rune readings do not predict a fixed fate — they reveal the <em>energies at play</em>.
          Shadow runes in a reading point to areas of resistance or transformation, not inevitable bad outcomes.
          The Norse worldview held that awareness of a challenge was the first step to navigating it wisely.
        </p>

        <div className="note-box">
          <strong>Note:</strong> Runes are drawn using a seeded random selection from the full 24-rune set.
          Each draw is independent. The reading reflects the symbolic resonance of the moment, not a
          deterministic prediction.
        </div>
      </MethodologyModal>
    </main>
  );
}
