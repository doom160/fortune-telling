## MODIFIED Requirements

### Requirement: Life Directions Oracle consults Guan Yin, QMDJ, Tarot, and I Ching in parallel
The system SHALL pass the user's question string as input to the Guan Yin oracle, Qi Men Dun Jia, Tarot (three-card spread), and I Ching lib functions. All four SHALL run simultaneously and results SHALL be displayed as each completes.

#### Scenario: All four systems receive the same question
- **WHEN** the user submits a non-empty question
- **THEN** the Guan Yin, QMDJ, Tarot, and I Ching lib functions SHALL each be called with the question string

#### Scenario: Empty question blocked
- **WHEN** the question input is empty or whitespace only
- **THEN** the submit control SHALL remain disabled

#### Scenario: Per-system results appear progressively
- **WHEN** each lib function returns its result
- **THEN** that system's result card SHALL appear without waiting for the other systems

### Requirement: Life Directions Oracle synthesis uses group size of 4
The synthesis module SHALL extract outcome polarity, domain tags, and keyword signals from Guan Yin, QMDJ, Tarot, and I Ching results, count overlaps, compute `confidenceScore = count / 4`, and produce a `themes` array sorted descending by confidence.

#### Scenario: Full agreement on polarity across four systems
- **WHEN** all four Life Directions systems emit the same outcome polarity tag
- **THEN** that tag SHALL have `confidenceScore` of `1.00`

#### Scenario: Three-of-four agreement
- **WHEN** three of four systems emit the same domain tag
- **THEN** that tag SHALL have `confidenceScore` of `0.75`

#### Scenario: Two-of-four agreement
- **WHEN** two of four systems emit the same tag
- **THEN** that tag SHALL have `confidenceScore` of `0.50`

#### Scenario: Summary threshold unchanged
- **WHEN** synthesis completes
- **THEN** the summary string SHALL include only signals with `confidenceScore >= 0.67`

## ADDED Requirements

### Requirement: I Ching card displayed in Life Directions Oracle results
The system SHALL render a `PerSystemCard` for I Ching when the I Ching result is available, showing the primary hexagram name (Chinese + English), judgment text, and list of changing lines (if any).

#### Scenario: I Ching card appears after submission
- **WHEN** the user submits a question on `/oracle/life-directions`
- **THEN** an I Ching result card SHALL appear alongside Guan Yin, QMDJ, and Tarot cards

#### Scenario: I Ching error handled per-system
- **WHEN** the I Ching lib function throws an error
- **THEN** an error message SHALL appear in the I Ching card slot WITHOUT blocking the other three systems
