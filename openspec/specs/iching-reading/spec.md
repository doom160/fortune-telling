## Requirements

### Requirement: Client can cast an I Ching hexagram reading
The system SHALL simulate a three-coin toss for each of the six lines (bottom to top) and return a primary hexagram, a list of changing lines, and — when changing lines exist — a resulting hexagram representing the direction of change.

#### Scenario: Valid reading returned
- **WHEN** `performIChingReading` is called with an optional question string
- **THEN** the result SHALL include `primaryHexagram` (number 1–64), `lines` (6 line values), `changingLines` (array of 0-based indices), and `interpretation` (array of strings)

#### Scenario: No-question reading
- **WHEN** `performIChingReading` is called without a question
- **THEN** a valid hexagram reading SHALL still be returned

### Requirement: Coin toss produces correct probability distribution for changing lines
The system SHALL simulate three coins per line, where heads = 3 and tails = 2. The four possible sums (6, 7, 8, 9) SHALL occur with probabilities 1/8, 3/8, 3/8, 1/8 respectively. Sums 6 and 9 are changing lines; 7 and 8 are stable.

#### Scenario: Changing line probability
- **WHEN** a large number of single-line coin tosses are simulated
- **THEN** the proportion of changing lines (sum 6 or 9) SHALL be approximately 1/4 (25 %)

#### Scenario: Changing lines identified
- **WHEN** a line toss produces sum 6 or sum 9
- **THEN** that line SHALL appear in `changingLines`

### Requirement: Resulting hexagram is computed from changing lines
When the primary hexagram contains one or more changing lines, the system SHALL compute a resulting hexagram by flipping all changing line values (yin ↔ yang) and returning the matching hexagram entry.

#### Scenario: Resulting hexagram present when changes exist
- **WHEN** `changingLines` is non-empty
- **THEN** `resultingHexagram` SHALL be a valid hexagram distinct from `primaryHexagram` (unless all lines change and the result is the same hexagram's complement)

#### Scenario: No resulting hexagram when no changes
- **WHEN** `changingLines` is empty
- **THEN** `resultingHexagram` SHALL be `null`

### Requirement: All 64 hexagrams are available in King Wen order
The system SHALL include all 64 canonical hexagrams numbered 1–64 in King Wen sequence. Each hexagram SHALL have: `number`, `nameZh`, `namePinyin`, `nameEn`, `lines` (6-element binary array, index 0 = bottom line), `judgment` (Chinese verse + English), `image` (image verse + English), and `linesText` (6 objects with Chinese, English, and nature).

#### Scenario: Hexagram range
- **WHEN** a hexagram lookup is performed for any integer 1–64
- **THEN** a hexagram entry SHALL be returned with all required fields populated

#### Scenario: Hexagram lines length
- **WHEN** any hexagram's `lines` field is accessed
- **THEN** it SHALL have exactly 6 elements, each `0` (yin) or `1` (yang)

### Requirement: I Ching standalone page renders the reading visually
The system SHALL provide a page at `/iching` with a question input, a submit button (disabled when question is empty), and — after submission — a visual display of the primary hexagram lines, the hexagram name (Chinese, pinyin, English), the judgment text, changing line texts, and (when applicable) the resulting hexagram.

#### Scenario: Question required before casting
- **WHEN** the question input is empty or whitespace
- **THEN** the submit button SHALL remain disabled

#### Scenario: Hexagram lines displayed
- **WHEN** a reading result is rendered
- **THEN** each of the six lines SHALL be shown as a solid bar (yang) or broken bar (yin), with changing lines visually distinguished

#### Scenario: Changing line texts shown
- **WHEN** `changingLines` is non-empty
- **THEN** the text for each changing line SHALL be displayed beneath the primary hexagram

#### Scenario: Resulting hexagram section shown conditionally
- **WHEN** `changingLines` is non-empty
- **THEN** a "Resulting Hexagram" section SHALL appear showing the resulting hexagram's name and judgment

#### Scenario: No resulting hexagram section when stable
- **WHEN** `changingLines` is empty
- **THEN** no resulting hexagram section SHALL be rendered

### Requirement: I Ching signal extraction produces typed NormalisedSignal output
The system SHALL implement `extractIChingSignals(reading: IChingReading): NormalisedSignal[]` that derives polarity, domain, and keyword signals without free-text tokenisation.

#### Scenario: Polarity signal present
- **WHEN** `extractIChingSignals` is called on any reading
- **THEN** exactly one signal with `class: "polarity"` SHALL be in the result

#### Scenario: Domain signal present
- **WHEN** `extractIChingSignals` is called on any reading
- **THEN** at least one signal with `class: "domain"` SHALL be in the result

#### Scenario: Deterministic extraction
- **WHEN** the same `IChingReading` object is passed to `extractIChingSignals` twice
- **THEN** the returned signal arrays SHALL be identical
