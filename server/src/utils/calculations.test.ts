import { describe, it, expect } from "vitest";
import {
  calculateWPM,
  calculateAccuracy,
  calculateEfficientWPM,
} from "./calculations.js";

describe("calculateAccuracy", () => {
  it("calculates accuracy", () => {
    expect(
      calculateAccuracy(
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
      )
    ).toBe(1);

    expect(
      calculateAccuracy(
        ["b", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
      )
    ).toBe(0.9);

    expect(
      calculateAccuracy(
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        ["a", "b", "i", "d", "e", "f", "g", "h", "i", "i"]
      )
    ).toBe(0.8);

    expect(
      calculateAccuracy(
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        ["as", "ba", "ac", "da", "ea", "af", "ag", "ah", "ai", "ai"]
      )
    ).toBe(0);

    expect(
      calculateAccuracy(
        ["as", "ba", "ac", "da", "ea", "af", "ag", "ah", "ai", "ai"],
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
      )
    ).toBe(0);
  });

  it("throws error when arrays length do not match", () => {
    expect(() => calculateAccuracy(["a", "b"], ["a", "b", "c"])).toThrow(
      "Array length mismatch"
    );
    expect(() => calculateAccuracy(["a", "b", "c"], ["a", "b"])).toThrow(
      "Array length mismatch"
    );
  });

  it("throws error when correctAnswers is empty", () => {
    expect(() => calculateAccuracy([], [])).toThrow("Correct Answers is Empty");
  });
});

describe("calculateWPM", () => {
  it("calculates and rounds WPM to nearest integer", () => {

    expect(calculateWPM(250, 45)).toBe(333);
  });

  it("rounds up correctly", () => {

    expect(calculateWPM(251, 45)).toBe(335);
  });

  it("handles whole number results correctly", () => {
    expect(calculateWPM(249, 45)).toBe(332);
  });

  it("returns 36 for 60 words in 100 seconds", () => {
    expect(calculateWPM(60, 100)).toBe(36);
  });

  it("returns 0 when reading time is 0", () => {
    expect(calculateWPM(300, 0)).toBe(0);
  });

  it("returns 0 when reading time is negative", () => {
    expect(calculateWPM(300, -5)).toBe(0);
  });
});

describe("calculateEfficientWPM", () => {
  it("keeps full wpm for accuracy >= 0.85", () => {
    expect(calculateEfficientWPM(250, 0.9)).toBe(250);
    expect(calculateEfficientWPM(250, 0.85)).toBe(250);
  });

  it("applies 0.9 multiplier for accuracy between 0.7 and 0.849...", () => {
    expect(calculateEfficientWPM(250, 0.75)).toBe(225);
    expect(calculateEfficientWPM(250, 0.7)).toBe(225);
  });

  it("applies 0.8 multiplier for accuracy between 0.5 and 0.699...", () => {
    expect(calculateEfficientWPM(250, 0.6)).toBe(200);
    expect(calculateEfficientWPM(250, 0.5)).toBe(200);
  });

  it("applies 0.7 multiplier for accuracy below 0.5", () => {
    expect(calculateEfficientWPM(250, 0.4)).toBe(175);
    expect(calculateEfficientWPM(250, 0.49)).toBe(175);
  });

  it("rounds result to nearest integer", () => {
    expect(calculateEfficientWPM(333, 0.75)).toBe(300); 
  });
});