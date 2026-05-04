## ADDED Requirements

### Requirement: The API exposes a unified cross-system reading endpoint at /readings/unified
The system SHALL provide a `POST /readings/unified` path in the OpenAPI specification. The request body SHALL reference a `UnifiedInput` schema and the success response SHALL reference a `UnifiedResult` schema.

#### Scenario: Endpoint present in spec
- **WHEN** the OpenAPI document is parsed
- **THEN** `paths['/readings/unified']['post']` SHALL exist with operationId `createUnifiedReading`

#### Scenario: Request body schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/UnifiedInput` SHALL be defined with required properties `question` (string) and `systems` (array of strings)

#### Scenario: Response schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/UnifiedResult` SHALL be defined with required properties `perSystem` (object), `themes` (array), and `summary` (string)

#### Scenario: Theme schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/Theme` SHALL be defined with `name` (string), `description` (string), `systems` (array of strings), and `confidenceScore` (number, minimum 0, maximum 1)

#### Scenario: PerSystemSummary schema defined
- **WHEN** the OpenAPI document is parsed
- **THEN** `components/schemas/PerSystemSummary` SHALL be defined with `systemName` (string), `tradition` (enum of `Chinese`, `Western`, `East-West`), `summary` (string), and optional `skipped` (boolean) and `reason` (string)

#### Scenario: HTTP 400 response documented
- **WHEN** the OpenAPI document is parsed
- **THEN** `paths['/readings/unified']['post']['responses']['400']` SHALL reference `ErrorResponse`
