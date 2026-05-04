## Context

The Divine Secrets platform currently has two East-Asian question oracles (Guan Yin, QMDJ) and two Western ones (Tarot, I Ching) wired into the Life Directions Oracle at `/oracle/life-directions`. Norse Runes represent a third Western tradition — the Elder Futhark — that is semantically distinct from Tarot and I Ching. Each rune carries a name, a phonetic value (futhark letter), elemental/cosmological associations, and a divinatory polarity, making it straightforward to extract typed signals for synthesis without free-text tokenisation.

The implementation pattern is already established by `src/lib/iching.ts` and its oracle integration in `LifeDirectionsClient.tsx`. This change follows the same pattern: new lib file → signal extractor in synthesis.ts → standalone page → oracle card wired into LifeDirectionsClient.

## Goals / Non-Goals

**Goals:**
- Implement all 24 Elder Futhark runes (+ optional blank Wyrd rune) as typed data in `src/lib/rune.ts`
- Three-rune draw logic (position: past / present / future) with optional rune reversal
- `extractRuneSignals` producing `NormalisedSignal[]` from typed fields only
- Standalone `/rune` page with question input and drawn rune card display
- Fifth system wired into Life Directions Oracle; synthesis group size 4 → 5
- Navigation, homepage, sitemap additions
- OpenAPI spec additions

**Non-Goals:**
- Single-rune or five-rune draws (three is standard for question-based readings)
- Runic numerology or bind-runes
- Integration into the Life Forecast Oracle (birthday-based reading; runes are question-based)
- Full runic poem texts (Poetic Edda, Icelandic, Norwegian) — divinatory meaning + keywords are sufficient

## Decisions

### D1: Elder Futhark with optional blank Wyrd rune — include blank, draw from 25

The 25-rune deck (24 Elder Futhark + blank "Wyrd") is the modern popularised set. The blank rune maps to the unknown / fate signal and has `polarity: "neutral"` with no specific domain. Including it matches user expectations for rune readings; excluding it would confuse users who know the system.

**Alternative considered**: 24-rune only (purist approach). Rejected because the blank rune is a common signal for "outcome unclear / fate at play," which maps well to a `mixed` synthesis polarity.

### D2: Three positions — past / present / future, no reversal in base implementation

Reversed runes invert polarity and require doubling the data definitions (or a boolean inversion flag). The synthesis signal extraction uses `rune.polarity` as the source of truth. To keep the spec minimal and the data model simple, reversal is excluded from v1. Each rune already has `polarity: "auspicious" | "challenging" | "neutral"` — the three-draw signal extraction averages these.

**Alternative considered**: Reversed runes via `isReversed: boolean` on the drawn entry. This adds complexity without meaningfully improving oracle synthesis. Deferred to future change.

### D3: Signal extraction anchored on primary (present) rune for polarity, all three for domain/keyword

For synthesis, the "present" (center) rune position is the primary signal — it most directly answers the question. Polarity is derived from majority vote across all three drawn runes. Domain comes from the primary rune's domain tag. Keyword comes from the primary rune's nameEn in kebab-case.

This mirrors how `extractIChingSignals` uses the primary hexagram's domain and changing-line natures for polarity.

### D4: `RUNE_DOMAIN_MAP` inlined in rune.ts using `QmdjFocus` type (reuse existing type)

The same `QmdjFocus = "career" | "finance" | "love" | "health" | "general"` type covers the five domains used across all signal extractors. Reusing it keeps the synthesis engine consistent and requires no new types.

### D5: Standalone page at `/rune` with three card layout (past / present / future)

Matches the `/iching` page pattern: question input → submit → results. The three drawn runes render as cards in a horizontal row labelled Past / Present / Future. A brief interpretation section follows. No synthesis on the standalone page (synthesis is oracle-only).

## Risks / Trade-offs

**[Risk] Rune data quality** — Elder Futhark divinatory meanings vary significantly across traditions (Blum's 1982 popularisation vs. reconstructed historical meanings). The data will use broadly accepted modern divinatory interpretations, not claim historical authenticity. Mitigation: clear "divination" framing in UI copy; no academic/historical claims.

**[Risk] Group size increase 4→5 changes existing confidence scores** — A signal that previously scored `confidenceScore: 0.75` (3/4) will now score `0.60` (3/5). The synthesis threshold remains `>= 0.67`, so some previously-surface themes may drop out. Mitigation: this is the correct behaviour (harder to achieve consensus in a larger group); document in unified-reading delta spec.

**[Risk] CSS scope creep** — `.rune-*` classes must not conflict with existing card styles. Mitigation: all new classes use the `rune-` prefix; the three-card grid uses a dedicated `.rune-draw` wrapper class.

## Migration Plan

1. Implement `src/lib/rune.ts` (data + logic) — no impact on existing pages
2. Extend `synthesis.ts` — additive change only; existing extractors unchanged
3. Create `/rune` standalone page — new route, no existing route affected
4. Wire into `LifeDirectionsClient.tsx` — existing oracle continues to work during partial wiring; add rune as last card
5. Navigation/homepage/sitemap — additive changes only
6. CSS additions only — no existing class modifications

No rollback complexity; all changes are additive except the group size change in LifeDirectionsClient (4 → 5), which can be reverted by removing the rune import and reverting the integer literal.

## Open Questions

- None blocking implementation. Rune interpretation data (meanings, keywords, polarity, domain) will be authored during Phase A based on standard modern divinatory Elder Futhark sources.
