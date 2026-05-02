## ADDED Requirements

### Requirement: Client can request a Zi Wei Dou Shu chart
The system SHALL compute a Zi Wei Dou Shu (紫微斗數) Purple Star Astrology chart when given date of birth, birth time, gender, timezone, and calendar type. The response SHALL include 12 palaces with their stars, the destiny and body palaces, the main star, five-element score, decade luck pillars, solar date, true solar date, and a textual interpretation array.

#### Scenario: Valid solar calendar input
- **WHEN** a POST request is sent to `/readings/ziwei` with `birthDate`, `birthTime`, `gender`, `timeZone`, and `calendar` set to `"solar"`
- **THEN** the response SHALL be HTTP 200 with `palaces` containing exactly 12 entries

#### Scenario: Valid lunar calendar input
- **WHEN** a POST request is sent to `/readings/ziwei` with `calendar` set to `"lunar"` and all other required fields
- **THEN** the response SHALL be HTTP 200 with the chart computed from the lunar date input

#### Scenario: Missing birth time
- **WHEN** a POST request is sent to `/readings/ziwei` without `birthTime`
- **THEN** the response SHALL be HTTP 400 because birth time is required for Zi Wei chart hour palace assignment

### Requirement: Each palace contains a name and an array of stars
The system SHALL return each palace as an object with `name` (Chinese), `index` (0–11), `isDestiny`, `isBody`, and a `stars` array. Each star SHALL include `key`, `name`, `abbrName`, `type`, and an optional `transformation` field.

#### Scenario: Palace star structure
- **WHEN** a valid `/readings/ziwei` response is received
- **THEN** each entry in `palaces[n].stars` SHALL contain `key`, `name`, `type`, and `abbrName`

#### Scenario: Exactly one destiny palace
- **WHEN** a valid `/readings/ziwei` response is received
- **THEN** exactly one palace SHALL have `isDestiny: true`

### Requirement: Star transformation is one of four classical values when present
The system SHALL set the optional `transformation` field on a star to one of `化祿` (lu), `化權` (quan), `化科` (ke), or `化忌` (ji) when applicable, and omit the field otherwise.

#### Scenario: Transformation values
- **WHEN** a star in the `/readings/ziwei` response has a `transformation` field
- **THEN** its value SHALL be one of `["化祿","化權","化科","化忌"]`
