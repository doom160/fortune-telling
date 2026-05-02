import { describe, it, expect } from "vitest";
import {
  synthesiseGroup,
  getYearAnimal,
  getYearRelationshipPolarity,
  type NormalisedSignal,
} from "@/lib/synthesis";

// ─── synthesiseGroup ─────────────────────────────────────────────────────────

describe("synthesiseGroup", () => {
  it("returns confidenceScore 1.0 when all systems agree on a tag", () => {
    const signals: Record<string, NormalisedSignal[]> = {
      guanyin: [{ class: "polarity", tag: "auspicious", system: "guanyin" }],
      qmdj: [{ class: "polarity", tag: "auspicious", system: "qmdj" }],
      tarot: [{ class: "polarity", tag: "auspicious", system: "tarot" }],
    };
    const { themes } = synthesiseGroup(signals, 3);
    const match = themes.find((t) => t.class === "polarity" && t.tag === "auspicious");
    expect(match).toBeDefined();
    expect(match!.confidenceScore).toBe(1.0);
    expect(match!.systems).toHaveLength(3);
  });

  it("returns confidenceScore 0.67 when two of three systems agree", () => {
    const signals: Record<string, NormalisedSignal[]> = {
      guanyin: [{ class: "polarity", tag: "auspicious", system: "guanyin" }],
      qmdj: [{ class: "polarity", tag: "caution", system: "qmdj" }],
      tarot: [{ class: "polarity", tag: "auspicious", system: "tarot" }],
    };
    const { themes } = synthesiseGroup(signals, 3);
    const match = themes.find((t) => t.class === "polarity" && t.tag === "auspicious");
    expect(match!.confidenceScore).toBe(0.67);
  });

  it("returns confidenceScore ≤ 0.33 when no two systems agree", () => {
    const signals: Record<string, NormalisedSignal[]> = {
      guanyin: [{ class: "polarity", tag: "auspicious", system: "guanyin" }],
      qmdj: [{ class: "polarity", tag: "caution", system: "qmdj" }],
      tarot: [{ class: "polarity", tag: "mixed", system: "tarot" }],
    };
    const { themes } = synthesiseGroup(signals, 3);
    for (const theme of themes.filter((t) => t.class === "polarity")) {
      expect(theme.confidenceScore).toBeLessThanOrEqual(0.34);
    }
  });

  it("sorts themes descending by confidenceScore", () => {
    const signals: Record<string, NormalisedSignal[]> = {
      guanyin: [
        { class: "polarity", tag: "auspicious", system: "guanyin" },
        { class: "domain", tag: "career", system: "guanyin" },
      ],
      qmdj: [
        { class: "polarity", tag: "auspicious", system: "qmdj" },
      ],
      tarot: [
        { class: "polarity", tag: "auspicious", system: "tarot" },
        { class: "domain", tag: "career", system: "tarot" },
      ],
    };
    const { themes } = synthesiseGroup(signals, 3);
    for (let i = 1; i < themes.length; i++) {
      expect(themes[i - 1].confidenceScore).toBeGreaterThanOrEqual(themes[i].confidenceScore);
    }
  });

  it("does not count a system more than once per tag", () => {
    const signals: Record<string, NormalisedSignal[]> = {
      guanyin: [
        { class: "polarity", tag: "auspicious", system: "guanyin" },
        { class: "polarity", tag: "auspicious", system: "guanyin" }, // duplicate
      ],
      qmdj: [{ class: "polarity", tag: "auspicious", system: "qmdj" }],
    };
    const { themes } = synthesiseGroup(signals, 3);
    const match = themes.find((t) => t.class === "polarity" && t.tag === "auspicious");
    expect(match!.systems).toHaveLength(2); // not 3
    expect(match!.confidenceScore).toBe(0.67);
  });
});

// ─── getYearAnimal ───────────────────────────────────────────────────────────

describe("getYearAnimal", () => {
  const cases: [number, string][] = [
    [2023, "Rabbit"],
    [2024, "Dragon"],
    [2025, "Snake"],
    [2026, "Horse"],
    [2020, "Rat"],
    [2019, "Pig"],
  ];

  it.each(cases)("year %i → %s", (year: number, expected: string) => {
    const animal = getYearAnimal(year);
    expect(animal.english).toBe(expected);
  });
});

// ─── getYearRelationshipPolarity ─────────────────────────────────────────────

describe("getYearRelationshipPolarity", () => {
  it("returns auspicious for a compatible pairing", () => {
    // Rat (0) is compatible with Dragon (4)
    expect(getYearRelationshipPolarity(0, 4)).toBe("auspicious");
  });

  it("returns caution for an incompatible pairing", () => {
    // Rat (0) is incompatible with Horse (6)
    expect(getYearRelationshipPolarity(0, 6)).toBe("caution");
  });

  it("returns mixed for a neutral pairing", () => {
    // Rat (0) vs Tiger (2) — neither compatible nor incompatible
    expect(getYearRelationshipPolarity(0, 2)).toBe("mixed");
  });
});
