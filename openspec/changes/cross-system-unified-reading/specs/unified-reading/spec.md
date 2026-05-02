## ADDED Requirements

### Requirement: Oracle feature is split across two separate pages with a shared hub
The system SHALL provide three routes: `/oracle` (landing hub), `/oracle/life-directions` (Life Directions Oracle), and `/oracle/life-forecast` (Life Forecast Oracle). Each page SHALL be independently accessible. BaZi Compatibility SHALL NOT appear in either oracle.

#### Scenario: Hub page links to both oracles
- **WHEN** the user visits `/oracle`
- **THEN** the page SHALL display links to both `/oracle/life-directions` and `/oracle/life-forecast` with a brief description of each

#### Scenario: Pages are independently navigable
- **WHEN** the user visits `/oracle/life-directions` directly
- **THEN** the Life Directions Oracle page SHALL render without requiring the hub page to have been visited

---

## ADDED Requirements — Life Directions Oracle (`/oracle/life-directions`)

### Requirement: Life Directions Oracle consults Guan Yin, QMDJ, and Tarot in parallel
The system SHALL pass the user's question string as input to the Guan Yin oracle, Qi Men Dun Jia, and Tarot (three-card spread) lib functions. All three SHALL run simultaneously and results SHALL be displayed as each completes.

#### Scenario: All three systems receive the same question
- **WHEN** the user submits a non-empty question
- **THEN** the Guan Yin, QMDJ, and Tarot lib functions SHALL each be called with the question string

#### Scenario: Empty question blocked
- **WHEN** the question input is empty or whitespace only
- **THEN** the submit control SHALL remain disabled

#### Scenario: Per-system results appear progressively
- **WHEN** each lib function returns its result
- **THEN** that system's result card SHALL appear without waiting for the other systems

### Requirement: Life Directions Oracle synthesis identifies overlapping guidance signals
The synthesis module SHALL extract outcome polarity, domain tags, and keyword signals from Guan Yin, QMDJ, and Tarot results, count overlaps, compute `confidenceScore = count / 3`, and produce a `themes` array sorted descending by confidence.

#### Scenario: Full agreement on polarity
- **WHEN** all three Life Directions group systems emit the same outcome polarity tag
- **THEN** that tag SHALL have `confidenceScore` of `1.00`

#### Scenario: Partial agreement on domain
- **WHEN** two of three systems emit the same domain tag
- **THEN** that tag SHALL have `confidenceScore` of `0.67`

#### Scenario: Summary threshold
- **WHEN** synthesis completes
- **THEN** the summary string SHALL include only signals with `confidenceScore >= 0.67`

---

## ADDED Requirements — Life Forecast Oracle (`/oracle/life-forecast`)

### Requirement: Life Forecast Oracle accepts birth date, time, location, and gender
The system SHALL render a birthday input form with: birth date (required), birth time (optional, required for full BaZi, Zi Wei, and Astrology accuracy), timezone selector (optional, defaults to browser timezone), gender selector (required by BaZi), and birth location — either a city lookup or manual latitude/longitude (required for Astrology; other systems use it if provided). A notice SHALL appear on BaZi, Zi Wei, and Astrology result cards when birth time was not provided. A notice SHALL appear on the Astrology result card when birth location was not provided.

#### Scenario: Birth date required
- **WHEN** the birth date field is empty
- **THEN** the submit control SHALL remain disabled

#### Scenario: Time-omitted notice shown
- **WHEN** the user submits without a birth time
- **THEN** the BaZi, Zi Wei, and Astrology result cards SHALL display a notice stating that accuracy is reduced without birth time

#### Scenario: Location-omitted notice shown
- **WHEN** the user submits without a birth location
- **THEN** the Astrology result card SHALL display a notice stating that house placements are unavailable without birth location

### Requirement: Life Forecast Oracle has two output layers: Life Profile and Luck Timeline
The system SHALL render two clearly separated sections on the Life Forecast Oracle results page:
1. **Life Profile** — static whole-life readings from all five systems (BaZi, Numerology, Zi Wei, Zodiac, Astrology), synthesised for overlapping character and life-path themes.
2. **Luck Timeline** — year-indexed readings from BaZi, Numerology, Zodiac, and Astrology (not Zi Wei) for nine target years, synthesised per year.

#### Scenario: Life Profile section present
- **WHEN** the Life Forecast Oracle results render
- **THEN** a Life Profile section SHALL display result cards for all five systems

#### Scenario: Luck Timeline section present
- **WHEN** the Life Forecast Oracle results render
- **THEN** a Luck Timeline section SHALL display a row or card for each of the nine target years

### Requirement: Life Profile synthesis runs across all five birthday systems
The synthesis module SHALL extract outcome polarity, domain tags, and keyword signals from BaZi, Numerology, Zi Wei, Zodiac, and Astrology results, with `confidenceScore = count / 5`.

#### Scenario: Zi Wei and Astrology contribute to Life Profile synthesis
- **WHEN** Life Profile synthesis runs
- **THEN** Zi Wei star natures, Astrology natal planet signs, and all other system signals SHALL be included

#### Scenario: All five agree on dominant element
- **WHEN** all five systems surface the same element keyword (e.g. "wood")
- **THEN** that keyword tag SHALL have `confidenceScore` of `1.00`

### Requirement: Luck Timeline covers nine specific target years relative to the current year
The system SHALL compute year-specific readings for years n-3, n-2, n-1, n, n+1, n+2, n+3, n+5, and n+10, where n is the current calendar year at the time the page loads. Year n+4 and n+6 through n+9 are intentionally excluded.

#### Scenario: Nine years rendered
- **WHEN** the Luck Timeline section renders
- **THEN** exactly nine year entries SHALL be present

#### Scenario: Target year set is correct
- **WHEN** the current year is 2026
- **THEN** the target years SHALL be: 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2031, 2036

### Requirement: BaZi contributes annual luck pillar data to each target year
The system SHALL look up the `AnnualLuckPillar` entry for each target year from the `BaziChart.annualLuckPillars` array by matching `entry.year`. If a target year falls outside the computed range, that year's BaZi entry SHALL be marked as unavailable.

#### Scenario: Annual pillar found
- **WHEN** a target year exists in `annualLuckPillars`
- **THEN** the year row SHALL display the pillar's stem and branch elements

#### Scenario: Annual pillar out of range
- **WHEN** a target year is outside the person's computed luck pillar range
- **THEN** the year row SHALL display "Not yet computed" for BaZi and exclude BaZi from that year's synthesis

### Requirement: Numerology contributes a personal year number to each target year
The system SHALL compute the personal year number for each target year using the formula: `reduce(sum_digits(birth_month) + sum_digits(birth_day) + sum_digits(target_year))`, mapped to the `PERSONAL_YEAR_INTERP` theme table.

#### Scenario: Personal year number computed per year
- **WHEN** the Luck Timeline runs for year 2028
- **THEN** the personal year number SHALL be computed using 2028 as the year component, not the current year

#### Scenario: Personal year theme displayed
- **WHEN** a target year's Numerology entry is computed
- **THEN** the year row SHALL display the personal year number and its theme (e.g. "Year 3 — Creative Expansion")

### Requirement: Zodiac contributes a year-animal relationship assessment to each target year
For each target year, the system SHALL determine that year's Earthly Branch animal (using the Lichun boundary logic consistent with `getAnimalFromDate`) and compute the relationship type between the person's birth animal and the year's animal using the existing relationship table (`six-harmony`, `three-harmony`, `clash`, `harm`, `punishment`, `destruction`, or `none`). This relationship SHALL be mapped to an outcome polarity signal (`auspicious` for harmony types, `caution` for clash/harm/punishment, `neutral` for none/destruction).

#### Scenario: Clash year identified
- **WHEN** the target year's animal clashes with the person's birth animal
- **THEN** the Zodiac signal for that year SHALL be `"caution"` polarity

#### Scenario: Harmony year identified
- **WHEN** the target year's animal is in six-harmony or three-harmony with the person's birth animal
- **THEN** the Zodiac signal for that year SHALL be `"auspicious"` polarity

#### Scenario: Zodiac year-animal displayed
- **WHEN** a target year's row renders
- **THEN** the year's animal name and the relationship label SHALL be visible alongside the polarity indicator

### Requirement: Astrology contributes annual transit signals to each target year
The system SHALL compute planet positions for July 1 of each target year using a `calculateTransitsForDate(natalChart, date)` helper (to be added as an exported function in `src/lib/astrology.ts`), then identify Jupiter and Saturn aspects to natal planets as the primary annual indicators. Jupiter aspects → polarity signal (`trine`/`sextile` = auspicious; `conjunction` = mixed; `square`/`opposition` = caution). Saturn aspects → polarity signal (`trine`/`sextile` = auspicious; `conjunction`/`square`/`opposition` = caution).

#### Scenario: Astrology year signal computed
- **WHEN** the Luck Timeline runs for a target year
- **THEN** Jupiter and Saturn transit aspects to the natal chart SHALL be computed for July 1 of that year

#### Scenario: Astrology year signal absent when location missing
- **WHEN** the user did not provide a birth location
- **THEN** Astrology SHALL be excluded from Luck Timeline synthesis for all years and the Luck Timeline group size SHALL be 3 (BaZi + Numerology + Zodiac)

### Requirement: Zi Wei is excluded from per-year Luck Timeline synthesis
Zi Wei SHALL participate in Life Profile synthesis only. Per-year Luck Timeline synthesis runs across BaZi, Numerology, Zodiac, and Astrology (group size = 4 when location is provided, or 3 when location is absent), so `confidenceScore = count / groupSize` for all year-level themes.

#### Scenario: Zi Wei absent from Luck Timeline synthesis
- **WHEN** per-year synthesis runs for any target year
- **THEN** Zi Wei signals SHALL NOT be included and SHALL NOT affect confidence scores

#### Scenario: Zi Wei participation scope shown in UI
- **WHEN** the Life Forecast Oracle results render
- **THEN** the Zi Wei result card SHALL be clearly labelled as "Life Profile only"

### Requirement: Per-year synthesis produces a themes array and summary for each target year
For each of the nine target years, the synthesis module SHALL collect one signal per participating system (BaZi pillar element polarity, Numerology personal year polarity, Zodiac relationship polarity), find overlaps, and produce a `YearSynthesis` object with `year`, `themes[]`, `summary`, and `overallPolarity`.

#### Scenario: Year synthesis structure
- **WHEN** per-year synthesis runs
- **THEN** each `YearSynthesis` SHALL contain `year` (number), `themes` (array), `summary` (string), `overallPolarity` (`"auspicious"` | `"mixed"` | `"caution"`), and `groupSize` (number)

#### Scenario: Overall polarity when three of four agree
- **WHEN** three of four Luck Timeline systems agree on `"caution"` for a year
- **THEN** `overallPolarity` for that year SHALL be `"caution"` and `confidenceScore` SHALL be `0.75`

#### Scenario: Overall polarity when two of four agree
- **WHEN** two of four systems agree on `"auspicious"` and two agree on `"caution"`
- **THEN** `overallPolarity` SHALL be `"mixed"`

---

## ADDED Requirements — Shared Synthesis Engine

### Requirement: Signal extraction operates only on typed fields
The synthesis module SHALL extract signals from named typed fields only (enum values, number ranges, arrays of known strings). It SHALL NOT perform free-text tokenisation on interpretation string arrays.

#### Scenario: Deterministic extraction
- **WHEN** the same system result object is passed to the signal extractor twice
- **THEN** the extracted signals SHALL be identical both times

### Requirement: System identifiers are limited to the eight participating systems
The Life Directions Oracle SHALL use exactly `guanyin`, `qmdj`, `tarot`. The Life Forecast Oracle SHALL use exactly `bazi`, `numerology`, `ziwei`, `zodiac`, `astrology`. The identifier `bazi-compatibility` SHALL NOT be valid in this feature.

#### Scenario: Life Directions group membership fixed
- **WHEN** the Life Directions Oracle runs
- **THEN** exactly `guanyin`, `qmdj`, and `tarot` SHALL participate

#### Scenario: Life Forecast group membership fixed
- **WHEN** the Life Forecast Oracle runs
- **THEN** exactly `bazi`, `numerology`, `ziwei`, `zodiac`, and `astrology` SHALL participate; Astrology's contribution to Luck Timeline is conditional on birth location being provided

#### Scenario: bazi-compatibility absent
- **WHEN** either oracle page renders
- **THEN** no UI element for BaZi Compatibility SHALL be present
