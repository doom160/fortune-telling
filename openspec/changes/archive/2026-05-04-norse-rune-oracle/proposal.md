## Why

The Life Directions Oracle currently consults four systems (Guan Yin, QMDJ, Tarot, I Ching) in response to a user's question. Norse Runes offer a distinct Western esoteric tradition with strong symbolic vocabulary — each Elder Futhark rune carries a name, a phonetic value, and a divinatory meaning — making it a natural fifth voice in a cross-cultural oracle ensemble. Adding runes broadens the synthesis signal pool and appeals to users seeking Nordic/Northern European spiritual traditions alongside the existing East-Asian and Western Tarot systems.

## What Changes

- **New**: `src/lib/rune.ts` — Elder Futhark rune data (24 runes + blank wyrd rune), three-rune draw logic (`performRuneReading`), and `extractRuneSignals` for synthesis
- **New**: `src/app/rune/` — standalone `/rune` page with question input and drawn rune display
- **Modified**: `src/app/oracle/life-directions/LifeDirectionsClient.tsx` — add Norse Rune as fifth system; group size 4 → 5
- **Modified**: `src/lib/synthesis.ts` — extend `LifeDirectionsSystemId` to include `"rune"`; add `extractRuneSignals`
- **Modified**: Navigation, homepage SYSTEMS list, and sitemap to include `/rune`
- **Modified**: `globals.css` — rune card and draw display styles
- **Modified**: OpenAPI spec — `POST /readings/rune`, `RuneInput`, `RuneResult` schemas

## Capabilities

### New Capabilities

- `norse-rune-reading`: Three-rune draw from the Elder Futhark (24 + optional blank wyrd), typed signal extraction, standalone `/rune` page, and oracle card component

### Modified Capabilities

- `unified-reading`: Life Directions Oracle expands from 4 to 5 systems; synthesis group size and confidence scenarios updated accordingly
- `divine-secrets-api`: New `POST /readings/rune` endpoint and associated schemas added

## Impact

- **`src/lib/rune.ts`** — new file (~400–500 lines)
- **`src/lib/synthesis.ts`** — new export `extractRuneSignals`, type union extension
- **`src/app/rune/`** — new directory (layout.tsx + page.tsx)
- **`src/app/oracle/life-directions/LifeDirectionsClient.tsx`** — fifth system wired in
- **`src/components/`** — `RuneCard` sub-component or inline card in LifeDirectionsClient
- **`src/components/Navigation.tsx`**, **`src/app/page.tsx`**, **`src/app/sitemap.ts`** — minor additions
- **`src/app/globals.css`** — new `.rune-*` CSS classes
- **`openspec/specs/divine-secrets-api/spec.md`** — new path + schemas
- No breaking changes to existing APIs or page routes
