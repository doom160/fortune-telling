# 神圣秘密 Divine Secrets API — OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0

info:
  title: 神圣秘密 Divine Secrets API
  version: 1.0.0
  description: >
    REST API for the 神圣秘密 Divine Secrets divination platform. Provides nine
    POST endpoints covering BaZi four-pillar astrology, BaZi compatibility,
    Zi Wei Dou Shu purple star astrology, Chinese Zodiac forecasts, Tarot,
    Qi Men Dun Jia, Pythagorean Numerology, Western Astrology, and
    Guan Yin Oracle readings.

servers:
  - url: https://api.divine-secrets.app/v1

paths:

  /readings/bazi:
    post:
      summary: Compute a BaZi four-pillar birth chart
      operationId: createBaziReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BaziInput'
      responses:
        '200':
          description: BaZi chart computed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BaziChart'
        '400':
          description: Missing or invalid input fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/bazi/compatibility:
    post:
      summary: Compare two BaZi charts for compatibility
      operationId: createBaziCompatibilityReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CompatInput'
      responses:
        '200':
          description: Compatibility analysis computed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CompatResult'
        '400':
          description: Missing or invalid input fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/ziwei:
    post:
      summary: Compute a Zi Wei Dou Shu 12-palace chart
      operationId: createZiweiReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ZiweiInput'
      responses:
        '200':
          description: Zi Wei chart computed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ZiweiChart'
        '400':
          description: Missing or invalid input fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/zodiac:
    post:
      summary: Return zodiac animal profile and 28-day daily forecast
      operationId: createZodiacReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - birthDate
              properties:
                birthDate:
                  type: string
                  format: date
                  description: Date of birth in yyyy-MM-dd format
      responses:
        '200':
          description: Zodiac reading computed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ZodiacReading'
        '400':
          description: Missing or invalid birthDate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/tarot:
    post:
      summary: Perform a three-card tarot spread
      operationId: createTarotReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TarotInput'
      responses:
        '200':
          description: Tarot reading performed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TarotReading'
        '400':
          description: Missing or empty question
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/qmdj:
    post:
      summary: Generate a Qi Men Dun Jia nine-palace chart
      operationId: createQmdjReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QmdjInput'
      responses:
        '200':
          description: QMDJ chart generated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QmdjChart'
        '400':
          description: Missing or invalid input fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/numerology:
    post:
      summary: Compute Pythagorean numerology core numbers and Lo Shu grid
      operationId: createNumerologyReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NumerologyInput'
      responses:
        '200':
          description: Numerology reading computed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NumerologyReading'
        '400':
          description: Missing or empty fullName or invalid birthDate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/astrology:
    post:
      summary: Calculate a Western natal chart
      operationId: createAstrologyReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AstrologyInput'
      responses:
        '200':
          description: Natal chart calculated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NatalChart'
        '400':
          description: Missing or invalid input fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '422':
          description: Birth city could not be geocoded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/guanyin:
    post:
      summary: Draw a Guan Yin oracle lot
      operationId: createGuanyinReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GuanyinInput'
      responses:
        '200':
          description: Oracle lot drawn successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GuanyinReading'
        '400':
          description: Missing or empty question
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /readings/unified:
    post:
      summary: Cross-system unified reading
      operationId: createUnifiedReading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UnifiedInput'
      responses:
        '200':
          description: Unified reading generated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UnifiedResult'
        '400':
          description: Invalid or missing required fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:

    # ── Shared primitives ────────────────────────────────────────────────────

    Element:
      type: string
      enum: [Wood, Fire, Earth, Metal, Water]
      description: One of the five classical Chinese elements

    Polarity:
      type: string
      enum: [Yang, Yin]
      description: Yin or Yang polarity

    HeavenlyStem:
      type: object
      required: [key, chinese, pinyin, element, polarity]
      properties:
        key:
          type: string
          description: Short identifier (e.g. "jiǎ")
        chinese:
          type: string
          description: Chinese character for this stem
        pinyin:
          type: string
          description: Romanised pronunciation
        element:
          $ref: '#/components/schemas/Element'
        polarity:
          $ref: '#/components/schemas/Polarity'

    EarthlyBranch:
      type: object
      required: [key, chinese, pinyin, animal, element, polarity]
      properties:
        key:
          type: string
          description: Short identifier (e.g. "zǐ")
        chinese:
          type: string
        pinyin:
          type: string
        animal:
          type: string
          description: Associated zodiac animal (e.g. "Rat")
        element:
          $ref: '#/components/schemas/Element'
        polarity:
          $ref: '#/components/schemas/Polarity'

    Pillar:
      type: object
      required: [stem, branch]
      properties:
        stem:
          $ref: '#/components/schemas/HeavenlyStem'
        branch:
          $ref: '#/components/schemas/EarthlyBranch'

    BaziInput:
      type: object
      required: [birthDate, gender, timeZone]
      properties:
        name:
          type: string
          description: Optional display name for the person
        birthDate:
          type: string
          format: date
          description: Date of birth in yyyy-MM-dd format
        birthTime:
          type: string
          pattern: '^([01]\d|2[0-3]):[0-5]\d$'
          description: Time of birth in HH:mm format
        gender:
          type: string
          enum: [male, female]
        timeZone:
          type: string
          description: IANA timezone identifier (e.g. "Asia/Shanghai")

    ErrorResponse:
      type: object
      required: [message]
      properties:
        message:
          type: string

    # ── BaZi Reading ─────────────────────────────────────────────────────────

    LuckPillar:
      type: object
      required: [ageStart, ageEnd, decade, yearRange, pillar]
      properties:
        ageStart:
          type: integer
        ageEnd:
          type: integer
        decade:
          type: integer
          description: Ordinal position in the luck pillar sequence
        yearRange:
          type: string
          description: Human-readable year range (e.g. "2025–2034")
        pillar:
          $ref: '#/components/schemas/Pillar'

    BaziChart:
      type: object
      required:
        - yearPillar
        - monthPillar
        - dayPillar
        - dayMaster
        - elementCounts
        - dominantElement
        - weakElement
        - luckPillars
        - annualLuckPillars
        - interpretation
        - isHourEstimated
      properties:
        yearPillar:
          $ref: '#/components/schemas/Pillar'
        monthPillar:
          $ref: '#/components/schemas/Pillar'
        dayPillar:
          $ref: '#/components/schemas/Pillar'
        hourPillar:
          $ref: '#/components/schemas/Pillar'
          description: Omitted when birth time is unknown
        dayMaster:
          $ref: '#/components/schemas/HeavenlyStem'
        elementCounts:
          type: object
          description: Count of stems and branches for each element (sums to 8 for full chart)
          required: [Wood, Fire, Earth, Metal, Water]
          properties:
            Wood:
              type: integer
              minimum: 0
            Fire:
              type: integer
              minimum: 0
            Earth:
              type: integer
              minimum: 0
            Metal:
              type: integer
              minimum: 0
            Water:
              type: integer
              minimum: 0
        dominantElement:
          $ref: '#/components/schemas/Element'
        weakElement:
          $ref: '#/components/schemas/Element'
        luckPillars:
          type: array
          minItems: 8
          items:
            $ref: '#/components/schemas/LuckPillar'
        annualLuckPillars:
          type: array
          items:
            $ref: '#/components/schemas/LuckPillar'
        interpretation:
          type: array
          items:
            type: string
          description: Markdown-formatted interpretation lines
        isHourEstimated:
          type: boolean
          description: True when birthTime was absent and hour pillar was estimated or omitted

    # ── BaZi Compatibility ───────────────────────────────────────────────────

    CompatInput:
      type: object
      required: [male, female]
      properties:
        male:
          $ref: '#/components/schemas/BaziInput'
        female:
          $ref: '#/components/schemas/BaziInput'

    CompatFactor:
      type: object
      required: [name, nameZh, score, maxScore, description, detail]
      properties:
        name:
          type: string
          description: English name of the compatibility dimension
        nameZh:
          type: string
          description: Chinese name of the compatibility dimension
        score:
          type: integer
          minimum: -3
          maximum: 3
        maxScore:
          type: integer
          minimum: 1
        description:
          type: string
        detail:
          type: string

    OverallRating:
      type: string
      enum: [Excellent, Good, Moderate, Challenging]

    CompatResult:
      type: object
      required:
        - maleChart
        - femaleChart
        - factors
        - totalScore
        - maxPossibleScore
        - percentage
        - overallRating
        - interpretation
      properties:
        maleChart:
          $ref: '#/components/schemas/BaziChart'
        femaleChart:
          $ref: '#/components/schemas/BaziChart'
        factors:
          type: array
          minItems: 8
          maxItems: 8
          items:
            $ref: '#/components/schemas/CompatFactor'
        totalScore:
          type: integer
        maxPossibleScore:
          type: integer
        percentage:
          type: integer
          minimum: 0
          maximum: 100
        overallRating:
          $ref: '#/components/schemas/OverallRating'
        interpretation:
          type: array
          items:
            type: string

    # ── Zi Wei Dou Shu ───────────────────────────────────────────────────────

    ZiweiStar:
      type: object
      required: [key, name, abbrName, type]
      properties:
        key:
          type: string
        name:
          type: string
          description: Full Chinese name of the star
        abbrName:
          type: string
          description: Abbreviated name
        type:
          type: string
          description: Star category (e.g. main, minor, auspicious, inauspicious)
        transformation:
          type: string
          enum: ['化祿', '化權', '化科', '化忌']
          description: Classical four-transformation marker when applicable

    ZiweiPalace:
      type: object
      required: [name, index, isDestiny, isBody, stars]
      properties:
        name:
          type: string
          description: Chinese palace name
        index:
          type: integer
          minimum: 0
          maximum: 11
        isDestiny:
          type: boolean
        isBody:
          type: boolean
        stars:
          type: array
          items:
            $ref: '#/components/schemas/ZiweiStar'

    ZiweiInput:
      type: object
      required: [birthDate, birthTime, gender, timeZone, calendar]
      properties:
        birthDate:
          type: string
          format: date
        birthTime:
          type: string
          pattern: '^([01]\d|2[0-3]):[0-5]\d$'
          description: Birth time in HH:mm format (required for palace hour assignment)
        gender:
          type: string
          enum: [male, female]
        timeZone:
          type: string
        calendar:
          type: string
          enum: [solar, lunar]

    ZiweiChart:
      type: object
      required:
        - palaces
        - destinyPalace
        - bodyPalace
        - mainStar
        - fiveElementScore
        - luckPillars
        - solarDate
        - trueSolarDate
        - interpretation
      properties:
        palaces:
          type: array
          minItems: 12
          maxItems: 12
          items:
            $ref: '#/components/schemas/ZiweiPalace'
        destinyPalace:
          type: string
          description: Name of the destiny palace
        bodyPalace:
          type: string
          description: Name of the body palace
        mainStar:
          type: string
          description: Primary main star in the destiny palace
        fiveElementScore:
          type: string
          description: Five-element score label
        luckPillars:
          type: array
          items:
            $ref: '#/components/schemas/LuckPillar'
        solarDate:
          type: string
          format: date
          description: Gregorian solar date used for calculation
        trueSolarDate:
          type: string
          format: date
          description: True solar date adjusted for longitude
        interpretation:
          type: array
          items:
            type: string

    # ── Chinese Zodiac ───────────────────────────────────────────────────────

    DayOfficer:
      type: object
      required: [chinese, english, nature, suitable, avoid, description]
      properties:
        chinese:
          type: string
        english:
          type: string
        nature:
          type: string
          enum: [auspicious, neutral, inauspicious]
        suitable:
          type: string
          description: Activities suited for this day
        avoid:
          type: string
          description: Activities to avoid on this day
        description:
          type: string

    ZodiacAnimal:
      type: object
      required: [emoji, english, chinese, element, polarity, traits, compatible, incompatible]
      properties:
        emoji:
          type: string
        english:
          type: string
        chinese:
          type: string
        element:
          $ref: '#/components/schemas/Element'
        polarity:
          $ref: '#/components/schemas/Polarity'
        traits:
          type: array
          items:
            type: string
        compatible:
          type: array
          minItems: 1
          items:
            type: string
          description: English names of harmonious zodiac animals
        incompatible:
          type: array
          minItems: 1
          items:
            type: string
          description: English names of conflicting zodiac animals

    RelationType:
      type: string
      enum: [six-harmony, three-harmony, clash, harm, punishment, destruction, none]

    DayRating:
      type: string
      enum: [very-auspicious, auspicious, neutral, challenging, very-challenging]

    DayForecast:
      type: object
      required: [date, dayAnimalIndex, officer, relationships, rating, brief, detail]
      properties:
        date:
          type: string
          format: date
        dayAnimalIndex:
          type: integer
          minimum: 0
          maximum: 11
        officer:
          $ref: '#/components/schemas/DayOfficer'
        relationships:
          type: array
          items:
            $ref: '#/components/schemas/RelationType'
        rating:
          $ref: '#/components/schemas/DayRating'
        brief:
          type: string
        detail:
          type: string

    ZodiacReading:
      type: object
      required: [animal, zodiacYear, forecasts]
      properties:
        animal:
          $ref: '#/components/schemas/ZodiacAnimal'
        zodiacYear:
          type: integer
          description: The Chinese zodiac cycle year corresponding to the birth
        forecasts:
          type: array
          minItems: 28
          maxItems: 28
          items:
            $ref: '#/components/schemas/DayForecast'

    # ── Tarot ────────────────────────────────────────────────────────────────

    SpreadType:
      type: string
      enum: [past-present-future, situation-action-outcome, mind-body-spirit]

    TarotCard:
      type: object
      required: [name, arcana, isReversed, meaning, positionMeaning]
      properties:
        name:
          type: string
        arcana:
          type: string
          enum: [Major, Minor]
        isReversed:
          type: boolean
        meaning:
          type: string
          description: Interpretation for the card's current orientation
        positionMeaning:
          type: string
          description: Role of this card in the spread (e.g. Past, Present, Future)

    TarotInput:
      type: object
      required: [question, spreadType]
      properties:
        question:
          type: string
          minLength: 1
        spreadType:
          $ref: '#/components/schemas/SpreadType'

    TarotReading:
      type: object
      required: [cards, interpretation]
      properties:
        cards:
          type: array
          minItems: 3
          maxItems: 3
          items:
            $ref: '#/components/schemas/TarotCard'
        interpretation:
          type: array
          items:
            type: string

    # ── Qi Men Dun Jia ───────────────────────────────────────────────────────

    QmdjMode:
      type: string
      enum: [now, question]

    QmdjPalace:
      type: object
      required: [index, direction, heavenlyStem, gate, star, deity, isAuspicious, element]
      properties:
        index:
          type: integer
          minimum: 1
          maximum: 9
        direction:
          type: string
          description: Compass direction of the palace (e.g. "North", "Centre")
        heavenlyStem:
          type: string
          description: Heavenly stem occupying this palace
        gate:
          type: string
          description: Qi Men gate name
        star:
          type: string
          description: Nine-star name
        deity:
          type: string
          description: Eight deity name
        isAuspicious:
          type: boolean
        element:
          $ref: '#/components/schemas/Element'

    QmdjFormation:
      type: object
      required: [name, nature, palaces]
      properties:
        name:
          type: string
          description: Chinese name of the classical formation
        nature:
          type: string
          enum: [auspicious, inauspicious]
        palaces:
          type: array
          items:
            type: integer
            minimum: 1
            maximum: 9

    QmdjInput:
      type: object
      required: [mode]
      properties:
        datetime:
          type: string
          format: date-time
          description: ISO 8601 datetime; used when mode is "question"
        mode:
          $ref: '#/components/schemas/QmdjMode'
        timeZone:
          type: string

    QmdjChart:
      type: object
      required: [palaces, formations, chartTime, interpretation]
      properties:
        palaces:
          type: array
          minItems: 9
          maxItems: 9
          items:
            $ref: '#/components/schemas/QmdjPalace'
        formations:
          type: array
          items:
            $ref: '#/components/schemas/QmdjFormation'
        chartTime:
          type: string
          format: date-time
          description: The datetime used to generate the chart
        interpretation:
          type: array
          items:
            type: string

    # ── Numerology ───────────────────────────────────────────────────────────

    NumerologyArrow:
      type: object
      required: [name, direction, meaning]
      properties:
        name:
          type: string
        direction:
          type: string
          description: The completed row, column, or diagonal (e.g. "Row of the Mind")
        meaning:
          type: string

    NumerologyInput:
      type: object
      required: [fullName, birthDate]
      properties:
        fullName:
          type: string
          minLength: 1
        birthDate:
          type: string
          format: date

    NumerologyReading:
      type: object
      required:
        - lifePathNumber
        - expressionNumber
        - soulUrgeNumber
        - personalityNumber
        - meanings
        - loShuGrid
        - arrows
        - interpretation
      properties:
        lifePathNumber:
          type: integer
          minimum: 1
          maximum: 33
        expressionNumber:
          type: integer
          minimum: 1
          maximum: 33
        soulUrgeNumber:
          type: integer
          minimum: 1
          maximum: 33
        personalityNumber:
          type: integer
          minimum: 1
          maximum: 33
        meanings:
          type: object
          description: Textual meaning for each core number
          required: [lifePathNumber, expressionNumber, soulUrgeNumber, personalityNumber]
          properties:
            lifePathNumber:
              type: string
            expressionNumber:
              type: string
            soulUrgeNumber:
              type: string
            personalityNumber:
              type: string
        loShuGrid:
          type: array
          minItems: 3
          maxItems: 3
          description: 3×3 Lo Shu grid of digit frequency counts
          items:
            type: array
            minItems: 3
            maxItems: 3
            items:
              type: integer
              minimum: 0
        arrows:
          type: array
          items:
            $ref: '#/components/schemas/NumerologyArrow'
        interpretation:
          type: array
          items:
            type: string

    # ── Western Astrology ────────────────────────────────────────────────────

    Planet:
      type: object
      required: [name, symbol, sign, house, degree, isRetrograde]
      properties:
        name:
          type: string
        symbol:
          type: string
        sign:
          type: string
        house:
          type: integer
          minimum: 1
          maximum: 12
        degree:
          type: number
          minimum: 0
          exclusiveMaximum: 360
          description: Decimal degrees within the sign
        isRetrograde:
          type: boolean

    HouseCusp:
      type: object
      required: [number, sign, degree]
      properties:
        number:
          type: integer
          minimum: 1
          maximum: 12
        sign:
          type: string
        degree:
          type: number
          minimum: 0
          exclusiveMaximum: 360

    Aspect:
      type: object
      required: [planet1, planet2, type, orb, nature]
      properties:
        planet1:
          type: string
        planet2:
          type: string
        type:
          type: string
          enum: [conjunction, sextile, square, trine, opposition]
        orb:
          type: number
          minimum: 0
          description: Degrees of separation from the exact aspect angle
        nature:
          type: string
          enum: [harmonious, challenging]

    AstrologyInput:
      type: object
      required: [birthDate, birthTime, birthCity]
      properties:
        birthDate:
          type: string
          format: date
        birthTime:
          type: string
          pattern: '^([01]\d|2[0-3]):[0-5]\d$'
        birthCity:
          type: string
          description: City name used for geocoding birth coordinates

    NatalChart:
      type: object
      required: [planets, houses, aspects, ascendant, midheaven, interpretation]
      properties:
        planets:
          type: array
          items:
            $ref: '#/components/schemas/Planet'
        houses:
          type: array
          minItems: 12
          maxItems: 12
          items:
            $ref: '#/components/schemas/HouseCusp'
        aspects:
          type: array
          items:
            $ref: '#/components/schemas/Aspect'
        ascendant:
          type: string
          description: Zodiac sign on the Ascendant (1st house cusp)
        midheaven:
          type: string
          description: Zodiac sign on the Midheaven (10th house cusp)
        interpretation:
          type: array
          items:
            type: string

    # ── Guan Yin Oracle ──────────────────────────────────────────────────────

    GuanyinInput:
      type: object
      required: [question]
      properties:
        question:
          type: string
          minLength: 1

    GuanyinReading:
      type: object
      required: [lotNumber, poem, poemTranslation, meaning, advice]
      properties:
        lotNumber:
          type: integer
          minimum: 1
          maximum: 100
        poem:
          type: string
          description: Original classical Chinese poem text
        poemTranslation:
          type: string
          description: English translation of the poem
        meaning:
          type: string
        advice:
          type: string

    # ── Unified Oracle ───────────────────────────────────────────────────────

    UnifiedInput:
      type: object
      required: [mode]
      properties:
        mode:
          type: string
          enum: [life-directions, life-forecast]
          description: >
            'life-directions' requires question field.
            'life-forecast' requires birthDate and gender.
        question:
          type: string
          minLength: 1
          description: Required for life-directions mode
        birthDate:
          type: string
          format: date
          description: Required for life-forecast mode (YYYY-MM-DD)
        birthTime:
          type: string
          pattern: '^[0-2][0-9]:[0-5][0-9]$'
          description: Optional birth time (HH:mm); improves BaZi, Zi Wei, and Astrology accuracy
        gender:
          type: string
          enum: [male, female]
          description: Required for life-forecast mode
        lat:
          type: number
          description: Birth location latitude; required for Astrology
        lng:
          type: number
          description: Birth location longitude; required for Astrology
        timeZone:
          type: string
          description: IANA timezone identifier (e.g. Asia/Singapore)

    Theme:
      type: object
      required: [class, tag, systems, confidenceScore]
      properties:
        class:
          type: string
          enum: [polarity, domain, keyword]
        tag:
          type: string
          description: Canonical signal tag (e.g. "auspicious", "career", "Wood")
        systems:
          type: array
          items:
            type: string
          description: System IDs that surfaced this theme
        confidenceScore:
          type: number
          minimum: 0
          maximum: 1
          description: Fraction of group systems that agreed on this theme

    YearSynthesis:
      type: object
      required: [year, themes, summary, overallPolarity, groupSize]
      properties:
        year:
          type: integer
        themes:
          type: array
          items:
            $ref: '#/components/schemas/Theme'
        summary:
          type: string
        overallPolarity:
          type: string
          enum: [auspicious, mixed, caution]
        groupSize:
          type: integer
          description: Number of systems contributing to this year's synthesis

    PerSystemSummary:
      type: object
      required: [systemId, status]
      properties:
        systemId:
          type: string
          description: e.g. "bazi", "tarot", "guanyin"
        status:
          type: string
          enum: [ok, error, skipped]
        summary:
          type: string
          description: Short human-readable summary from this system's reading
        errorMessage:
          type: string
          description: Present when status is "error"
        skipReason:
          type: string
          description: Present when status is "skipped"

    UnifiedResult:
      type: object
      required: [mode, systems, themes, summary]
      properties:
        mode:
          type: string
          enum: [life-directions, life-forecast]
        systems:
          type: array
          items:
            $ref: '#/components/schemas/PerSystemSummary'
        themes:
          type: array
          items:
            $ref: '#/components/schemas/Theme'
          description: Life Profile synthesis themes (life-forecast mode) or Life Directions synthesis themes
        summary:
          type: string
          description: Synthesised directed summary string
        luckTimeline:
          type: array
          items:
            $ref: '#/components/schemas/YearSynthesis'
          description: Nine-year luck timeline (life-forecast mode only)
```
