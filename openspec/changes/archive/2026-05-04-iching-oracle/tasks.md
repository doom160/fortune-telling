## Implementation Phases (phased to avoid timeouts)

---

## Phase A — Types + Hexagrams 1–16

- [x] 1.1 Create `src/lib/iching.ts` and define exported types: `IChingLine`, `IChingLineText`, `IChingHexagram`
- [x] 1.2 Define `IChingReading` type
- [x] 1.3a Add hexagrams 1–16 to `HEXAGRAMS` constant

## Phase B — Hexagrams 17–32

- [x] 1.3b Add hexagrams 17–32 to `HEXAGRAMS` constant

## Phase C — Hexagrams 33–48

- [x] 1.3c Add hexagrams 33–48 to `HEXAGRAMS` constant

## Phase D — Hexagrams 49–64

- [x] 1.3d Add hexagrams 49–64 to `HEXAGRAMS` constant (closes array)

## Phase E — Casting Logic + Domain Map

- [x] 2.1 Implement `castLine(): IChingLine`
- [x] 2.2 Implement `getHexagramByLines(lines: (0|1)[]): IChingHexagram`
- [x] 2.3 Implement `buildInterpretation(...): string[]`
- [x] 2.4 Implement `performIChingReading(question?: string): IChingReading`
- [x] 3.1 Add `HEXAGRAM_DOMAIN_MAP: Record<number, QmdjFocus>` in `src/lib/iching.ts`

## Phase F — Signal Extractor + Synthesis

- [x] 3.2 Implement `extractIChingSignals(reading: IChingReading): NormalisedSignal[]` in `src/lib/synthesis.ts`
- [x] 3.3 Extend `LifeDirectionsSystemId` to `"guanyin" | "qmdj" | "tarot" | "iching"`

## Phase G — Standalone Page Shell

- [x] 4.1 Create `src/app/iching/layout.tsx` with metadata
- [x] 4.2 Create `src/app/iching/page.tsx` with question form and result section shell

## Phase H — Hexagram Display Components

- [x] 4.3 Implement hexagram line display component (yang/yin/changing markers)
- [x] 4.4 Render primary hexagram name, judgment, image text
- [x] 4.5 Render changing lines section
- [x] 4.6 Render resulting hexagram section (conditional)

## Phase I — Oracle Integration

- [x] 5.1 Import `performIChingReading` and `IChingReading` into `LifeDirectionsClient.tsx`
- [x] 5.2 Add `iching: SystemResult<IChingReading>` to `State` and `INITIAL`
- [x] 5.3 Add I Ching try/catch block in `handleSubmit`
- [x] 5.4 Add `extractIChingSignals` call; update `synthesiseGroup` to group size 4
- [x] 5.5 Add `IChingCard` sub-component
- [x] 5.6 Render `<IChingCard>` in `oracle-systems-grid`

## Phase J — Navigation, Homepage, Sitemap + CSS

- [x] 6.1 Add I Ching to `NAV_ITEMS` in `Navigation.tsx`
- [x] 6.2 Add I Ching to `SYSTEMS` in `src/app/page.tsx`
- [x] 6.3 Add `/iching` to `src/app/sitemap.ts`
- [x] 7.1 Add `.iching-hexagram` layout styles in `globals.css`
- [x] 7.2 Add `.iching-line` styles (yang/yin/changing)
- [x] 7.3 Add `.iching-result`, `.iching-name`, `.iching-judgment`, `.iching-changing-lines`, `.iching-resulting` styles
- [x] 7.4 Update `.oracle-systems-grid` to `repeat(auto-fit, minmax(260px, 1fr))` for 4-card layout

## Phase K — OpenAPI Spec

- [x] 8.1 Add `IChingInput`, `IChingHexagram`, `IChingResult` schemas to `divine-secrets-api/spec.md`
- [x] 8.2 Add `POST /readings/iching` path entry
