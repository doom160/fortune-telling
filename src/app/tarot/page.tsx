"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import {
  TarotReading,
  TarotSpread,
  getSpreadDefinition,
  getTarotCardImageSrc,
  getSpreadPositionLabel,
  performTarotReading,
} from "@/lib/tarot";

type FormState = {
  spreadType: TarotSpread;
};

const EMPTY_FORM: FormState = {
  spreadType: "ThreeCard",
};

export default function TarotPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [error, setError] = useState<string>("");
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const currentSpreadDefinition = getSpreadDefinition(form.spreadType);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const result = performTarotReading(form.spreadType);
      setReading(result);
    } catch (submitError) {
      setReading(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while drawing your cards.",
      );
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-zh">塔羅牌</div>
        <div className="divider" />
        <div className="hero-en">Tarot Reading</div>
        <p>
          Draw cards to seek guidance and reflection. Choose your preferred spread and let the
          ancient wisdom of the cards speak to your questions.
        </p>
      </section>

      <section className="workspace-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Reading Setup / 牌阵设置</h2>

          <label>
            Spread Type / 牌阵
            <select
              value={form.spreadType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  spreadType: event.target.value as TarotSpread,
                }))
              }
              required
            >
              <option value="ThreeCard">Three-Card (Past, Present, Future)</option>
              <option value="DailyCard">Daily Guidance</option>
              <option value="Relationship">Relationship Spread</option>
              <option value="Celtic">Celtic Cross</option>
              <option value="Horseshoe">Horseshoe Spread</option>
              <option value="Career">Career Spread</option>
            </select>
          </label>

          <div className="spread-description">
            <p className="spread-desc-label">
              {currentSpreadDefinition.label}
            </p>
            <p className="spread-desc-text">
              {currentSpreadDefinition.description}
            </p>
          </div>

          <button type="submit">Draw Cards / 抽牌</button>
          {error ? <p className="error-msg">{error}</p> : null}
        </form>

        <section className="panel result-panel" ref={resultPanelRef}>
          <h2>Reading Output</h2>

          {!reading ? (
            <p className="placeholder">
              Submit the form to draw your tarot cards and receive guidance.
            </p>
          ) : (
            <>
              <div className="reading-info">
                <p>
                  <span>Spread:</span> {getSpreadDefinition(reading.spread).label}
                </p>
                <p>
                  <span>Date:</span> {new Date(reading.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="cards-display">
                <h3>Your Cards</h3>
                <div className={`spread-layout spread-${reading.spread.toLowerCase()}`}>
                  {reading.cards.map((card, idx) => {
                    const layoutArea =
                      getSpreadDefinition(reading.spread).positions.find(
                        (entry) => entry.key === card.position,
                      )?.layoutArea ?? `slot-${idx + 1}`;

                    return (
                      <article
                        key={idx}
                        className={`spread-slot slot-${layoutArea} ${
                          card.position === "2" && reading.spread === "Celtic" ? "slot-crossing" : ""
                        }`}
                      >
                        <div className="card-container">
                          <div
                            className={`tarot-card ${
                              card.orientation === "Reversed" ? "is-reversed" : ""
                            }`}
                          >
                            <Image
                              className="tarot-card-image"
                              src={getTarotCardImageSrc(card.card, card.orientation)}
                              alt={`${card.card.name} ${card.orientation}`}
                              width={140}
                              height={200}
                              unoptimized
                            />
                          </div>
                          <p className="card-position">
                            {getSpreadPositionLabel(reading.spread, card.position)}
                          </p>
                          <p className="card-orientation">{card.orientation}</p>
                          <div className="card-hover-meaning">
                            <p className="hover-title">{card.card.name}</p>
                            <p className="hover-body">
                              {card.orientation === "Reversed"
                                ? card.card.reversed.meaning
                                : card.card.upright.meaning}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="card-meanings">
                <h3>Card Meanings & Guidance</h3>
                <div className="meanings-grid">
                  {reading.cards.map((card, idx) => {
                    const meanings =
                      card.orientation === "Reversed"
                        ? card.card.reversed.meaning
                        : card.card.upright.meaning;

                    const keywords =
                      card.orientation === "Reversed"
                        ? card.card.reversed.keywords
                        : card.card.upright.keywords;

                    return (
                      <div key={idx} className="meaning-card">
                        <div className="meaning-header">
                          <h4>{card.card.name}</h4>
                          <span className="meaning-position">
                            {getSpreadPositionLabel(reading.spread, card.position)}
                          </span>
                        </div>
                        <p className="meaning-label">
                          ({card.orientation})
                        </p>
                        <p className="meaning-text">{meanings}</p>
                        {keywords && keywords.length > 0 ? (
                          <div className="meaning-keywords">
                            {keywords.map((keyword, keyIdx) => (
                              <span key={keyIdx} className="keyword">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="interpretation">
                <h3>Reading Interpretation</h3>
                <div className="interpretation-text">
                  {reading.interpretation && reading.interpretation.length > 0 ? (
                    <ReadingSections lines={reading.interpretation} />
                  ) : (
                    <p>
                      Reflect on how these cards speak to your current situation. Trust your
                      intuition and let the symbols guide you.
                    </p>
                  )}
                </div>
              </div>

              <div className="reflection-box">
                <h3>Questions for Reflection</h3>
                {reading.spread === "ThreeCard" ? (
                  <ul>
                    <li>What events or influences brought me to this moment?</li>
                    <li>What is the core essence of my situation right now?</li>
                    <li>What possibilities or outcomes are emerging?</li>
                  </ul>
                ) : reading.spread === "DailyCard" ? (
                  <ul>
                    <li>How does this card apply to my day ahead?</li>
                    <li>What intention can I set based on this guidance?</li>
                    <li>How can I embody this energy today?</li>
                  </ul>
                ) : reading.spread === "Relationship" ? (
                  <ul>
                    <li>What am I bringing to this relationship or connection?</li>
                    <li>What is the other person&apos;s role or perspective?</li>
                    <li>Where is this relationship heading or how will it develop?</li>
                  </ul>
                ) : (
                  <ul>
                    <li>What do these cards reveal about my situation?</li>
                    <li>What patterns or themes are emerging?</li>
                    <li>What wisdom can I take from this reading?</li>
                  </ul>
                )}
              </div>

              <div className="note-box">
                <p>
                  <strong>Remember:</strong> Tarot readings are tools for reflection and self-discovery.
                  The cards invite you to explore deeper truths within yourself, not to predict the future
                  with certainty. Use this reading to gain perspective and clarity on your situation.
                </p>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function ReadingSections({ lines }: { lines: string[] }) {
  const sections: Array<{ title?: string; paragraphs: string[] }> = [];
  let current: { title?: string; paragraphs: string[] } = { paragraphs: [] };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current.title || current.paragraphs.length > 0) {
        sections.push(current);
      }
      current = { title: line.slice(3), paragraphs: [] };
    } else {
      current.paragraphs.push(line);
    }
  }
  if (current.title || current.paragraphs.length > 0) {
    sections.push(current);
  }

  return (
    <div className="reading-sections">
      {sections.map((section, idx) => (
        <div key={idx} className="reading-section">
          {section.title ? <h4 className="reading-section-title">{section.title}</h4> : null}
          {section.paragraphs.map((p, pIdx) => (
            <p key={pIdx} className="reading-section-text">{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
