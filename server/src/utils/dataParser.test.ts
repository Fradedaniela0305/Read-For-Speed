import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fillHeatmapDates } from "./dataParser.js";

describe("fillHeatmapDates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fills 30 days before today and 30 days after today", () => {
    const result = fillHeatmapDates([
      { day: "2026-05-17", total: 6 },
    ]);

    expect(result).toHaveLength(61);
    expect(result[0]).toEqual({ day: "2026-04-17", total: 0 });
    expect(result[30]).toEqual({ day: "2026-05-17", total: 6 });
    expect(result[60]).toEqual({ day: "2026-06-16", total: 0 });
  });

  it("preserves activity totals and fills missing days with zero", () => {
    const result = fillHeatmapDates([
      { day: "2026-05-16", total: 2 },
      { day: "2026-05-18", total: 4 },
    ]);

    expect(result).toContainEqual({ day: "2026-05-16", total: 2 });
    expect(result).toContainEqual({ day: "2026-05-17", total: 0 });
    expect(result).toContainEqual({ day: "2026-05-18", total: 4 });
  });

  it("returns all zero totals when data is empty", () => {
    const result = fillHeatmapDates([]);

    expect(result).toHaveLength(61);
    expect(result.every((item) => item.total === 0)).toBe(true);
  });
});