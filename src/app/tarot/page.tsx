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
import { MethodologyModal } from "@/components/MethodologyModal";

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
  const [showMethodology, setShowMethodology] = useState(false);
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
        <button type="button" className="methodology-trigger" onClick={() => setShowMethodology(true)}>
          How It Works
        </button>
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

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} title="How Tarot Works / 塔羅牌原理">
        <h3>Overview</h3>
        <p>
          Tarot is a symbolic system of 78 cards used for reflection, guidance, and self-exploration.
          Originating in 15th-century Europe as playing cards, the deck was later adopted by esoteric
          traditions as a tool for divination. Each card carries layered symbolism drawn from mythology,
          astrology, numerology, and Kabbalah.
        </p>

        <h3>The 78-Card Deck</h3>
        <p>
          The deck is divided into two sections:
        </p>
        <table>
          <thead>
            <tr><th>Section</th><th>Cards</th><th>Themes</th></tr>
          </thead>
          <tbody>
            <tr><td>Major Arcana</td><td>22 (0–XXI)</td><td>Archetypal life themes, soul lessons, major forces</td></tr>
            <tr><td>Minor Arcana</td><td>56 (4 suits × 14)</td><td>Day-to-day events, practical situations, people</td></tr>
          </tbody>
        </table>
        <p>
          The <strong>Major Arcana</strong> (The Fool through The World) represent the major chapters of a
          life journey. When they appear, the energy they carry tends to be significant or transformative.
        </p>
        <p>
          The <strong>Minor Arcana</strong> is divided into four suits, each associated with an element and
          life domain:
        </p>
        <table>
          <thead>
            <tr><th>Suit</th><th>Element</th><th>Domain</th></tr>
          </thead>
          <tbody>
            <tr><td>Wands</td><td>Fire</td><td>Passion, creativity, ambition, career</td></tr>
            <tr><td>Cups</td><td>Water</td><td>Emotions, relationships, intuition, dreams</td></tr>
            <tr><td>Swords</td><td>Air</td><td>Thought, conflict, truth, communication</td></tr>
            <tr><td>Pentacles</td><td>Earth</td><td>Material world, finances, body, practicality</td></tr>
          </tbody>
        </table>
        <p>
          Each suit runs from Ace (1) through 10, followed by four court cards: Page, Knight, Queen, King.
          Court cards often represent either a person in the seeker&apos;s life or an aspect of their own personality.
        </p>

        <h3>Upright vs. Reversed</h3>
        <p>
          A card drawn <strong>upright</strong> expresses its energy directly and actively.
          A card drawn <strong>reversed</strong> (inverted) can indicate the energy is blocked, delayed,
          internalised, or expressing in a more challenging form. Reversed cards are not simply
          &quot;negative&quot; — they invite deeper examination of where that energy may be stuck or turned inward.
        </p>

        <h3>Spreads</h3>
        <p>
          A spread is a layout that assigns each card position a specific meaning before the cards are drawn:
        </p>
        <table>
          <thead>
            <tr><th>Spread</th><th>Cards</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td>Three Card</td><td>3</td><td>Past / Present / Future — versatile general reading</td></tr>
            <tr><td>Daily Card</td><td>1</td><td>Single guidance card for the day</td></tr>
            <tr><td>Relationship</td><td>3</td><td>You / Them / Dynamic between you</td></tr>
            <tr><td>Horseshoe</td><td>7</td><td>Situation, influences, obstacles, path, outcome</td></tr>
            <tr><td>Career</td><td>5</td><td>Current state, strengths, challenges, advice, outcome</td></tr>
            <tr><td>Celtic Cross</td><td>10</td><td>Comprehensive deep reading — present, cross, foundation, past, crown, future, self, environment, hopes/fears, outcome</td></tr>
          </tbody>
        </table>

        <div className="note-box">
          <strong>Note:</strong> Cards are shuffled and drawn using a seeded random selection from the full
          78-card deck. Each reading is independent. Tarot is a tool for reflection — the meaning you draw
          from a card is often the most relevant interpretation.
        </div>
      </MethodologyModal>
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
