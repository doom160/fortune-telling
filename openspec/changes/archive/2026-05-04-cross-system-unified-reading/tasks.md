## 1. Types & Shared Contracts

- [x] 1.1 Create `src/lib/synthesis.ts` with TypeScript types: `NormalisedSignal`, `SignalClass` (`"polarity"` | `"domain"` | `"keyword"`), `Theme`, `GroupSynthesisResult`, `YearSynthesis`, `LuckTimeline`
- [x] 1.2 Define `LifeDirectionsSystemId` (`"guanyin"` | `"qmdj"` | `"tarot"`) and `LifeForecastSystemId` (`"bazi"` | `"numerology"` | `"ziwei"` | `"zodiac"` | `"astrology"`) const union types
- [x] 1.3 Define `LUCK_TIMELINE_OFFSETS` constant: `[-3, -2, -1, 0, 1, 2, 3, 5, 10]` and a `getLuckTimelineYears(currentYear: number): number[]` helper

## 2. Year-Parameterized Helpers

- [x] 2.1 Add `calculatePersonalYearForYear(birthDate: string, year: number): number` to `src/lib/synthesis.ts` — copy the `sum_digits(month) + sum_digits(day) + sum_digits(year)` formula from `src/lib/numerology.ts`, parameterized on `year`
- [x] 2.2 Add `getYearAnimal(year: number): ZodiacAnimal` helper — apply Lichun boundary logic (consistent with `getAnimalFromDate`) to determine the Earthly Branch animal for any calendar year
- [x] 2.3 Add `getYearRelationshipPolarity(birthAnimalIndex: number, yearAnimalIndex: number): "auspicious" | "mixed" | "caution"` — map relationship types: six-harmony/three-harmony → auspicious, clash/harm/punishment → caution, none/destruction → mixed
- [x] 2.4 Add `getBaziAnnualEntry(chart: BaziChart, year: number): AnnualLuckPillar | null` — filter `chart.annualLuckPillars` by `entry.year`
- [x] 2.5 Add `calculateTransitsForDate(natalChart: NatalChart, date: Date): TransitAspect[]` as a new exported function in `src/lib/astrology.ts` — wraps the existing internal `calculatePlanetPositions` and `findTransitAspects` functions with a date parameter instead of hardcoded `new Date()`

## 3. Signal Extraction Adapters

- [x] 3.1 Implement `extractGuanyinSignals(result: GuanyinLot): NormalisedSignal[]` — map `outcome` → polarity, domain fields (`career`, `finance`, `love`, `health`) → domain tags, top keywords from `guidance` field
- [x] 3.2 Implement `extractQmdjSignals(result: QmdjResult): NormalisedSignal[]` — aggregate formation `nature` values → polarity, `focus` → domain tag, formation names → keyword tags
- [x] 3.3 Implement `extractTarotSignals(result: TarotReading): NormalisedSignal[]` — compute reversed-card ratio → polarity, map card positions to domain tags, collect `keywords[]` from each card's active orientation
- [x] 3.4 Implement `extractBaziLifeSignals(result: BaziChart): NormalisedSignal[]` — dominant element → keyword, element balance → polarity, pillar domain affinities → domain tags
- [x] 3.5 Implement `extractBaziYearSignals(entry: AnnualLuckPillar): NormalisedSignal[]` — pillar stem element → keyword, stem/branch element interaction → polarity
- [x] 3.6 Implement `extractNumerologyLifeSignals(result: NumerologyChart): NormalisedSignal[]` — `dominantElement` → keyword, life-path number domain → domain tag, `lifePathNumber` parity → polarity hint
- [x] 3.7 Implement `extractNumerologyYearSignals(personalYearNumber: number): NormalisedSignal[]` — map personal year number to polarity (1,3,5,8 → auspicious; 4,7 → neutral; 2,6,9 → mixed) and domain tag (per `PERSONAL_YEAR_INTERP` theme)
- [x] 3.8 Implement `extractZiweiSignals(result: ZiWeiChart): NormalisedSignal[]` — aggregate main palace star natures → polarity, star domain associations → domain tags, star keywords → keyword tags
- [x] 3.9 Implement `extractZodiacLifeSignals(result: ZodiacReading): NormalisedSignal[]` — animal element → keyword, animal traits keywords, compatible/incompatible signals → domain tags
- [x] 3.10 Implement `extractZodiacYearSignals(birthAnimalIndex: number, yearAnimalIndex: number): NormalisedSignal[]` — call `getYearRelationshipPolarity` → polarity signal, year relationship type → keyword tag
- [x] 3.11 Implement `extractAstrologyLifeSignals(result: NatalChart): NormalisedSignal[]` — sun/moon/rising signs → keyword tags (element of each sign), dominant aspect nature → polarity
- [x] 3.12 Implement `extractAstrologyYearSignals(transits: TransitAspect[]): NormalisedSignal[]` — filter Jupiter and Saturn aspects; map `trine`/`sextile` → auspicious, `conjunction` (Jupiter) → mixed, `square`/`opposition` → caution

## 4. Synthesis Engine

- [x] 4.1 Implement `synthesiseGroup(systemSignals: Record<string, NormalisedSignal[]>, groupSize: number): GroupSynthesisResult` — count tag occurrences, compute `confidenceScore`, sort themes descending
- [x] 4.2 Implement `composeSummary(themes: Theme[]): string` — apply sentence templates for signals with `confidenceScore >= 0.67`; return non-empty string even if no signal clears the threshold
- [x] 4.3 Implement `synthesiseLuckYear(year: number, baziEntry: AnnualLuckPillar | null, personalYearNum: number, zodiacPolarity: "auspicious" | "mixed" | "caution", astrologyTransits: TransitAspect[] | null): YearSynthesis` — collects signals from up to four year sources, runs `synthesiseGroup` with dynamic `groupSize` (excludes unavailable BaZi entries and null Astrology), derives `overallPolarity`
- [x] 4.4 Write unit tests for `synthesiseGroup`: all-agree (1.0), two-of-three (0.67), no-overlap (≤ 0.33)
- [x] 4.5 Write unit tests for `getYearAnimal` against known year-to-animal mappings (2023 = Rabbit, 2024 = Dragon, 2025 = Snake, 2026 = Horse)
- [x] 4.6 Write unit tests for `getYearRelationshipPolarity` against clash, six-harmony, and none cases

## 5. Oracle Hub Page

- [x] 5.1 Create `src/app/oracle/page.tsx` — landing page with title, two nav cards linking to `/oracle/life-directions` and `/oracle/life-forecast`, brief description of each oracle's purpose

## 6. Life Directions Oracle Page (`/oracle/life-directions`)

- [x] 6.1 Create `src/app/oracle/life-directions/page.tsx` with metadata (title, OG tags) and page shell
- [x] 6.2 Build question textarea with placeholder ("e.g., Should I change careers this year?") and submit button disabled when empty
- [x] 6.3 On submit: call Guan Yin, QMDJ, and Tarot lib functions in parallel; update per-system result state as each resolves
- [x] 6.4 Render `PerSystemCard` for each system as its result arrives
- [x] 6.5 After all three resolve: run Life Directions Oracle synthesis (`extractGuanyinSignals` + `extractQmdjSignals` + `extractTarotSignals` → `synthesiseGroup(groupSize=3)`)
- [x] 6.6 Render `ThemeOverlapPanel` and `SynthesisedSummary` once synthesis completes
- [x] 6.7 Add per-system error boundary: if a lib throws, show error message in that system's card slot without blocking others

## 7. Life Forecast Oracle Page (`/oracle/life-forecast`)

- [x] 7.1 Create `src/app/oracle/life-forecast/page.tsx` with metadata and page shell
- [x] 7.2 Build birthday input form: birth date (required), birth time (optional), timezone selector (optional, default browser timezone), gender selector (required), birth location field — city name lookup via existing `src/lib/cities.ts` or manual lat/lng entry (required for Astrology, optional for others)
- [x] 7.3 Label birth time as "required for full BaZi, Zi Wei, and Astrology accuracy"; label birth location as "required for Astrology house placements"
- [x] 7.4 On submit: call BaZi, Numerology, Zi Wei, Zodiac, and Astrology lib functions in parallel; update per-system result state as each resolves; skip Astrology call if no location provided and show a skipped notice on its card
- [x] 7.5 Show time-omitted notice on BaZi, Zi Wei, and Astrology result cards when birth time was not provided; show location-omitted notice on Astrology card when location was not provided

### Life Profile layer

- [x] 7.6 Render five `PerSystemCard` components under a "Life Profile" heading as results arrive
- [x] 7.7 Label the Zi Wei card as "Life Profile only — not included in year-by-year forecast"
- [x] 7.8 After all five resolve: run Life Profile synthesis (`extractBaziLifeSignals` + `extractNumerologyLifeSignals` + `extractZiweiSignals` + `extractZodiacLifeSignals` + `extractAstrologyLifeSignals` → `synthesiseGroup(groupSize=5)`)
- [x] 7.9 Render `ThemeOverlapPanel` and `SynthesisedSummary` for Life Profile

### Luck Timeline layer

- [x] 7.10 Compute `getLuckTimelineYears(currentYear)` to get the nine target years
- [x] 7.11 For each target year: look up `getBaziAnnualEntry`, call `calculatePersonalYearForYear`, call `getYearAnimal` and `getYearRelationshipPolarity`, call `calculateTransitsForDate` with `new Date(targetYear, 6, 1)` if location was provided
- [x] 7.12 Run `synthesiseLuckYear` for each of the nine target years (passes `null` for Astrology transits when location was not provided)
- [x] 7.13 Create `LuckTimelineTable` component: renders one row per year with year label, BaZi pillar (or "unavailable"), Numerology personal year number + theme, Zodiac year animal + relationship, `overallPolarity` indicator, and the year's `summary`
- [x] 7.14 Highlight the current year row (n = 0 offset) visually to anchor the user's reference point

## 8. Shared Display Components

- [x] 8.1 Create `PerSystemCard` component: system name (Chinese + English), tradition badge, full reading summary fields, optional notice slot
- [x] 8.2 Create `ThemeOverlapPanel` component: one row per theme with signal class icon, canonical tag, confidence progress bar (0–100 %), and system IDs that surfaced it
- [x] 8.3 Create `SynthesisedSummary` component: directed summary string in a highlighted callout card
- [x] 8.4 Create `LuckTimelineTable` component (see 7.13)

## 9. Navigation & Homepage

- [x] 9.1 Add Oracle entry to `NAV_ITEMS` in `src/components/Navigation.tsx`: `{ href: "/oracle", label: "合一 Oracle" }`
- [x] 9.2 Add Oracle card to `SYSTEMS` array in `src/app/page.tsx`: `{ id: "oracle", href: "/oracle", zh: "合一神諭", en: "Oracle", sub: "Cross-System Unified Reading", tags: ["All Systems", "Synthesis"] }`

## 10. OpenAPI Spec Update

- [x] 10.1 Add `UnifiedInput`, `UnifiedResult`, `Theme`, `YearSynthesis`, `PerSystemSummary` component schemas to `openspec/specs/divine-secrets-api/spec.md`
- [x] 10.2 Add `POST /readings/unified` path entry with operationId `createUnifiedReading`, request body referencing `UnifiedInput`, HTTP 200 (`UnifiedResult`) and HTTP 400 (`ErrorResponse`) responses
