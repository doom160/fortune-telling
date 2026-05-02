## ADDED Requirements

### Requirement: Client can request a Pythagorean numerology reading
The system SHALL compute a Pythagorean numerology analysis from a full name and date of birth. The response SHALL include the four core numbers (Life Path, Expression, Soul Urge, Personality), their textual meanings, the Lo Shu grid, and detected arrows.

#### Scenario: Valid name and date
- **WHEN** a POST request is sent to `/readings/numerology` with a non-empty `fullName` and a valid `birthDate`
- **THEN** the response SHALL be HTTP 200 with `lifePathNumber`, `expressionNumber`, `soulUrgeNumber`, `personalityNumber`, and `loShuGrid`

#### Scenario: Missing full name
- **WHEN** `fullName` is absent or empty
- **THEN** the response SHALL be HTTP 400

### Requirement: Core numbers are integers between 1 and 33
The system SHALL return core numbers as positive integers. Master numbers 11, 22, and 33 SHALL not be reduced further.

#### Scenario: Life Path number range
- **WHEN** a valid `/readings/numerology` response is received
- **THEN** `lifePathNumber` SHALL be an integer in the range `[1, 33]`

### Requirement: Lo Shu grid is a 3×3 matrix of digit frequency counts
The system SHALL return `loShuGrid` as a 3×3 array where each cell contains the count of occurrences of the corresponding Lo Shu position digit (1–9) derived from the birth date digits.

#### Scenario: Grid dimensions
- **WHEN** a valid `/readings/numerology` response is received
- **THEN** `loShuGrid` SHALL be an array of 3 rows each containing 3 non-negative integers

### Requirement: Arrows identify completed rows, columns, or diagonals in the Lo Shu grid
The system SHALL include `arrows` as an array of detected complete lines in the grid. Each arrow SHALL have `name`, `direction`, and a `meaning` string.

#### Scenario: Arrow structure
- **WHEN** `arrows` is non-empty in a `/readings/numerology` response
- **THEN** each `arrows[n]` SHALL contain `name`, `direction`, and `meaning`
