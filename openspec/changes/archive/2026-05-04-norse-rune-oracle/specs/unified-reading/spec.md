## MODIFIED Requirements

### Requirement: Life Directions Oracle consults Guan Yin, QMDJ, Tarot, I Ching, and Norse Rune in parallel
The system SHALL pass the user's question string as input to the Guan Yin oracle, Qi Men Dun Jia, Tarot (three-card spread), I Ching, and Norse Rune lib functions. All five SHALL run simultaneously and results SHALL be displayed as each completes.

#### Scenario: All five systems receive the same question
- **WHEN** the user submits a non-empty question
- **THEN** the Guan Yin, QMDJ, Tarot, I Ching, and Norse Rune lib functions SHALL each be called with the question string

#### Scenario: Empty question blocked
- **WHEN** the question input is empty or whitespace only
- **THEN** the submit control SHALL remain disabled

#### Scenario: Per-system results appear progressively
- **WHEN** each lib function returns its result
- **THEN** that system's result card SHALL appear without waiting for the other systems

### Requirement: Life Directions Oracle synthesis uses group size of 5
The synthesis module SHALL extract outcome polarity, domain tags, and keyword signals from Guan Yin, QMDJ, Tarot, I Ching, and Norse Rune results, count overlaps, compute `confidenceScore = count / 5`, and produce a `themes` array sorted descending by confidence.

#### Scenario: Full agreement on polarity across five systems
- **WHEN** all five Life Directions systems emit the same outcome polarity tag
- **THEN** that tag SHALL have `confidenceScore` of `1.00`

#### Scenario: Four-of-five agreement
- **WHEN** four of five systems emit the same domain tag
- **THEN** that tag SHALL have `confidenceScore` of `0.80`

#### Scenario: Three-of-five agreement
- **WHEN** three of five systems emit the same domain tag
- **THEN** that tag SHALL have `confidenceScore` of `0.60`

#### Scenario: Two-of-five agreement
- **WHEN** two of five systems emit the same tag
- **THEN** that tag SHALL have `confidenceScore` of `0.40`

#### Scenario: Summary threshold unchanged
- **WHEN** synthesis completes
- **THEN** the summary string SHALL include only signals with `confidenceScore >= 0.67`

### Requirement: System identifiers are limited to the nine participating systems
The Life Directions Oracle SHALL use exactly `guanyin`, `qmdj`, `tarot`, `iching`, `rune`. The Life Forecast Oracle SHALL use exactly `bazi`, `numerology`, `ziwei`, `zodiac`, `astrology`. The identifier `bazi-compatibility` SHALL NOT be valid in this feature.

#### Scenario: Life Directions group membership fixed
- **WHEN** the Life Directions Oracle runs
- **THEN** exactly `guanyin`, `qmdj`, `tarot`, `iching`, and `rune` SHALL participate

#### Scenario: Life Forecast group membership fixed
- **WHEN** the Life Forecast Oracle runs
- **THEN** exactly `bazi`, `numerology`, `ziwei`, `zodiac`, and `astrology` SHALL participate; Astrology's contribution to Luck Timeline is conditional on birth location being provided

#### Scenario: bazi-compatibility absent
- **WHEN** either oracle page renders
- **THEN** no UI element for BaZi Compatibility SHALL be present

## ADDED Requirements

### Requirement: Norse Rune card displayed in Life Directions Oracle results
The system SHALL render a result card for Norse Rune when the Norse Rune reading is available, showing the three drawn rune names (Past / Present / Future positions) and the Present-position rune's divinatory meaning.

#### Scenario: Norse Rune card appears after submission
- **WHEN** the user submits a question on `/oracle/life-directions`
- **THEN** a Norse Rune result card SHALL appear alongside Guan Yin, QMDJ, Tarot, and I Ching cards

#### Scenario: Norse Rune error handled per-system
- **WHEN** the Norse Rune lib function throws an error
- **THEN** an error message SHALL appear in the Norse Rune card slot WITHOUT blocking the other four systems
