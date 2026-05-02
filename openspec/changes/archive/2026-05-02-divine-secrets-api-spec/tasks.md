## 1. Shared Component Schemas

- [x] 1.1 Define `Element` enum schema (Wood, Fire, Earth, Metal, Water)
- [x] 1.2 Define `Polarity` enum schema (Yang, Yin)
- [x] 1.3 Define `HeavenlyStem` schema (key, chinese, pinyin, element, polarity)
- [x] 1.4 Define `EarthlyBranch` schema (key, chinese, pinyin, animal, element, polarity)
- [x] 1.5 Define `Pillar` schema referencing HeavenlyStem and EarthlyBranch
- [x] 1.6 Define `BaziInput` schema (name?, birthDate, birthTime?, gender, timeZone)
- [x] 1.7 Define `ErrorResponse` schema (message: string)

## 2. BaZi Reading Endpoint

- [x] 2.1 Define `LuckPillar` schema (ageStart, ageEnd, decade, yearRange, pillar)
- [x] 2.2 Define `BaziChart` response schema (all four pillars, dayMaster, elementCounts, dominantElement, weakElement, luckPillars, annualLuckPillars, interpretation, isHourEstimated)
- [x] 2.3 Write `POST /readings/bazi` path with request body referencing `BaziInput` and response referencing `BaziChart`
- [x] 2.4 Add 400 error response for missing/invalid fields

## 3. BaZi Compatibility Endpoint

- [x] 3.1 Define `CompatInput` schema (male: BaziInput, female: BaziInput)
- [x] 3.2 Define `CompatFactor` schema (name, nameZh, score, maxScore, description, detail)
- [x] 3.3 Define `CompatResult` response schema (maleChart, femaleChart, factors, totalScore, maxPossibleScore, percentage, overallRating, interpretation)
- [x] 3.4 Define `OverallRating` enum (Excellent, Good, Moderate, Challenging)
- [x] 3.5 Write `POST /readings/bazi/compatibility` path with request/response schemas
- [x] 3.6 Add 400 error response

## 4. Zi Wei Dou Shu Endpoint

- [x] 4.1 Define `ZiweiStar` schema (key, name, abbrName, type, transformation?)
- [x] 4.2 Define `ZiweiPalace` schema (name, index, isDestiny, isBody, stars)
- [x] 4.3 Define `ZiweiInput` schema (birthDate, birthTime, gender, timeZone, calendar)
- [x] 4.4 Define `ZiweiChart` response schema (palaces, destinyPalace, bodyPalace, mainStar, fiveElementScore, luckPillars, solarDate, trueSolarDate, interpretation)
- [x] 4.5 Write `POST /readings/ziwei` path with request/response schemas
- [x] 4.6 Add 400 error response

## 5. Chinese Zodiac Endpoint

- [x] 5.1 Define `DayOfficer` schema (chinese, english, nature, suitable, avoid, description)
- [x] 5.2 Define `ZodiacAnimal` schema (emoji, english, chinese, element, polarity, traits, compatible, incompatible)
- [x] 5.3 Define `RelationType` enum (six-harmony, three-harmony, clash, harm, punishment, destruction, none)
- [x] 5.4 Define `DayForecast` schema (date, dayAnimalIndex, officer, relationships, rating, brief, detail)
- [x] 5.5 Define `DayRating` enum (very-auspicious, auspicious, neutral, challenging, very-challenging)
- [x] 5.6 Define `ZodiacReading` response schema (animal, zodiacYear, forecasts)
- [x] 5.7 Write `POST /readings/zodiac` path with request/response schemas

## 6. Tarot Endpoint

- [x] 6.1 Define `TarotCard` schema (name, arcana, isReversed, meaning, positionMeaning)
- [x] 6.2 Define `TarotInput` schema (question, spreadType)
- [x] 6.3 Define `SpreadType` enum (past-present-future, situation-action-outcome, mind-body-spirit)
- [x] 6.4 Define `TarotReading` response schema (cards, interpretation)
- [x] 6.5 Write `POST /readings/tarot` path with request/response schemas

## 7. Qi Men Dun Jia Endpoint

- [x] 7.1 Define `QmdjPalace` schema (index, direction, heavenlyStem, gate, star, deity, isAuspicious, element)
- [x] 7.2 Define `QmdjFormation` schema (name, nature, palaces)
- [x] 7.3 Define `QmdjInput` schema (datetime?, mode, timeZone?)
- [x] 7.4 Define `QmdjMode` enum (now, question)
- [x] 7.5 Define `QmdjChart` response schema (palaces, formations, chartTime, interpretation)
- [x] 7.6 Write `POST /readings/qmdj` path with request/response schemas

## 8. Numerology Endpoint

- [x] 8.1 Define `NumerologyArrow` schema (name, direction, meaning)
- [x] 8.2 Define `NumerologyInput` schema (fullName, birthDate)
- [x] 8.3 Define `NumerologyReading` response schema (lifePathNumber, expressionNumber, soulUrgeNumber, personalityNumber, meanings, loShuGrid, arrows, interpretation)
- [x] 8.4 Write `POST /readings/numerology` path with request/response schemas

## 9. Western Astrology Endpoint

- [x] 9.1 Define `Planet` schema (name, symbol, sign, house, degree, isRetrograde)
- [x] 9.2 Define `HouseCusp` schema (number, sign, degree)
- [x] 9.3 Define `Aspect` schema (planet1, planet2, type, orb, nature)
- [x] 9.4 Define `AstrologyInput` schema (birthDate, birthTime, birthCity)
- [x] 9.5 Define `NatalChart` response schema (planets, houses, aspects, ascendant, midheaven, interpretation)
- [x] 9.6 Write `POST /readings/astrology` path with request/response schemas
- [x] 9.7 Add 422 error response for unresolvable city

## 10. Guan Yin Oracle Endpoint

- [x] 10.1 Define `GuanyinInput` schema (question)
- [x] 10.2 Define `GuanyinReading` response schema (lotNumber, poem, poemTranslation, meaning, advice)
- [x] 10.3 Write `POST /readings/guanyin` path with request/response schemas

## 11. OpenAPI Document Assembly

- [x] 11.1 Create `openspec/specs/divine-secrets-api/spec.md` with OpenAPI 3.1 YAML in a fenced code block
- [x] 11.2 Set `info` block: title "神圣秘密 Divine Secrets API", version "1.0.0", description
- [x] 11.3 Set `servers` block with placeholder `https://api.divine-secrets.app/v1`
- [x] 11.4 Assemble `components/schemas` with all shared types defined in tasks 1–10
- [x] 11.5 Assemble `paths` block with all nine POST endpoints
- [x] 11.6 Validate YAML is well-formed (no syntax errors)
- [x] 11.7 Verify all `$ref` targets exist within `components/schemas`
