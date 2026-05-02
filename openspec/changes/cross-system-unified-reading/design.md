## Context

The app is a client-side Next.js application. All divination systems are computed entirely in the browser via `src/lib/*.ts` modules — there are no existing API routes. Each lib already returns structured output (typed TypeScript objects with outcome fields, domain tags, element values, and keyword arrays). Synthesis can therefore be done algorithmically in the browser by extracting named signals from those structured fields, without any external service.

## Goals / Non-Goals

**Goals:**
- Two separate pages under an `/oracle/` route group:
  - `/oracle/life-directions` — **Life Directions Oracle** (Guan Yin + QMDJ + Tarot): user provides a free-text question.
  - `/oracle/life-forecast` — **Life Forecast Oracle** (BaZi + Numerology + Zi Wei + Zodiac + Western Astrology): user provides birth date, optional time, timezone, gender, and birth location (lat/lng — required for Astrology).
- Life Forecast Oracle covers two reading layers:
  1. **Life Profile** — static whole-life synthesis across all five systems.
  2. **Luck Timeline** — per-year readings for n-3, n-2, n-1, n, n+1, n+2, n+3, n+5, n+10 (where n = current calendar year), with cross-system synthesis per year.
- Internal synthesis runs entirely in the browser: extract normalised signals from each system's output, find overlaps, compute confidence scores, compose a summary.
- Zero external dependencies added; no server route required.
- A shared `/oracle` landing hub links to both sub-pages.

**Non-Goals:**
- BaZi Compatibility — excluded from unified feature.
- External LLM synthesis (deferred; internal pattern matching is sufficient for now).
- Persisting or sharing readings.
- Modifying any existing individual pages or libs (wrapper functions are additive).

## Decisions

### D1: All computation client-side including synthesis

**Decision:** Call existing `src/lib/*.ts` functions directly in the browser. The synthesis step (`src/lib/synthesis.ts`) is also browser-safe pure TypeScript — no server route needed.

**Rationale:** The lib functions have no side effects and don't need server execution. Synthesis without an LLM is pure data transformation — extracting and counting structured fields. A server round-trip adds latency for no benefit.

**Alternative considered:** Next.js Route Handler for synthesis. Rejected — unnecessary indirection with no security or resource benefit when there is no API key to protect.

### D2: Two separate pages, not one page with two panels

**Decision:** `/oracle/life-directions` and `/oracle/life-forecast` are distinct pages. A landing page at `/oracle` links to both with a brief description of each.

**Rationale:** The two groups have entirely different input shapes (free-text question vs. birth date + time + timezone + gender) and produce reading results of very different depth and structure. Putting them on one page creates a cluttered, confusing form. Separate pages let each flow be optimised for its own UX.

**Alternative considered:** Single page with two collapsible panels. Rejected — users would need to scroll past unrelated inputs and results, and the birthday panel grows significantly with the luck timeline layer.

### D3: Life Forecast Oracle has two output layers: Life Profile and Luck Timeline

**Decision:** The Life Forecast Oracle page has two clearly separated sections:
1. **Life Profile** — each system runs once with the birth inputs and the result is synthesised for overall character/life-path themes.
2. **Luck Timeline** — for each of the nine target years (n-3, n-2, n-1, n, n+1, n+2, n+3, n+5, n+10), a per-system year-specific reading is collected and synthesised independently. Each year's synthesis produces its own `themes[]` and `summary`.

**Rationale:** Life Profile tells the user who they are; Luck Timeline tells them when. These are distinct questions that deserve distinct layouts.

### D4: Year-specific data sources per system

BaZi and Numerology support year-parameterized queries natively or with a thin wrapper. Zodiac uses year-to-animal relationships. Zi Wei contributes static data to Life Profile only.

| System | Life Profile source | Luck Timeline source |
|---|---|---|
| **BaZi** | Full `BaziChart` interpretation | `annualLuckPillars` array — filter by `entry.year`, read pillar stem/branch elements |
| **Numerology** | Life path, expression, soul urge, Lo Shu grid | `calculatePersonalYearForYear(birthDate, targetYear)` wrapper — computes `personalYearNumber` for any given year using `PERSONAL_YEAR_INTERP` |
| **Zi Wei** | Full `ZiWeiChart` palace interpretation | Static chart only — no annual flow (流年) in current lib; Zi Wei participates in Life Profile synthesis but is excluded from per-year synthesis to avoid fabrication |
| **Zodiac** | Animal character profile from `ZodiacAnimal.traits` | For each target year: determine that year's animal via Lichun boundary, then compute the relationship type (six-harmony, three-harmony, clash, harm, etc.) between the person's animal and the year's animal using existing `getRelationships` logic |
| **Astrology** | Full `NatalChart` — sun/moon/rising signs, house placements, natal aspects | For each target year: compute planet positions for July 1 of that year using `calculatePlanetPositions` (currently unexported — needs a new exported wrapper or a helper in `synthesis.ts`), then run `findTransitAspects` against the natal chart; key indicators are Jupiter and Saturn aspects |

**Rationale for Zodiac year approach:** `calculateZodiacReading` is hardcoded to generate forecasts around today's date and cannot be called for arbitrary years. The year-to-animal relationship assessment is a standard, well-defined Chinese astrology operation that produces a polarity signal (auspicious ↔ challenging) without needing forecast generation.

**Rationale for Astrology year approach:** `calculateNatalChart` computes transits for `new Date()` only. Jupiter (opportunity/expansion) and Saturn (discipline/restriction) are the classical annual forecast indicators in Western astrology. Computing their sign position and aspects to the natal chart for a mid-year date (July 1) gives a representative annual signal without requiring daily transit tracking.

**Rationale for Zi Wei exclusion from per-year synthesis:** Annual palace flow (流年斗數) requires complex additional computation not present in the current lib. Including partial or fabricated Zi Wei year signals would corrupt the confidence scores. Zi Wei is clearly marked as "Life Profile only" in the UI.

### D5: Internal synthesis via structured signal extraction

**Decision:** `src/lib/synthesis.ts` extracts three classes of signals from each system's output, then scores them:

| Signal class | Life Directions group sources | Life Forecast group sources |
|---|---|---|
| **Outcome polarity** | Guan Yin `outcome`, QMDJ formation `nature` aggregate, Tarot reversed ratio | BaZi pillar element balance, Numerology personal year number parity, Zodiac year-relationship type |
| **Domain tag** | Guan Yin domain fields (`career`, `love`, `health`, `finance`), QMDJ `focus`, Tarot card position semantics | Numerology life-path domain, Zodiac officer `suitable`/`avoid` (Life Profile), BaZi pillar element domain association |
| **Keyword** | Tarot `keywords[]` per card, Guan Yin `guidance` tokenised, QMDJ formation names | Numerology `dominantElement`, BaZi dominant element, Zodiac animal traits keywords |

Each signal is normalised to a canonical tag (e.g. `"auspicious"`, `"caution"`, `"career"`, `"relationship"`, `"wood"`). Systems that produce the same canonical tag increment that tag's count. `confidenceScore = count / groupSize`.

For the Luck Timeline, synthesis runs with a group of 4 (BaZi + Numerology + Zodiac + Astrology, since Zi Wei is excluded from per-year synthesis). Confidence score denominator is therefore 4, not 5.

### D6: Confidence score = share of group that surfaced the signal

**Decision:** `confidenceScore = (number of systems that emitted the signal) / (total participating systems)`. Rounded to two decimal places.

**Rationale:** Simple, self-scaling, interpretable. A score of 1.0 means every participating system pointed the same direction.

### D7: Summary composition via ranked-tag template

**Decision:** The synthesis module composes a directed summary string by slotting the top-ranked signals into sentence templates keyed on (signal class × polarity). Only signals with `confidenceScore >= 0.67` appear in the summary.

**Rationale:** Template-based composition is deterministic and avoids hallucination risk. The user sees per-system cards for detail; the summary is the convergence callout only.

## Risks / Trade-offs

- **Synthesis quality without LLM**: Structured signal extraction is precise but narrow. Insights buried in free-text interpretation strings are missed. Mitigation: per-system cards show the full reading; synthesis highlights convergence, not the complete picture.
- **Numerology personal year wrapper**: `calculatePersonalYear` in `src/lib/numerology.ts` calls `new Date().getFullYear()` internally, so it cannot be called for past/future years without a wrapper. Mitigation: add `calculatePersonalYearForYear(birthDate, year)` as a new exported function, or add it to `synthesis.ts` as a local copy of the formula.
- **Zi Wei absence from Luck Timeline reduces group size to 4**: Users may expect all five systems to contribute to year forecasts. Mitigation: clearly label which systems contribute to each layer in the UI; show Zi Wei card in Life Profile only.
- **Birth time and location optional but affect BaZi, Zi Wei, and Astrology accuracy**: Without birth time, hour pillar is absent and Zi Wei/Astrology house placements shift significantly. Without location, Astrology house calculation falls back to solar houses. Mitigation: label these as "required for full accuracy" and show notices on affected result cards when omitted.
- **Astrology transit helpers are currently unexported**: `calculatePlanetPositions` and `findTransitAspects` are private functions in `src/lib/astrology.ts`. Mitigation: add a new exported function `calculateTransitsForDate(natalChart: NatalChart, date: Date): TransitAspect[]` to `src/lib/astrology.ts` — this is an additive change that does not alter existing behaviour.

## Migration Plan

1. Add `src/lib/synthesis.ts` and any year-parameterized helpers — new module, no impact on existing code.
2. Add route group `src/app/oracle/` with `page.tsx` (hub), `question/page.tsx`, and `birthday/page.tsx` — new routes, additive only.
3. Add "Oracle" entry to `Navigation.tsx` and homepage `SYSTEMS` — one-line additions each.

No API routes, no database changes, no breaking changes. Rollback is removing the `/oracle` routes and nav/homepage entries.
