"use client";

import { useState } from "react";
import { performIChingReading, type IChingHexagram, type IChingReading } from "@/lib/iching";
import { Stars } from "@/components/Stars";

export default function IChingPage() {
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<IChingReading | null>(null);
  const [error, setError] = useState("");

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
