## ADDED Requirements

### Requirement: Client can request a Western natal chart
The system SHALL compute a Western astrology natal chart when given date of birth, birth time, and birth city. The response SHALL include planet placements, house cusps, aspect grid, and a textual interpretation array.

#### Scenario: Valid input with city
- **WHEN** a POST request is sent to `/readings/astrology` with `birthDate`, `birthTime`, and `birthCity`
- **THEN** the response SHALL be HTTP 200 with `planets`, `houses`, `aspects`, and `interpretation`

#### Scenario: Unknown city
- **WHEN** `birthCity` does not match any geocoded city in the database
- **THEN** the response SHALL be HTTP 422 with an error indicating the city could not be resolved

#### Scenario: Missing birth time
- **WHEN** `birthTime` is absent
- **THEN** the response SHALL be HTTP 400 because house and Ascendant calculation requires a birth time

### Requirement: Planet placements include sign, house, degree, and retrograde status
The system SHALL return `planets` as an array of planet entries each with `name`, `symbol`, `sign`, `house` (1–12), `degree` (decimal degrees within sign), and `isRetrograde` (boolean).

#### Scenario: Planet structure
- **WHEN** a valid `/readings/astrology` response is received
- **THEN** each entry in `planets` SHALL contain `name`, `symbol`, `sign`, `house`, `degree`, and `isRetrograde`

#### Scenario: Degree range
- **WHEN** a valid `/readings/astrology` response is received
- **THEN** each `planets[n].degree` SHALL be a number in the range `[0, 360)`

### Requirement: Aspects include planet pair, type, orb, and nature
The system SHALL return `aspects` as an array where each entry contains `planet1`, `planet2`, `type` (conjunction, sextile, square, trine, opposition), `orb` (degrees of separation from exact), and `nature` (harmonious or challenging).

#### Scenario: Aspect structure
- **WHEN** `aspects` is non-empty in a `/readings/astrology` response
- **THEN** each aspect SHALL contain `planet1`, `planet2`, `type`, `orb`, and `nature`

#### Scenario: Aspect type values
- **WHEN** a valid `/readings/astrology` response is received
- **THEN** each `aspects[n].type` SHALL be one of `["conjunction","sextile","square","trine","opposition"]`

### Requirement: House cusps cover all 12 houses
The system SHALL return `houses` as an array of exactly 12 entries each with `number` (1–12), `sign`, and `degree`.

#### Scenario: House count
- **WHEN** a valid `/readings/astrology` response is received
- **THEN** `houses` SHALL contain exactly 12 entries with unique `number` values from 1 to 12
