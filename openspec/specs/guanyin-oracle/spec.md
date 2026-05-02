## ADDED Requirements

### Requirement: Client can draw a Guan Yin oracle lot
The system SHALL select a Guan Yin oracle lot (觀音靈籤) in response to a question string. The response SHALL include the lot number (1–100), the classical Chinese poem, an English translation, a meaning summary, and practical advice.

#### Scenario: Valid question
- **WHEN** a POST request is sent to `/readings/guanyin` with a non-empty `question`
- **THEN** the response SHALL be HTTP 200 with `lotNumber`, `poem`, `poemTranslation`, `meaning`, and `advice`

#### Scenario: Empty question
- **WHEN** `question` is an empty string or whitespace only
- **THEN** the response SHALL be HTTP 400

### Requirement: Lot number is within the classical range of 1 to 100
The system SHALL return `lotNumber` as an integer between 1 and 100 inclusive, corresponding to the 100 classical Guan Yin oracle lots.

#### Scenario: Lot number range
- **WHEN** a valid `/readings/guanyin` response is received
- **THEN** `lotNumber` SHALL be an integer in the range `[1, 100]` inclusive

### Requirement: Response includes both Chinese poem and English translation
The system SHALL return `poem` as the original classical Chinese text and `poemTranslation` as an English rendering of the same poem.

#### Scenario: Poem fields present
- **WHEN** a valid `/readings/guanyin` response is received
- **THEN** both `poem` and `poemTranslation` SHALL be non-empty strings

### Requirement: Advice is specific and actionable
The system SHALL return `advice` as a non-empty string providing guidance relevant to the querent's situation based on the traditional interpretation of the drawn lot.

#### Scenario: Advice present
- **WHEN** a valid `/readings/guanyin` response is received
- **THEN** `advice` SHALL be a non-empty string
