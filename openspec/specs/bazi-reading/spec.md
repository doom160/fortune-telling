## ADDED Requirements

### Requirement: Client can request a BaZi birth chart
The system SHALL compute a four-pillar BaZi (八字) birth chart when given date of birth, optional birth time, gender, and timezone. The response SHALL include all four pillars (year, month, day, hour), the Day Master, element distribution counts, dominant and weak elements, decade luck pillars, annual luck pillars, and a textual interpretation array.

#### Scenario: Full input with birth time
- **WHEN** a POST request is sent to `/readings/bazi` with `birthDate`, `birthTime`, `gender`, and `timeZone`
- **THEN** the response SHALL be HTTP 200 with a `BaziChart` object containing non-null `hourPillar`, `luckPillars`, and `interpretation`

#### Scenario: Partial input without birth time
- **WHEN** a POST request is sent to `/readings/bazi` with `birthDate`, `gender`, and `timeZone` but no `birthTime`
- **THEN** the response SHALL be HTTP 200 with `hourPillar` omitted and `isHourEstimated` set to `true`

#### Scenario: Invalid date format
- **WHEN** a POST request is sent to `/readings/bazi` with `birthDate` not matching `yyyy-MM-dd`
- **THEN** the response SHALL be HTTP 400 with an error message describing the invalid field

#### Scenario: Missing required field
- **WHEN** a POST request is sent to `/readings/bazi` without `birthDate`
- **THEN** the response SHALL be HTTP 400

### Requirement: Each pillar contains stem and branch with element and polarity
The system SHALL return each pillar as an object with a `stem` (HeavenlyStem) and `branch` (EarthlyBranch). Both SHALL include `chinese`, `pinyin`, `element` (one of Wood/Fire/Earth/Metal/Water), and `polarity` (Yang or Yin).

#### Scenario: Year pillar structure
- **WHEN** a valid `/readings/bazi` response is received
- **THEN** `yearPillar.stem.element` SHALL be one of `["Wood","Fire","Earth","Metal","Water"]` and `yearPillar.branch.polarity` SHALL be one of `["Yang","Yin"]`

### Requirement: Luck pillars cover the full lifespan in decade intervals
The system SHALL return `luckPillars` as an array of decade-interval entries each containing `ageStart`, `ageEnd`, `yearRange`, and a `pillar` with stem and branch.

#### Scenario: Luck pillar count
- **WHEN** a valid `/readings/bazi` response is received
- **THEN** `luckPillars` SHALL contain at least 8 entries covering consecutive decade ranges starting from the birth decade

### Requirement: Element counts sum to total pillar count
The system SHALL return `elementCounts` as an object with five keys (Wood, Fire, Earth, Metal, Water) whose values sum to the total number of stems and branches in the chart (8 for a full chart with hour pillar).

#### Scenario: Element count totals
- **WHEN** a full (with birth time) `/readings/bazi` response is received
- **THEN** the sum of all values in `elementCounts` SHALL equal 8
