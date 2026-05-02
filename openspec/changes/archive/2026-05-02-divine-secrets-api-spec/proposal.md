## Why

The 神圣秘密 Divine Secrets app performs all divination computations client-side in TypeScript. Formalising these engines as a REST API spec creates a machine-readable contract that enables future backend extraction, third-party integrations, and consistent documentation without changing any existing code today.

## What Changes

- Add an OpenAPI 3.1 specification file documenting all nine divination engines as POST endpoints
- Define shared reusable schemas (Pillar, HeavenlyStem, EarthlyBranch, Element, Polarity) referenced across endpoints
- Each endpoint mirrors the exact input/output shapes already implemented in the TypeScript engines

## Capabilities

### New Capabilities

- `bazi-reading`: POST /readings/bazi — compute a four-pillar BaZi birth chart from DOB, time, and timezone
- `bazi-compatibility`: POST /readings/bazi/compatibility — compare two BaZi charts and return compatibility factors, score, and interpretation
- `ziwei-reading`: POST /readings/ziwei — compute a Zi Wei Dou Shu 12-palace chart from DOB, time, gender, and calendar type
- `zodiac-forecast`: POST /readings/zodiac — return zodiac animal profile and 28-day daily forecast from a date of birth
- `tarot-reading`: POST /readings/tarot — perform a three-card tarot spread given a question
- `qmdj-chart`: POST /readings/qmdj — generate a Qi Men Dun Jia nine-palace divination chart
- `numerology-reading`: POST /readings/numerology — compute Pythagorean numerology core numbers and Lo Shu grid
- `astrology-chart`: POST /readings/astrology — calculate a Western natal chart with planets, houses, and aspects
- `guanyin-oracle`: POST /readings/guanyin — draw a Guan Yin oracle lot and return poem, meaning, and advice

### Modified Capabilities

_(none — this is a greenfield spec with no existing openspec specs)_

## Impact

- New file: `openspec/specs/divine-secrets-api/spec.md` (OpenAPI 3.1 document)
- No changes to existing TypeScript source code
- No runtime dependencies added
- Future: spec can drive code-generation of an Express/Fastify backend or SDK clients
