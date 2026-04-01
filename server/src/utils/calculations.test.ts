// src/utils/baselineMetrics.test.ts
import { describe, it, expect } from "vitest";
import {
    calculateWPM,
    calculateAccuracy,
    calculateEffectiveWPM,
} from "./calculations.js";

describe("calculateAccuracy", () => {

    it("calculates accuracy", () => {
        expect(calculateAccuracy(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"], ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])).toBe(1);
        expect(calculateAccuracy(["b", "b", "c", "d", "e", "f", "g", "h", "i", "j"], ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])).toBe(0.9);
        expect(calculateAccuracy(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"], ["a", "b", "i", "d", "e", "f", "g", "h", "i", "i"])).toBe(0.8);
        expect(calculateAccuracy(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"], ["as", "ba", "ac", "da", "ea", "af", "ag", "ah", "ai", "ai"])).toBe(0);
        expect(calculateAccuracy(["as", "ba", "ac", "da", "ea", "af", "ag", "ah", "ai", "ai"], ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])).toBe(0);
    });

    it("throws error when arrays length do not match", () => {
        expect(() => calculateAccuracy(["a", "b"], ["a", "b", "c"])).toThrow("Array length mismatch");
        expect(() => calculateAccuracy(["a", "b", "c"], ["a", "b"])).toThrow("Array length mismatch");
    });
});

describe("calculateWPM", () => {

  it("calculates and rounds WPM to 2 decimal places", () => {
    // 250 words in 45 seconds -> 333.333...
    const result = calculateWPM(250, 45);

    expect(result).toBe(333.33); // rounded
  });

  it("rounds up correctly", () => {
    // 251 words in 45 seconds -> 334.666...
    const result = calculateWPM(251, 45);

    expect(result).toBe(334.67);
  });

  it("rounds down correctly", () => {
    // 249 words in 45 seconds -> 332.0
    const result = calculateWPM(249, 45);

    expect(result).toBe(332);
  });

  it("still handles integer results correctly", () => {
    expect(calculateWPM(60, 100)).toBe(36);
  });

  it("returns 0 when reading time is 0", () => {
    expect(calculateWPM(300, 0)).toBe(0);
  });

});

describe("calculateEffectiveWPM", () => {
    it("keeps full wpm for high accuracy", () => {
        expect(calculateEffectiveWPM(250, 0.9)).toBe(250);
    });

    it("applies 0.9 multiplier for medium-high accuracy", () => {
        expect(calculateEffectiveWPM(250, 0.75)).toBe(225);
    });

    it("applies 0.8 multiplier for medium accuracy", () => {
        expect(calculateEffectiveWPM(250, 0.6)).toBe(200);
    });

    it("applies 0.7 multiplier for low accuracy", () => {
        expect(calculateEffectiveWPM(250, 0.4)).toBe(175);
    });
});