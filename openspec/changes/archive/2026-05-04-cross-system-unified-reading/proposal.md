## Why

Each divination system offers a distinct lens, but users must visit each page separately and reconcile the signals on their own. A unified cross-system reading removes this friction. The systems naturally split into two groups with shared input shapes: a **Life Directions group** (Guan Yin, QMDJ, Tarot — all take a free-text question) and a **Life Forecast group** (BaZi, Numerology, Zi Wei, Zodiac — all take a birth date). When multiple systems in the same group produce overlapping signals, that convergence is surfaced with a confidence score, giving the user a more directed reading than any single system can provide.

## What Changes

- **Two new pages** under an `/oracle/` route group:
  - `/oracle/life-directions` — **Life Directions Oracle**: user types one question; Guan Yin, QMDJ, and Tarot are consulted in parallel; synthesis finds overlapping guidance signals.
  - `/oracle/life-forecast` — **Life Forecast Oracle**: user provides birth date, optional time, timezone, gender, and birth location (lat/lng — required for Astrology); BaZi, Numerology, Zi Wei, Zodiac, and Western Astrology are consulted; results are presented in two layers:
    1. **Life Profile** — static whole-life synthesis across all five systems (character, element dominance, planetary influences, life-path themes).
    2. **Luck Timeline** — per-year readings and synthesis for years n-3, n-2, n-1, n, n+1, n+2, n+3, n+5, n+10 (n = current year). BaZi uses `annualLuckPillars` lookup; Numerology computes personal year number for each target year; Zodiac derives the year-animal relationship for each year; Astrology computes Jupiter/Saturn transits to the natal chart for a mid-year date. Zi Wei contributes to Life Profile only (no annual flow in current lib).
  - `/oracle` — landing hub page linking to both sub-pages.
- **Internal synthesis engine** (pure client-side TypeScript, `src/lib/synthesis.ts`) that:
  - Extracts structured signals from each system's typed output fields (outcome polarity, domain tags, shared keywords).
  - Counts how many systems surfaced the same signal → `confidenceScore = matches / group_size`.
  - Composes a template-based directed summary from signals with confidence ≥ 0.67.
- **No external AI service** — synthesis relies entirely on structured fields each lib already returns.
- All existing individual pages remain unchanged. BaZi Compatibility is excluded from the unified feature.

## Capabilities

### New Capabilities

- `unified-reading`: Specification for the unified oracle feature — two reading modes, per-system result shape, synthesis algorithm contract (signal extraction, overlap scoring, summary generation), luck timeline layer for Life Forecast Oracle with five participating systems.

### Modified Capabilities

- `divine-secrets-api`: Add `/readings/unified` path to the master OpenAPI spec to document the client-facing contract for future backend alignment.

## Impact

- **New routes**: `src/app/oracle/page.tsx` (hub), `src/app/oracle/life-directions/page.tsx`, `src/app/oracle/life-forecast/page.tsx` — additive only.
- **New module**: `src/lib/synthesis.ts` — signal extraction, overlap scoring, summary composition; no external dependencies.
- **New components**: `PerSystemCard`, `ThemeOverlapPanel`, `SynthesisedSummary`, `LuckTimelineTable`.
- **Existing pages**: zero changes to `/tarot`, `/guanyin`, `/qmdj`, `/bazi`, `/ziwei`, `/numerology`, `/astrology`, `/zodiac`.
- **Navigation**: add "Oracle" link to `Navigation.tsx`.
- **No new runtime dependencies** — synthesis is pure TypeScript operating on types already exported by existing libs.
