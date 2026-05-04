## ADDED Requirements

### Requirement: The API exposes an I Ching reading endpoint at /readings/iching
The system SHALL provide a `POST /readings/iching` path in the OpenAPI specification. The request body SHALL reference an `IChingInput` schema and the success response SHALL reference an `IChingResult` schema.

#### Scenario: Endpoint present in spec
- **WHEN** the OpenAPI document is parsed
- **THEN** `paths['/readings/iching']['post']` SHALL exist with operationId `createIChingReading`

#### Scenario: Request body schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/IChingInput` SHALL be defined with optional `question` (string)

#### Scenario: Response schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/IChingResult` SHALL be defined with required properties `primaryHexagram` (object), `changingLines` (array of integers), `resultingHexagram` (object or null), and `interpretation` (array of strings)

#### Scenario: Hexagram schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/IChingHexagram` SHALL be defined with `number` (integer, 1–64), `nameZh` (string), `namePinyin` (string), `nameEn` (string), `lines` (array of 6 integers, each 0 or 1), and `judgment` (string)

#### Scenario: HTTP 400 response documented
- **WHEN** the OpenAPI document is parsed
- **THEN** `paths['/readings/iching']['post']['responses']['400']` SHALL reference `ErrorResponse`
