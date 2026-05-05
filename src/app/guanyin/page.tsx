"use client";

import { FormEvent, useState } from "react";
import {
  buildGuanyinReading,
  GUANYIN_FOCUS_OPTIONS,
  GUANYIN_MAX_LOT,
  GuanyinReading,
} from "@/lib/guanyin";
import { MethodologyModal } from "@/components/MethodologyModal";

type FormState = {
  question: string;
  focus: string;
  lotNumber: string;
};

const EMPTY_FORM: FormState = {
  question: "",
  focus: "General",
  lotNumber: "",
};

export default function GuanyinPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [reading, setReading] = useState<GuanyinReading | null>(null);
  const [error, setError] = useState("");
  const [showMethodology, setShowMethodology] = useState(false);

  function handleDraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedLotNumber = form.lotNumber.trim() ? Number(form.lotNumber) : undefined;
    if (
      parsedLotNumber !== undefined &&
      (!Number.isInteger(parsedLotNumber) || parsedLotNumber < 1 || parsedLotNumber > GUANYIN_MAX_LOT)
    ) {
      setError(`Lot number must be between 1 and ${GUANYIN_MAX_LOT}.`);
      return;
    }

    const result = buildGuanyinReading({
      question: form.question,
      focus: form.focus,
      lotNumber: parsedLotNumber,
    });
    setReading(result);
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-zh">觀音靈籤</div>
        <div className="divider" />
        <div className="hero-en">Guan Yin Divination</div>
        <p>
          Draw a Guanyin lot to receive a poetic sign, practical guidance, and a focused reading
          for career, finance, love, and health.
        </p>
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
      </section>

      <section className="workspace-grid">
        <form className="panel" onSubmit={handleDraw}>
          <h2>Ask Your Question / 所求之事</h2>

          <label>
            Focus Area / 求签类别
            <select
              value={form.focus}
              onChange={(event) => setForm((prev) => ({ ...prev, focus: event.target.value }))}
            >
              {GUANYIN_FOCUS_OPTIONS.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </label>

          <label>
            Question / 问题 (optional)
            <textarea
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
              placeholder="e.g. Should I change jobs this year?"
              rows={4}
            />
          </label>

          <label>
            Lot Number / 签号 (optional, 1-{GUANYIN_MAX_LOT})
            <input
              type="number"
              min={1}
              max={GUANYIN_MAX_LOT}
              value={form.lotNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, lotNumber: event.target.value }))}
              placeholder="Leave blank to draw randomly"
            />
          </label>

          <button type="submit">Draw Guanyin Lot / 求签</button>
          {error ? <p className="error-msg">{error}</p> : null}
        </form>

        <section className="panel result-panel">
          <h2>Reading</h2>

          {!reading ? (
            <p className="placeholder">
              Draw a lot to reveal your verse and practical guidance.
            </p>
          ) : (
            <>
              <div className="guanyin-lot-header">
                <p className="guanyin-lot-number">Lot {reading.lot.number}</p>
                <span className={`guanyin-outcome guanyin-${reading.lot.outcome.toLowerCase()}`}>
                  {reading.lot.outcome}
                </span>
              </div>

              <div className="guanyin-main-card">
                <h3>{reading.lot.title}</h3>
                <p className="guanyin-poem">{reading.lot.poem}</p>
                <p className="guanyin-summary">{reading.lot.summary}</p>
                {reading.question ? (
                  <p className="guanyin-context">
                    <strong>Your Question:</strong> {reading.question}
                  </p>
                ) : null}
                {reading.focus ? (
                  <p className="guanyin-context">
                    <strong>Focus:</strong> {reading.focus}
                  </p>
                ) : null}
              </div>

              <div className="guanyin-reading-grid">
                <article className="guanyin-reading-card">
                  <h4>Career</h4>
                  <p>{reading.lot.career}</p>
                </article>
                <article className="guanyin-reading-card">
                  <h4>Finance</h4>
                  <p>{reading.lot.finance}</p>
                </article>
                <article className="guanyin-reading-card">
                  <h4>Love</h4>
                  <p>{reading.lot.love}</p>
                </article>
                <article className="guanyin-reading-card">
                  <h4>Health</h4>
                  <p>{reading.lot.health}</p>
                </article>
              </div>

              <div className="note-box">
                <p>
                  <strong>Guidance:</strong> {reading.lot.guidance}
                </p>
                <p>
                  Use this reading as reflective guidance to support wiser decisions, not as a
                  fixed prediction.
                </p>
              </div>
            </>
          )}
        </section>
      </section>

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How Guan Yin Divination Works / 觀音靈籤原理">
        <h3>Overview</h3>
        <p>
          Guan Yin Divination (觀音靈籤) is a Chinese oracular tradition associated with Guan Yin
          (觀世音菩薩), the Bodhisattva of Compassion. Practiced for over a thousand years in Buddhist
          temples across China, Taiwan, and Southeast Asia, it uses a set of numbered lots (籤) — each
          containing a poem and practical guidance — to respond to a seeker&apos;s question.
        </p>

        <h3>The Lot System</h3>
        <p>
          A traditional set contains <strong>{GUANYIN_MAX_LOT} lots</strong>, numbered 1 through {GUANYIN_MAX_LOT}.
          In a temple, the seeker holds a bamboo tube containing numbered sticks, shakes it gently while
          focusing on their question, and allows one stick to fall out. The number on that stick identifies
          the lot.
        </p>
        <p>
          This application simulates the draw by randomly selecting a lot, or allows you to enter a
          specific lot number if you have already cast physically.
        </p>

        <h3>Lot Outcomes</h3>
        <p>
          Each lot is classified by its overall quality:
        </p>
        <table>
          <thead>
            <tr><th>Outcome</th><th>Meaning</th></tr>
          </thead>
          <tbody>
            <tr><td>Good (吉)</td><td>Favourable energy — proceed with confidence</td></tr>
            <tr><td>Average (平)</td><td>Mixed energy — proceed with care and discernment</td></tr>
            <tr><td>Caution (凶)</td><td>Challenging energy — pause, reflect, and reconsider</td></tr>
          </tbody>
        </table>
        <p>
          A &quot;Caution&quot; outcome is not a curse — it is a warning to slow down and examine the situation
          more carefully. Many practitioners believe a cautious lot answered honestly is more valuable
          than a favourable one ignored.
        </p>

        <h3>The Poem and Its Guidance</h3>
        <p>
          Each lot contains a four-line classical Chinese poem (籤詩). The poem speaks in metaphor and
          allegory, drawing on historical stories, nature imagery, and moral lessons. It is interpreted
          in relation to the seeker&apos;s specific question and focus area.
        </p>
        <p>
          Beneath the poem, each lot provides specific guidance for four life domains:
          <strong> Career</strong>, <strong>Finance</strong>, <strong>Love</strong>, and <strong>Health</strong> —
          allowing the same lot to give relevant advice across different areas of life.
        </p>

        <h3>Focus Areas</h3>
        <p>
          Selecting a focus area before drawing does not change which lot is selected — it shapes
          how the poem&apos;s imagery is interpreted and which domain guidance is most relevant to your inquiry.
        </p>

        <div className="note-box">
          <strong>Note:</strong> This reading is for self-reflection and guidance. Approach the poem
          with an open mind — the meaning that resonates with you personally is often the most relevant.
        </div>
      </MethodologyModal>
    </main>
  );
}
