## ADDED Requirements

### Requirement: Client can request a three-card tarot spread
The system SHALL perform a tarot reading when given a `question` string and a `spreadType`. The response SHALL include a `cards` array of exactly three entries, each with card name, arcana type, orientation (upright or reversed), positional meaning, and interpretive text.

#### Scenario: Valid question and spread type
- **WHEN** a POST request is sent to `/readings/tarot` with a non-empty `question` and a valid `spreadType`
- **THEN** the response SHALL be HTTP 200 with `cards` containing exactly 3 entries

#### Scenario: Empty question
- **WHEN** `question` is an empty string or whitespace only
- **THEN** the response SHALL be HTTP 400

### Requirement: Each card includes name, arcana, orientation, and meaning
The system SHALL return each card with `name`, `arcana` (Major or Minor), `isReversed` (boolean), `meaning` (interpretation for the orientation), and `positionMeaning` (the role of this card in the spread, e.g., Past, Present, Future).

#### Scenario: Card structure
- **WHEN** a valid `/readings/tarot` response is received
- **THEN** each entry in `cards` SHALL contain `name`, `arcana`, `isReversed`, `meaning`, and `positionMeaning`

#### Scenario: Arcana values
- **WHEN** a valid `/readings/tarot` response is received
- **THEN** each `cards[n].arcana` SHALL be one of `["Major","Minor"]`

### Requirement: Cards drawn are unique within a single reading
The system SHALL not repeat the same card in a single reading.

#### Scenario: No duplicate cards
- **WHEN** a valid `/readings/tarot` response is received
- **THEN** all three `cards[n].name` values SHALL be distinct strings
