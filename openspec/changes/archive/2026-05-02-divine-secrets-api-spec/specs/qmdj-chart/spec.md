## ADDED Requirements

### Requirement: Client can generate a Qi Men Dun Jia nine-palace chart
The system SHALL compute a Qi Men Dun Jia (奇門遁甲) divination chart for a given datetime and mode. The response SHALL include a `palaces` array of 9 entries (one per palace), a `formations` array of detected classical formations, and a textual `interpretation` array.

#### Scenario: Now mode
- **WHEN** a POST request is sent to `/readings/qmdj` with `mode` set to `"now"` and no `datetime`
- **THEN** the response SHALL be HTTP 200 computed using the current server datetime, with `palaces` containing exactly 9 entries

#### Scenario: Question mode with explicit datetime
- **WHEN** a POST request is sent to `/readings/qmdj` with `mode` set to `"question"` and a valid ISO 8601 `datetime`
- **THEN** the response SHALL be HTTP 200 computed from the provided `datetime`

#### Scenario: Invalid datetime format
- **WHEN** `datetime` is provided but is not a valid ISO 8601 string
- **THEN** the response SHALL be HTTP 400

### Requirement: Each palace contains a heavenly stem, gate, star, and deity
The system SHALL return each palace with `index` (1–9), `direction`, `heavenlyStem`, `gate` (奇門 gate name), `star` (nine-star name), `deity` (eight deity name), `isAuspicious` (boolean), and `element`.

#### Scenario: Palace structure
- **WHEN** a valid `/readings/qmdj` response is received
- **THEN** each entry in `palaces` SHALL contain `index`, `direction`, `heavenlyStem`, `gate`, `star`, `deity`, and `isAuspicious`

#### Scenario: Palace index range
- **WHEN** a valid `/readings/qmdj` response is received
- **THEN** each `palaces[n].index` SHALL be an integer between 1 and 9 inclusive and all 9 values SHALL be unique

### Requirement: Detected formations include name, nature, and involved palaces
The system SHALL populate `formations` with any classical QMDJ formations detected in the chart. Each formation SHALL include `name` (Chinese), `nature` (`auspicious` or `inauspicious`), and `palaces` (array of palace indices involved).

#### Scenario: Formation nature values
- **WHEN** `formations` is non-empty in a `/readings/qmdj` response
- **THEN** each `formations[n].nature` SHALL be one of `["auspicious","inauspicious"]`
