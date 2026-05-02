## Context

The app currently runs all nine divination engines purely client-side in TypeScript. Each engine exposes a typed `calculate*` function that accepts a structured input object and returns a rich output object. The goal is to produce a single OpenAPI 3.1 YAML document that faithfully reflects these existing shapes so the spec could serve as the contract for a future HTTP API without altering any existing code.

The engines and their TypeScript source files:

| Engine | Source |
|--------|--------|
| BaZi | `src/lib/bazi.ts` |
| BaZi Compatibility | `src/lib/bazi-compat.ts` |
| Zi Wei Dou Shu | `src/lib/ziwei.ts` |
| Chinese Zodiac | `src/lib/zodiac.ts` |
| Tarot | `src/lib/tarot.ts` |
| Qi Men Dun Jia | `src/lib/qmdj.ts` |
| Numerology | `src/lib/numerology.ts` |
| Western Astrology | `src/lib/astrology.ts` |
| Guan Yin Oracle | `src/lib/guanyin.ts` |

## Goals / Non-Goals

**Goals:**
- Produce one well-structured OpenAPI 3.1 YAML spec covering all nine POST endpoints
- Use `$ref` components to avoid repetition for shared types (Pillar, HeavenlyStem, EarthlyBranch, Element, Polarity)
- Keep the spec consistent with the TypeScript types as the source of truth
- Spec lives at `openspec/specs/divine-secrets-api/spec.md` within the openspec structure

**Non-Goals:**
- No backend server is being built
- No authentication/authorisation design (out of scope for v1 spec)
- No breaking changes to existing TypeScript source code
- No SDK or client code generation (follow-on work)

## Decisions

**Decision 1: Single spec file vs. one file per endpoint**
→ Single `spec.md` (OpenAPI 3.1 in a fenced YAML block). All nine endpoints are cohesive — shared schemas (Pillar, HeavenlyStem, etc.) appear once in `components/schemas`. Splitting by endpoint would duplicate shared types and complicate cross-referencing.

**Decision 2: POST for all reading endpoints**
→ All endpoints use POST because inputs can be large (full charts with 4+ pillars, compatibility with two full inputs) and are not safe to embed in query strings. POST also maps cleanly to the existing `calculate*(input)` call signature. Alternatives considered: GET with query params — rejected due to complex nested objects.

**Decision 3: Path prefix `/readings/`**
→ Groups all divination endpoints under a clear namespace, leaving room for future non-reading endpoints (e.g., `/users`, `/history`) without conflicts.

**Decision 4: Inline response vs. envelope**
→ Response body is the direct result object (no `{ data: ... }` wrapper). This matches the current TypeScript return types and avoids unnecessary indirection for v1.

**Decision 5: `interpretation` as `string[]`**
→ All engines return interpretation as a `string[]` where each element is a Markdown-formatted line (sections prefixed `## `). The spec models this faithfully rather than trying to define a richer structured type, keeping the spec stable as interpretation text evolves.

## Risks / Trade-offs

- **Spec drift** — TypeScript types are the true source of truth; the YAML spec can fall out of sync as engines evolve. → Mitigation: treat this spec as living documentation; revisit on each engine change.
- **No validation** — The spec is documentation-only today; no runtime request validation against it. → Mitigation: future backend can use `openapi-validator` middleware against this spec.
- **Optional fields** — Several inputs have optional fields (birthTime, name). Marking these correctly in the spec is important to avoid false "required" expectations. → Mitigation: cross-check each `required` array against TypeScript optional (`?`) annotations.

## Migration Plan

No deployment steps — this is a documentation-only artifact. The file is placed in `openspec/specs/divine-secrets-api/spec.md` and committed to the repository.

## Open Questions

- Should `birthTime` absence be represented as an omitted field or an explicit `null`? (Current TypeScript uses `undefined`; OpenAPI prefers omission.)
- Should error responses beyond `400` (e.g., `422 Unprocessable Entity`) be defined for future backend validation errors?
