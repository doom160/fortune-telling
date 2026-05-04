## ADDED Requirements

### Requirement: Client can perform a three-rune Norse Rune reading
The system SHALL draw three runes without replacement from the 25-rune set (24 Elder Futhark + blank Wyrd rune). The three positions SHALL be labelled Past, Present, and Future. The drawn set SHALL include the rune's name, phonetic letter, divinatory meaning, keywords, polarity, and domain.

#### Scenario: Valid reading returned
- **WHEN** `performRuneReading` is called with an optional question string
- **THEN** the result SHALL include `drawnRunes` (array of exactly 3 `DrawnRune` entries with positions `"past"`, `"present"`, `"future"`), and `interpretation` (array of strings)

#### Scenario: No-question reading
- **WHEN** `performRuneReading` is called without a question
- **THEN** a valid three-rune reading SHALL still be returned

#### Scenario: No duplicate runes in a single draw
- **WHEN** `performRuneReading` is called
- **THEN** all three drawn rune entries SHALL have distinct `rune.number` values

### Requirement: All 25 runes are available (24 Elder Futhark + blank Wyrd)
The system SHALL include all 24 Elder Futhark runes numbered 1–24 in futhark order, plus rune number 25 (blank Wyrd rune). Each rune (1–24) SHALL have: `number`, `name` (runic name, e.g. "Fehu"), `letter` (phonetic value, e.g. "F"), `nameEn` (English keyword, e.g. "Cattle / Wealth"), `meaning` (divinatory interpretation string), `keywords` (array of 3–5 strings), `polarity` (`"auspicious"` | `"challenging"` | `"neutral"`), and `domain` (`"career"` | `"finance"` | `"love"` | `"health"` | `"general"`). The blank Wyrd rune (number 25) SHALL have `polarity: "neutral"` and `domain: "general"`.

#### Scenario: Rune range
- **WHEN** a rune lookup is performed for any integer 1–25
- **THEN** a rune entry SHALL be returned with all required fields populated

#### Scenario: Futhark ordering
- **WHEN** the RUNES array is iterated in order
- **THEN** rune 1 SHALL be Fehu, rune 2 Uruz, rune 3 Thurisaz, and so on in standard Elder Futhark sequence, with rune 25 as the blank Wyrd rune

### Requirement: Rune draw produces uniform random distribution
The system SHALL select three runes from the 25-rune pool without replacement using a uniform random distribution (Fisher-Yates or equivalent).

#### Scenario: All runes reachable
- **WHEN** a large number of readings are performed
- **THEN** every rune number 1–25 SHALL appear in the drawn set with approximately equal frequency

### Requirement: Norse Rune standalone page renders the three-rune reading
The system SHALL provide a page at `/rune` with a question input, a submit button (disabled when question is empty), and — after submission — a three-card display of the drawn runes in Past / Present / Future layout showing each rune's name, letter, meaning, and keywords.

#### Scenario: Question required before drawing
- **WHEN** the question input is empty or whitespace
- **THEN** the submit button SHALL remain disabled

#### Scenario: Three rune cards displayed
- **WHEN** a reading result is rendered
- **THEN** exactly three rune cards SHALL appear, labelled "Past", "Present", and "Future" respectively, each showing the rune name, phonetic letter, and divinatory meaning

#### Scenario: Blank Wyrd rune displayed distinctly
- **WHEN** the blank Wyrd rune is drawn
- **THEN** its card SHALL display "Wyrd — The Unknown" as the name and convey that the outcome lies in the hands of fate

### Requirement: Norse Rune signal extraction produces typed NormalisedSignal output
The system SHALL implement `extractRuneSignals(reading: RuneReading): NormalisedSignal[]` that derives polarity, domain, and keyword signals from typed rune fields without free-text tokenisation.

#### Scenario: Polarity signal present
- **WHEN** `extractRuneSignals` is called on any reading
- **THEN** exactly one signal with `class: "polarity"` SHALL be in the result, derived by majority vote across the three drawn runes' polarity values

#### Scenario: Domain signal present
- **WHEN** `extractRuneSignals` is called on any reading
- **THEN** at least one signal with `class: "domain"` SHALL be in the result, sourced from the Present-position rune's domain

#### Scenario: Keyword signal present
- **WHEN** `extractRuneSignals` is called on any reading
- **THEN** at least one signal with `class: "keyword"` SHALL be in the result, derived from the Present-position rune's nameEn in kebab-case

#### Scenario: Deterministic extraction
- **WHEN** the same `RuneReading` object is passed to `extractRuneSignals` twice
- **THEN** the returned signal arrays SHALL be identical
