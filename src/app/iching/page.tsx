"use client";

import { useState } from "react";
import { performIChingReading, type IChingHexagram, type IChingReading } from "@/lib/iching";
import { Stars } from "@/components/Stars";
import { MethodologyModal } from "@/components/MethodologyModal";

export default function IChingPage() {
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<IChingReading | null>(null);
  const [error, setError] = useState("");
  const [showMethodology, setShowMethodology] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setError("");
    try {
      setReading(performIChingReading(q));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reading failed.");
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <Stars />
        <div className="hero-zh">易經</div>
        <div className="divider" />
        <div className="hero-en">I Ching Oracle</div>
        <p>
          Focus your mind on your question, then cast the hexagram. The coins will fall as they
          must — three coins, six throws, one answer from the Book of Changes.
        </p>
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
      </section>

      <section className="workspace-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Cast a Hexagram / 起卦</h2>
          <label htmlFor="iching-question">Your question / 問題</label>
          <textarea
            id="iching-question"
            className="oracle-question-form__textarea"
            placeholder="e.g., What should I focus on this season?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!question.trim()}
          >
            Cast Hexagram / 起卦
          </button>
          {error && <p className="error-msg">{error}</p>}
        </form>

        <section className="panel result-panel">
          <h2>Reading / 卦象</h2>
          {!reading ? (
            <p className="placeholder">
              Enter your question and cast the hexagram to receive guidance.
            </p>
          ) : (
            <IChingResult reading={reading} />
          )}
        </section>
      </section>

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How I Ching Works / 易經計算原理">
        <h3>Overview</h3>
        <p>
          The I Ching (易經, Book of Changes) is one of the oldest divination texts in the world, dating back over
          3,000 years. It uses 64 hexagrams — each a stack of six lines — to describe every possible
          situation a person can face. The system works by simulating chance to reveal the pattern of the moment.
        </p>

        <h3>The Coin Method / 硬幣法</h3>
        <p>
          Three coins are thrown six times, once for each line of the hexagram, built from the bottom up.
          Each throw produces a value:
        </p>
        <table>
          <thead>
            <tr><th>Coins (heads = 3, tails = 2)</th><th>Total</th><th>Line type</th></tr>
          </thead>
          <tbody>
            <tr><td>3 tails</td><td>6</td><td>Old Yin ×  — changing yin</td></tr>
            <tr><td>2 tails + 1 head</td><td>7</td><td>Young Yang — fixed yang ——</td></tr>
            <tr><td>1 tail + 2 heads</td><td>8</td><td>Young Yin — fixed yin — —</td></tr>
            <tr><td>3 heads</td><td>9</td><td>Old Yang ○ — changing yang</td></tr>
          </tbody>
        </table>
        <p>
          Even totals (6, 8) are yin lines; odd totals (7, 9) are yang lines.
          Values 6 and 9 are <strong>changing lines</strong> — they are unstable and in the process of transforming.
        </p>

        <h3>Fixed Lines vs. Changing Lines</h3>
        <p>
          A value of <strong>7 or 8</strong> is a <em>fixed</em> (stable) line — it stays as-is and forms only the primary hexagram.
        </p>
        <p>
          A value of <strong>6 (×)</strong> is old yin — a yin line that has reached its extreme and flips to yang.
          A value of <strong>9 (○)</strong> is old yang — a yang line that has reached its extreme and flips to yin.
        </p>

        <h3>Why Two Hexagrams Appear</h3>
        <p>
          When any changing lines are present, those lines flip (× → yang, ○ → yin) to produce a
          <strong> Resulting Hexagram (之卦)</strong>.
          The <em>primary</em> hexagram describes the current situation as it stands now.
          The <em>resulting</em> hexagram describes where the situation is moving — the outcome if current
          energies play out.
          The changing lines themselves carry individual guidance for the specific transition taking place.
        </p>
        <p>
          If no changing lines are cast, only one hexagram appears — the situation is stable and the
          primary reading stands alone.
        </p>

        <h3>The 64 Hexagrams</h3>
        <p>
          Each hexagram is formed by stacking two trigrams (三爻卦) — an upper and a lower — chosen from
          the eight fundamental trigrams (八卦): Heaven ☰, Earth ☷, Thunder ☳, Water ☵, Mountain ☶,
          Wind ☴, Fire ☲, Lake ☱. The 8 × 8 combination produces 64 unique hexagrams.
          Each has a name, Judgment (彖辭), Image (象辭), and commentary on each line.
        </p>

        <div className="note-box">
          <strong>Note:</strong> This application simulates the three-coin method using a
          cryptographically seeded pseudo-random generator. Each cast is independent and unpredictable.
        </div>
      </MethodologyModal>
    </main>
  );
}

// ─── Result Display ───────────────────────────────────────────────────────────

function IChingResult({ reading }: { reading: IChingReading }) {
  return (
    <div className="iching-result">
      {reading.question && (
        <p className="iching-question-display">
          <em>Question:</em> {reading.question}
        </p>
      )}

      <HexagramDisplay hexagram={reading.primaryHexagram} changingLines={reading.changingLines} />

      <div className="iching-name">
        <span className="iching-name__zh">{reading.primaryHexagram.nameZh}</span>
        <span className="iching-name__pinyin">{reading.primaryHexagram.namePinyin}</span>
        <span className="iching-name__en">{reading.primaryHexagram.nameEn}</span>
      </div>

      <div className="iching-judgment">
        <h4>Judgment 彖辭</h4>
        <p className="iching-judgment__en">{reading.primaryHexagram.judgment.en}</p>
        <p className="iching-judgment__zh">{reading.primaryHexagram.judgment.zh}</p>
      </div>

      <div className="iching-image-text">
        <h4>Image 象辭</h4>
        <p className="iching-judgment__en">{reading.primaryHexagram.image.en}</p>
        <p className="iching-judgment__zh">{reading.primaryHexagram.image.zh}</p>
      </div>

      {reading.changingLines.length > 0 && (
        <div className="iching-changing-lines">
          <h4>Changing Lines 爻辭 ({reading.changingLines.length})</h4>
          {reading.changingLines.map((idx) => {
            const lt = reading.primaryHexagram.linesText[idx];
            return (
              <div key={idx} className={`iching-line-text iching-line-text--${lt.nature}`}>
                <span className="iching-line-text__label">Line {idx + 1}</span>
                <p className="iching-line-text__en">{lt.en}</p>
                <p className="iching-line-text__zh">{lt.zh}</p>
              </div>
            );
          })}
        </div>
      )}

      {reading.resultingHexagram && (
        <div className="iching-resulting">
          <div className="note-box" style={{ marginBottom: "0.75rem" }}>
            The changing lines above (× = old yin, ○ = old yang) flip to their opposites, forming a second hexagram.
            The primary hexagram describes your current situation; this Resulting Hexagram (之卦) shows where it is heading.
          </div>
          <h4>Resulting Hexagram 之卦</h4>
          <HexagramDisplay hexagram={reading.resultingHexagram} changingLines={[]} />
          <div className="iching-name iching-name--secondary">
            <span className="iching-name__zh">{reading.resultingHexagram.nameZh}</span>
            <span className="iching-name__pinyin">{reading.resultingHexagram.namePinyin}</span>
            <span className="iching-name__en">{reading.resultingHexagram.nameEn}</span>
          </div>
          <p className="iching-judgment__en">{reading.resultingHexagram.judgment.en}</p>
          <p className="iching-judgment__zh">{reading.resultingHexagram.judgment.zh}</p>
        </div>
      )}
    </div>
  );
}

// ─── Hexagram Line Display ────────────────────────────────────────────────────

function HexagramDisplay({
  hexagram,
  changingLines,
}: {
  hexagram: IChingHexagram;
  changingLines: number[];
}) {
  // Render lines from bottom (index 0) to top (index 5) — display top first
  const lineIndices = [5, 4, 3, 2, 1, 0];

  return (
    <div className="iching-hexagram">
      {lineIndices.map((i) => {
        const isYang = hexagram.lines[i] === 1;
        const isChanging = changingLines.includes(i);
        return (
          <div
            key={i}
            className={[
              "iching-line",
              isYang ? "iching-line--yang" : "iching-line--yin",
              isChanging ? "iching-line--changing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {isYang ? (
              <div className="iching-line__bar" />
            ) : (
              <>
                <div className="iching-line__half" />
                <div className="iching-line__half" />
              </>
            )}
            {isChanging && (
              <span className="iching-line__marker">
                {hexagram.lines[i] === 0 ? "×" : "○"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
