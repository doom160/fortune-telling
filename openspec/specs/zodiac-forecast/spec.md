## ADDED Requirements

### Requirement: Client can request a zodiac animal profile and 28-day forecast
The system SHALL determine the Chinese zodiac animal from a date of birth using the 立春 (Lichun) solar term boundary and return a 28-day daily forecast. The response SHALL include `animal`, `zodiacYear`, and a `forecasts` array with exactly 28 entries starting from the current date.

#### Scenario: Valid date of birth
- **WHEN** a POST request is sent to `/readings/zodiac` with a valid `birthDate` in `yyyy-MM-dd` format
- **THEN** the response SHALL be HTTP 200 with `animal`, `zodiacYear` (integer), and `forecasts` containing exactly 28 entries

#### Scenario: Birth before Lichun boundary
- **WHEN** `birthDate` is in January or before the 立春 date of its year (typically Feb 3–5)
- **THEN** `zodiacYear` SHALL equal the previous calendar year and `animal` SHALL correspond to that prior zodiac cycle year

#### Scenario: Invalid date format
- **WHEN** `birthDate` does not match `yyyy-MM-dd`
- **THEN** the response SHALL be HTTP 400

### Requirement: Each forecast day includes a Day Officer and zodiac relationship
The system SHALL populate each forecast entry with `date` (yyyy-MM-dd), `dayAnimalIndex` (0–11), `officer` (DayOfficer object), `relationships` (array of relationship types), `rating`, `brief`, and `detail`.

#### Scenario: Forecast entry structure
- **WHEN** a valid `/readings/zodiac` response is received
- **THEN** each entry in `forecasts` SHALL contain `date`, `dayAnimalIndex`, `officer.chinese`, `officer.english`, `officer.nature`, `officer.suitable`, `officer.avoid`, `relationships`, `rating`, `brief`, and `detail`

#### Scenario: Rating is one of five defined values
- **WHEN** a valid `/readings/zodiac` response is received
- **THEN** each `forecasts[n].rating` SHALL be one of `["very-auspicious","auspicious","neutral","challenging","very-challenging"]`

### Requirement: Day Officer nature is one of three classical values
The system SHALL set `officer.nature` to one of `"auspicious"`, `"neutral"`, or `"inauspicious"` reflecting the traditional almanac classification of each of the 12 Day Officers (建除十二神).

#### Scenario: Officer nature values
- **WHEN** a valid `/readings/zodiac` response is received
- **THEN** each `forecasts[n].officer.nature` SHALL be one of `["auspicious","neutral","inauspicious"]`

### Requirement: Zodiac animal includes compatibility lists
The system SHALL include `compatible` and `incompatible` arrays on the `animal` object listing English animal names for harmonious and conflicting zodiac signs.

#### Scenario: Animal compatibility
- **WHEN** a valid `/readings/zodiac` response is received
- **THEN** `animal.compatible` and `animal.incompatible` SHALL each be non-empty arrays of strings
