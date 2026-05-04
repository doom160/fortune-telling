## Why

The platform has four Chinese metaphysical tools and a cross-system oracle, but lacks I Ching (易經) — the oldest and most foundational Chinese divination system. Adding I Ching completes the Chinese classical divination suite and strengthens the Life Directions Oracle by introducing a fourth signal source, raising cross-system confidence scores when systems agree.

## What Changes

- New standalone I Ching divination page at `/iching` with coin-toss hexagram casting, changing lines, resulting hexagram, and per-line interpretation
- New `src/lib/iching.ts` library with all 64 hexagrams, coin-toss simulation, reading builder, and signal extractor
- I Ching added as a fourth system in the Life Directions Oracle (`/oracle/life-directions`), alongside Guan Yin, Qi Men Dun Jia, and Tarot — synthesis group size increases from 3 to 4
- Navigation and homepage updated with I Ching entry
- `LifeDirectionsSystemId` union extended to include `"iching"`

## Capabilities

### New Capabilities

- `iching-reading`: Standalone I Ching divination — coin-toss casting of a hexagram, changing lines, resulting hexagram, and full line-by-line interpretation

### Modified Capabilities

- `unified-reading`: Life Directions Oracle adds I Ching as its fourth system; group size becomes 4; signal extraction contract gains `extractIChingSignals`
- `divine-secrets-api`: API spec gains `POST /readings/iching` endpoint with `IChingInput` and `IChingResult` schemas

## Impact

- **New lib**: `src/lib/iching.ts` (~600 lines — hexagram data + casting logic + signal extractor)
- **New page**: `src/app/iching/` (page + layout)
- **Modified**: `src/lib/synthesis.ts` — extend `LifeDirectionsSystemId`, add `extractIChingSignals`
- **Modified**: `src/app/oracle/life-directions/LifeDirectionsClient.tsx` — add I Ching system call and card
- **Modified**: `src/components/Navigation.tsx` and `src/app/page.tsx` — add I Ching nav entry
- **Modified**: `src/app/sitemap.ts` — add `/iching`
- **No new dependencies** — coin toss uses `Math.random()`; no external library required
