"use client";

import { FormEvent, useState } from "react";
import {
  buildGuanyinReading,
  GUANYIN_FOCUS_OPTIONS,
  GUANYIN_MAX_LOT,
  GuanyinReading,
} from "@/lib/guanyin";

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
    </main>
  );
}
