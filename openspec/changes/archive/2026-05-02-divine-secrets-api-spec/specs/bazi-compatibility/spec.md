## ADDED Requirements

### Requirement: Client can compare two BaZi charts for compatibility
The system SHALL compute a BaZi compatibility (八字合婚) analysis when given two `BaziInput` objects (male and female). The response SHALL include both computed charts, a `factors` array of scored compatibility dimensions, a normalised `percentage` (0–100), an `overallRating`, and an `interpretation` array.

#### Scenario: Valid male and female inputs
- **WHEN** a POST request is sent to `/readings/bazi/compatibility` with valid `male` and `female` BaziInput objects
- **THEN** the response SHALL be HTTP 200 with `maleChart`, `femaleChart`, `factors`, `percentage`, `overallRating`, and `interpretation`

#### Scenario: Missing female input
- **WHEN** a POST request is sent to `/readings/bazi/compatibility` with only `male` provided
- **THEN** the response SHALL be HTTP 400

### Requirement: Compatibility factors cover eight classical dimensions
The system SHALL return exactly eight `CompatFactor` entries covering: Day Master Interaction, Day Branch (Marriage Palace), Year Branch (Zodiac), Month Branch (Social), Elemental Complementarity, Yin-Yang Balance, Na Yin Compatibility, and Day Master Strength.

#### Scenario: Factor array length
- **WHEN** a valid `/readings/bazi/compatibility` response is received
- **THEN** `factors` SHALL contain exactly 8 entries

#### Scenario: Factor score range
- **WHEN** a valid `/readings/bazi/compatibility` response is received
- **THEN** each `factor.score` SHALL be an integer in the range `[-3, 3]` inclusive and each `factor.maxScore` SHALL be a positive integer

### Requirement: Overall rating maps to defined percentage bands
The system SHALL set `overallRating` based on the normalised `percentage` score: Excellent (≥80%), Good (60–79%), Moderate (40–59%), Challenging (<40%).

#### Scenario: Excellent rating threshold
- **WHEN** `percentage` is 80 or above
- **THEN** `overallRating` SHALL equal `"Excellent"`

#### Scenario: Challenging rating threshold
- **WHEN** `percentage` is below 40
- **THEN** `overallRating` SHALL equal `"Challenging"`

### Requirement: Percentage is normalised across the full scoring range
The system SHALL compute `percentage` by normalising `totalScore` across the range `[minPossibleScore, maxPossibleScore]` where min is the sum of all factor negatives and max is the sum of all factor maxScores.

#### Scenario: Percentage bounds
- **WHEN** any valid `/readings/bazi/compatibility` response is received
- **THEN** `percentage` SHALL be an integer between 0 and 100 inclusive
