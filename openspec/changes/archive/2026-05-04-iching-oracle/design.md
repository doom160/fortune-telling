## Context

The platform already has Guan Yin lots, Qi Men Dun Jia, and Tarot as question-based divination systems, all running inside the Life Directions Oracle. I Ching (易經) is the foundational Chinese divination classic — 64 hexagrams built from 6 binary lines (yao), cast via simulated coin toss. It integrates naturally alongside the existing three systems and extends the oracle synthesis group from 3 to 4 systems, raising maximum confidence scores.

The existing pattern for a divination lib is: data constants → casting function → reading builder → signal extractor. This is established in `guanyin.ts`, `qmdj.ts`, and `tarot.ts`. I Ching follows the same pattern.

## Goals / Non-Goals

**Goals:**
- Standalone `/iching` page: question input → hexagram casting → primary + resulting hexagram display → changing lines → full interpretation
- `src/lib/iching.ts` library that is pure (no side effects, no external deps beyond `Math.random()`)
- Signal extractor (`extractIChingSignals`) compatible with the existing `NormalisedSignal` type in `synthesis.ts`
- I Ching added as the fourth system in `/oracle/life-directions`; group size updated to 4

**Non-Goals:**
- Yarrow stalk method (coin toss only — covers the dominant modern practice)
- I Ching contribution to Life Forecast Oracle (hexagrams are moment-in-time readings, not natal/birth-based)
- Storing past readings or reading history
- Custom question routing (I Ching is purely random, question string is display-only)

## Decisions

### D1 — Hexagram data structure

**Decision:** Embed all 64 hexagrams as a typed constant array in `iching.ts`.

Each hexagram entry includes: `number` (1–64, King Wen order), `nameZh`, `namePinyin`, `nameEn`, `lines` (6-element array of `0 | 1`, bottom-to-top), `judgment` (彖辭 — classical verse + English), `image` (象辭 — image verse + English), `lines_text` (array of 6 objects: `{ zh, en, nature: "auspicious" | "inauspicious" | "neutral" }`).

**Alternative considered:** External JSON file. Rejected — inline TypeScript constants give full type safety and zero runtime I/O.

### D2 — Coin toss simulation

**Decision:** Simulate 3 coins × 6 throws. Each throw: sum of 3 coin values (heads=3, tails=2) → total 6, 7, 8, or 9. 6 = old yin (changing), 7 = young yang (stable), 8 = young yin (stable), 9 = old yang (changing).

This matches the traditional probability distribution: P(6)=1/8, P(7)=3/8, P(8)=3/8, P(9)=1/8.

**Alternative considered:** Simple `Math.random() < 0.5` per line. Rejected — doesn't produce changing lines at the correct 1-in-4 probability.

### D3 — Resulting hexagram

**Decision:** When changing lines exist, compute a second "resulting hexagram" by flipping all changing lines (yin↔yang). Display it alongside the primary hexagram with reduced visual weight — it represents the future state or direction of change.

If no changing lines, no resulting hexagram is shown; the primary hexagram stands as a stable reading.

### D4 — Oracle integration: 4th system, not replacement

**Decision:** Add I Ching as the fourth system in Life Directions Oracle. Update `LifeDirectionsSystemId` to `"guanyin" | "qmdj" | "tarot" | "iching"`. Update synthesis `groupSize` from 3 to 4.

**Effect on confidence scores:** The threshold for "two systems agree" drops from 0.67 → 0.50. The existing `>= 0.67` summary threshold in `composeSummary` means three-of-four agreement (0.75) is now the minimum for summary inclusion. This is a tightening of the synthesis bar, which is desirable — a summary should only fire when there is strong cross-system agreement.

**Alternative considered:** Keep group size 3, treat I Ching as optional. Rejected — inconsistency would complicate the synthesis math and undermine I Ching's equal standing.

### D5 — Signal extraction

**Decision:** `extractIChingSignals` derives three signal types:
- **Polarity**: from hexagram's dominant line nature (>50% old/new polarity of changing lines, or overall hexagram `judgment` mapped to auspicious/mixed/caution buckets)
- **Domain**: primary hexagram number maps to one of 5 domain buckets (career, finance, love, health, general) via a lookup table
- **Keyword**: top 2 keywords from `nameEn` and changing line `nature` values

This keeps extraction deterministic and typed — no free-text parsing.

## Risks / Trade-offs

- [Hexagram data volume ~600 lines] → Mitigation: embedded in lib file, loaded once, tree-shaken if unused
- [groupSize 3→4 changes confidence thresholds] → Mitigation: documented in D4; summary threshold remains `>= 0.67` so only strong agreement surfaces
- [I Ching interpretation text is dense] → Mitigation: standalone page uses collapsible sections for line texts; oracle card shows judgment only

## Migration Plan

No breaking changes. Existing `/oracle/life-directions` behavior is additive — a fourth card appears alongside the existing three. The synthesis output gains a fourth system ID in `themes[n].systems` arrays but the shape of `GroupSynthesisResult` is unchanged.
