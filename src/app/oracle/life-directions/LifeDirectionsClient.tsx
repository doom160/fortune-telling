"use client";

import { useState } from "react";
import { Stars } from "@/components/Stars";
import { PerSystemCard } from "@/components/oracle/PerSystemCard";
import { ThemeOverlapPanel } from "@/components/oracle/ThemeOverlapPanel";
import { SynthesisedSummary } from "@/components/oracle/SynthesisedSummary";
import { buildGuanyinReading, type GuanyinReading } from "@/lib/guanyin";
import { calculateTimeQmdj, type QmdjChart, type QmdjFocus } from "@/lib/qmdj";
import { performTarotReading, type TarotReading } from "@/lib/tarot";
import { performIChingReading, type IChingReading } from "@/lib/iching";
import { performRuneReading, type RuneReading } from "@/lib/rune";
import {
  extractGuanyinSignals,
  extractQmdjSignals,
  extractTarotSignals,
  extractIChingSignals,
  extractRuneSignals,
  synthesiseGroup,
  type GroupSynthesisResult,
} from "@/lib/synthesis";

type SystemResult<T> = { status: "idle" } | { status: "ok"; data: T } | { status: "error"; message: string };

type State = {
  guanyin: SystemResult<GuanyinReading>;
  qmdj: SystemResult<QmdjChart>;
  tarot: SystemResult<TarotReading>;
  iching: SystemResult<IChingReading>;
  rune: SystemResult<RuneReading>;
  synthesis: GroupSynthesisResult | null;
  isRunning: boolean;
};

const INITIAL: State = {
  guanyin: { status: "idle" },
  qmdj: { status: "idle" },
  tarot: { status: "idle" },
  iching: { status: "idle" },
  rune: { status: "idle" },
  synthesis: null,
  isRunning: false,
};

const FOCUS_OPTIONS: { label: string; value: QmdjFocus }[] = [
  { label: "General / 綜合", value: "general" },
  { label: "Career / 事業", value: "career" },
  { label: "Finance / 財運", value: "finance" },
  { label: "Love & Relationship / 感情", value: "love" },
  { label: "Health / 健康", value: "health" },
];

export function LifeDirectionsClient() {
  const [question, setQuestion] = useState("");
  const [focus, setFocus] = useState<QmdjFocus>("general");
  const [state, setState] = useState<State>(INITIAL);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;

    setState({ ...INITIAL, isRunning: true });

    // Each system runs synchronously but isolated — errors in one do not block others
    let guanyinResult: SystemResult<GuanyinReading>;
    let qmdjResult: SystemResult<QmdjChart>;
    let tarotResult: SystemResult<TarotReading>;
    let ichingResult: SystemResult<IChingReading>;
    let runeResult: SystemResult<RuneReading>;

    try {
      const reading = buildGuanyinReading({ question: q });
      guanyinResult = { status: "ok", data: reading };
    } catch (err) {
      guanyinResult = { status: "error", message: err instanceof Error ? err.message : "Guan Yin reading failed." };
    }

    try {
      const now = new Date();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const chart = calculateTimeQmdj({ mode: "time", focus, question: q, dateTime, timeZone: tz });
      qmdjResult = { status: "ok", data: chart };
    } catch (err) {
      qmdjResult = { status: "error", message: err instanceof Error ? err.message : "Qi Men reading failed." };
    }

    try {
      const reading = performTarotReading("ThreeCard");
      tarotResult = { status: "ok", data: reading };
    } catch (err) {
      tarotResult = { status: "error", message: err instanceof Error ? err.message : "Tarot reading failed." };
    }

    try {
      const reading = performIChingReading(q);
      ichingResult = { status: "ok", data: reading };
    } catch (err) {
      ichingResult = { status: "error", message: err instanceof Error ? err.message : "I Ching reading failed." };
    }

    try {
      const reading = performRuneReading(q);
      runeResult = { status: "ok", data: reading };
    } catch (err) {
      runeResult = { status: "error", message: err instanceof Error ? err.message : "Norse Rune reading failed." };
    }

    // Build synthesis from whichever systems succeeded
    const systemSignals: Record<string, ReturnType<typeof extractGuanyinSignals>> = {};
    if (guanyinResult.status === "ok") {
      systemSignals.guanyin = extractGuanyinSignals(guanyinResult.data.lot);
    }
    if (qmdjResult.status === "ok") {
      systemSignals.qmdj = extractQmdjSignals(qmdjResult.data, focus);
    }
    if (tarotResult.status === "ok") {
      systemSignals.tarot = extractTarotSignals(tarotResult.data);
    }
    if (ichingResult.status === "ok") {
      systemSignals.iching = extractIChingSignals(ichingResult.data);
    }
    if (runeResult.status === "ok") {
      systemSignals.rune = extractRuneSignals(runeResult.data);
    }

    const succeededCount = Object.keys(systemSignals).length;
    const synthesis =
      succeededCount >= 2
        ? synthesiseGroup(systemSignals, 5)
        : null;

    setState({
      guanyin: guanyinResult,
      qmdj: qmdjResult,
      tarot: tarotResult,
      iching: ichingResult,
      rune: runeResult,
      synthesis,
      isRunning: false,
    });
  }

  const hasResults =
    state.guanyin.status !== "idle" ||
    state.qmdj.status !== "idle" ||
    state.tarot.status !== "idle" ||
    state.iching.status !== "idle" ||
    state.rune.status !== "idle";

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <Stars />
        <div className="hero-zh">問卦指引</div>
        <div className="divider" />
        <div className="hero-en">Life Directions Oracle</div>
        <p>
          Ask your question. Guan Yin, Qi Men Dun Jia, and Tarot respond — then their overlapping
          signals are synthesised into a single directed reading.
        </p>
      </section>

      <section className="workspace-grid">
        <form onSubmit={handleSubmit} className="oracle-question-form">
          <label htmlFor="oracle-question" className="oracle-question-form__label">
            Your question
          </label>
          <textarea
            id="oracle-question"
            className="oracle-question-form__textarea"
            placeholder="e.g., Should I change careers this year?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            disabled={state.isRunning}
          />
          <label htmlFor="oracle-focus" className="oracle-question-form__label">
            Focus Area
          </label>
          <select
            id="oracle-focus"
            className="oracle-question-form__select"
            value={focus}
            onChange={(e) => setFocus(e.target.value as QmdjFocus)}
            disabled={state.isRunning}
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="oracle-question-form__submit btn-primary"
            disabled={!question.trim() || state.isRunning}
          >
            {state.isRunning ? "Reading…" : "Consult the Oracle"}
          </button>
        </form>
      </section>

      {hasResults && (
        <>
          <section className="oracle-systems-grid oracle-systems-grid--directions">
            <GuanyinCard result={state.guanyin} />
            <QmdjCard result={state.qmdj} />
            <TarotCard result={state.tarot} />
            <IChingCard result={state.iching} />
            <RuneOracleCard result={state.rune} />
          </section>

          {state.synthesis && (
            <section className="oracle-synthesis-section">
              <ThemeOverlapPanel themes={state.synthesis.themes} />
              <SynthesisedSummary summary={state.synthesis.summary} />
            </section>
          )}
        </>
      )}
    </main>
  );
}

// ─── Per-system card sub-components ─────────────────────────────────────────

function GuanyinCard({ result }: { result: SystemResult<GuanyinReading> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="guanyin" nameZh="觀音靈籤" nameEn="Guan Yin Lots" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  const { lot } = result.data;
  return (
    <PerSystemCard systemId="guanyin" nameZh="觀音靈籤" nameEn="Guan Yin Lots" tradition="Chinese">
      <div className="guanyin-lot">
        <div className="guanyin-lot__header">
          <span className="guanyin-lot__number">Lot #{lot.number}</span>
          <span className={`guanyin-lot__outcome guanyin-lot__outcome--${lot.outcome.toLowerCase()}`}>
            {lot.outcome}
          </span>
        </div>
        <h4 className="guanyin-lot__title">{lot.title}</h4>
        <p className="guanyin-lot__poem">{lot.poem}</p>
        <p className="guanyin-lot__summary">{lot.summary}</p>
        <dl className="guanyin-lot__domains">
          <dt>Career</dt><dd>{lot.career}</dd>
          <dt>Finance</dt><dd>{lot.finance}</dd>
          <dt>Love</dt><dd>{lot.love}</dd>
          <dt>Health</dt><dd>{lot.health}</dd>
        </dl>
        <p className="guanyin-lot__guidance">{lot.guidance}</p>
      </div>
    </PerSystemCard>
  );
}

function QmdjCard({ result }: { result: SystemResult<QmdjChart> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="qmdj" nameZh="奇門遁甲" nameEn="Qi Men Dun Jia" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  const chart = result.data;
  return (
    <PerSystemCard systemId="qmdj" nameZh="奇門遁甲" nameEn="Qi Men Dun Jia" tradition="Chinese">
      <div className="qmdj-chart">
        <div className="qmdj-chart__meta">
          <span>Ju {chart.juNumber} · {chart.isYangDun ? "Yang" : "Yin"} Dun</span>
          <span>{chart.yuan.charAt(0).toUpperCase() + chart.yuan.slice(1)} Yuan</span>
          <span>{chart.solarTerm.nameZh} {chart.solarTerm.name}</span>
        </div>
        {chart.formations.length > 0 && (
          <div className="qmdj-chart__formations">
            <h4>Formations</h4>
            {chart.formations.map((f, i) => (
              <div key={i} className={`qmdj-formation qmdj-formation--${f.type}`}>
                <span className="qmdj-formation__name">{f.nameZh} {f.name}</span>
                <span className="qmdj-formation__type">{f.type}</span>
                <p className="qmdj-formation__desc">{f.description}</p>
              </div>
            ))}
          </div>
        )}
        {chart.interpretation.length > 0 && (
          <div className="qmdj-chart__interpretation">
            {chart.interpretation.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </PerSystemCard>
  );
}

function TarotCard({ result }: { result: SystemResult<TarotReading> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="tarot" nameZh="塔羅牌" nameEn="Tarot" tradition="Western" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  const reading = result.data;
  return (
    <PerSystemCard systemId="tarot" nameZh="塔羅牌" nameEn="Tarot" tradition="Western">
      <div className="tarot-reading">
        <div className="tarot-reading__cards">
          {reading.cards.map((instance, i) => (
            <div key={i} className={`tarot-card-instance tarot-card-instance--${instance.orientation.toLowerCase()}`}>
              <span className="tarot-card-instance__position">{instance.position}</span>
              <span className="tarot-card-instance__name">{instance.card.name}</span>
              <span className="tarot-card-instance__orientation">{instance.orientation}</span>
              <span className="tarot-card-instance__keywords">
                {(instance.orientation === "Upright"
                  ? instance.card.upright.keywords
                  : instance.card.reversed.keywords
                ).join(", ")}
              </span>
            </div>
          ))}
        </div>
        {reading.interpretation.length > 0 && (
          <div className="tarot-reading__interpretation">
            {reading.interpretation.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </PerSystemCard>
  );
}

function IChingCard({ result }: { result: SystemResult<IChingReading> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="iching" nameZh="易經" nameEn="I Ching" tradition="Chinese" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  const { primaryHexagram, changingLines, resultingHexagram } = result.data;
  return (
    <PerSystemCard systemId="iching" nameZh="易經" nameEn="I Ching" tradition="Chinese">
      <div className="iching-oracle-card">
        <div className="iching-oracle-card__hexagram">
          <span className="iching-oracle-card__zh">{primaryHexagram.nameZh}</span>
          <span className="iching-oracle-card__pinyin">{primaryHexagram.namePinyin}</span>
          <span className="iching-oracle-card__en">{primaryHexagram.nameEn}</span>
        </div>
        <p className="iching-oracle-card__judgment">{primaryHexagram.judgment.en}</p>
        {changingLines.length > 0 && (
          <p className="iching-oracle-card__changing">
            {changingLines.length} changing line{changingLines.length > 1 ? "s" : ""}
            {resultingHexagram ? ` → ${resultingHexagram.nameZh} ${resultingHexagram.nameEn}` : ""}
          </p>
        )}
      </div>
    </PerSystemCard>
  );
}

function RuneOracleCard({ result }: { result: SystemResult<RuneReading> }) {
  if (result.status === "idle") return null;
  if (result.status === "error") {
    return (
      <PerSystemCard systemId="rune" nameZh="ᚠᚢᚦ" nameEn="Norse Runes" tradition="Norse" notice={result.message}>
        <p className="system-error">{result.message}</p>
      </PerSystemCard>
    );
  }
  const { drawnRunes } = result.data;
  const present = drawnRunes.find((d) => d.position === "present");
  return (
    <PerSystemCard systemId="rune" nameZh="ᚠᚢᚦ" nameEn="Norse Runes" tradition="Norse">
      <div className="rune-oracle-card">
        {drawnRunes.map((drawn) => (
          <div key={drawn.position} className={`rune-oracle-card__row rune-oracle-card__row--${drawn.position}`}>
            <span className="rune-oracle-card__pos">{drawn.position.charAt(0).toUpperCase() + drawn.position.slice(1)}</span>
            <span className="rune-oracle-card__symbol">{drawn.rune.symbol || "⬜"}</span>
            <span className="rune-oracle-card__name">{drawn.rune.name}</span>
            <span className="rune-oracle-card__nameen">{drawn.rune.nameEn}</span>
          </div>
        ))}
        {present && (
          <p className="rune-oracle-card__present-meaning">{present.rune.meaning}</p>
        )}
      </div>
    </PerSystemCard>
  );
}
