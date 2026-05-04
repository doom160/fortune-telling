## Implementation Phases (phased to avoid timeouts)

---

## Phase A — Types + Runes 1–13

- [x] 1.1 Create `src/lib/rune.ts` and define exported types: `RunePolarity`, `RuneDomain`, `Rune`, `DrawnRune`, `RuneReading`
- [x] 1.2a Add runes 1–13 to `RUNES` constant (Fehu through Jera)

## Phase B — Runes 14–25

- [x] 1.2b Add runes 14–25 to `RUNES` constant (Eihwaz through blank Wyrd) and close array

## Phase C — Draw Logic + Domain Map

- [x] 2.1 Implement `drawRunes(): DrawnRune[]` — Fisher-Yates shuffle, pick 3, assign positions past/present/future
- [x] 2.2 Implement `buildRuneInterpretation(reading: Omit<RuneReading, "interpretation">): string[]`
- [x] 2.3 Implement `performRuneReading(question?: string): RuneReading`
- [x] 2.4 Verify no duplicate runes can appear in a single draw

## Phase D — Signal Extractor + Synthesis Extension

- [x] 3.1 Implement `extractRuneSignals(reading: RuneReading): NormalisedSignal[]` in `src/lib/synthesis.ts` — majority-vote polarity from 3 runes, domain + keyword from present-position rune
- [x] 3.2 Extend `LifeDirectionsSystemId` to include `"rune"` in `src/lib/synthesis.ts`

## Phase E — Standalone Page

- [x] 4.1 Create `src/app/rune/layout.tsx` with metadata (title "Norse Runes — Elder Futhark Oracle")
- [x] 4.2 Create `src/app/rune/page.tsx` with question form and result section shell
- [x] 4.3 Implement `RuneCard` component inside page.tsx — renders rune name, letter, and meaning
- [x] 4.4 Implement `ThreeRuneDraw` component — three cards in Past / Present / Future layout
- [x] 4.5 Render interpretation text below the draw

## Phase F — Oracle Integration

- [x] 5.1 Import `performRuneReading` and `RuneReading` into `LifeDirectionsClient.tsx`
- [x] 5.2 Add `rune: SystemResult<RuneReading>` to `State` type and `INITIAL` constant
- [x] 5.3 Add Norse Rune try/catch block in `handleSubmit` calling `performRuneReading(q)`
- [x] 5.4 Add `extractRuneSignals` call in signal extraction block; update `synthesiseGroup` group size 4 → 5
- [x] 5.5 Add `RuneOracleCard` sub-component in `LifeDirectionsClient.tsx` showing three rune names (Past/Present/Future) and present-position meaning
- [x] 5.6 Render `<RuneOracleCard result={state.rune} />` in `oracle-systems-grid`
- [x] 5.7 Update hasResults check to include `state.rune.status !== "idle"`

## Phase G — Navigation, Homepage, Sitemap + CSS

- [x] 6.1 Add Norse Rune to `NAV_ITEMS` in `Navigation.tsx` (label: "ᚱ Norse Runes")
- [x] 6.2 Add Norse Rune to `SYSTEMS` in `src/app/page.tsx` (id: "rune", href: "/rune", en: "Norse Runes", sub: "Elder Futhark Oracle", tags: ["Norse"])
- [x] 6.3 Add `/rune` to `src/app/sitemap.ts`
- [x] 7.1 Add `.rune-draw` grid layout styles in `globals.css` (three-column card row)
- [x] 7.2 Add `.rune-card`, `.rune-card__position`, `.rune-card__letter`, `.rune-card__name`, `.rune-card__meaning` styles
- [x] 7.3 Add `.rune-oracle-card` styles for the Life Directions card compact view
- [x] 7.4 Verify `.oracle-systems-grid--directions` handles five cards gracefully (auto-fit minmax already set)

## Phase H — OpenAPI Spec

- [x] 8.1 Add `RuneEntry`, `DrawnRune`, `RuneInput`, `RuneResult` schemas to `divine-secrets-api/spec.md`
- [x] 8.2 Add `POST /readings/rune` path entry to `divine-secrets-api/spec.md`
