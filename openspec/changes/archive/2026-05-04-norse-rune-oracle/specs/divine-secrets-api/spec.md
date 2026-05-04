## ADDED Requirements

### Requirement: API exposes a Norse Rune reading endpoint
The system SHALL provide a `POST /readings/rune` endpoint that accepts an optional question string and returns a three-rune reading result.

#### Scenario: Successful rune reading response
- **WHEN** a client sends `POST /readings/rune` with a valid `RuneInput` body (or an empty body)
- **THEN** the response SHALL be `200 OK` with a `RuneResult` body containing `drawnRunes` (array of 3) and `interpretation` (array of strings)

#### Scenario: Question field optional
- **WHEN** `POST /readings/rune` is called without a `question` field in the body
- **THEN** the endpoint SHALL still return a valid `RuneResult`

### Requirement: RuneEntry, RuneInput, and RuneResult schemas defined in the API spec
The spec SHALL include schema definitions for `RuneEntry` (a single rune's data), `DrawnRune` (a rune + position), `RuneInput` (request body), and `RuneResult` (response body).

#### Scenario: RuneEntry schema fields present
- **WHEN** the `RuneEntry` schema is referenced
- **THEN** it SHALL include: `number` (integer 1–25), `name` (string), `letter` (string), `nameEn` (string), `meaning` (string), `keywords` (array of strings), `polarity` (enum: auspicious, challenging, neutral), `domain` (enum: career, finance, love, health, general)

#### Scenario: DrawnRune schema fields present
- **WHEN** the `DrawnRune` schema is referenced
- **THEN** it SHALL include: `position` (enum: past, present, future), `rune` (RuneEntry)

#### Scenario: RuneResult schema fields present
- **WHEN** the `RuneResult` schema is referenced
- **THEN** it SHALL include: `drawnRunes` (array of 3 DrawnRune objects) and `interpretation` (array of strings)
