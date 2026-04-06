import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../middleware/requireAuth.js", () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

vi.mock("../middleware/preventBaselineRetake.js", () => ({
  default: (_req: any, _res: any, next: any) => next(),
}));

const { maybeSingleMock, eqMock, updateMock, selectMock, fromMock } = vi.hoisted(() => {
  return {
    maybeSingleMock: vi.fn(),
    eqMock: vi.fn(),
    updateMock: vi.fn(),
    selectMock: vi.fn(),
    fromMock: vi.fn(),
  };
});

vi.mock("../lib/supabaseAdmin.js", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
}));

import app from "../index.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/baseline/test - success", () => {
  it("returns baseline test data", async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 1,
        passage_text: "Test passage",
        word_count: 100,
      },
      error: null,
    });

    selectMock.mockReturnValue({
      maybeSingle: maybeSingleMock,
    });

    fromMock.mockReturnValue({
      select: selectMock,
    });

    const res = await request(app).get("/api/baseline/test");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      passage_text: "Test passage",
      word_count: 100,
    });
  });
});

describe("POST /api/baseline/submit", () => {
  it("returns calculated metrics and updates the profile", async () => {
    eqMock.mockResolvedValue({
      error: null,
    });

    updateMock.mockReturnValue({
      eq: eqMock,
    });

    fromMock.mockReturnValue({
      update: updateMock,
    });

    const res = await request(app)
      .post("/api/baseline/submit")
      .send({
        baselineTestId: 1,
        answers: ["A", "B", "C"],
        correctAnswers: ["A", "B", "C"],
        readingTimeSeconds: 60,
        wordCount: 120,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      wpm: 120,
      accuracy: 1,
      efficientWPM: 120,
    });

    expect(updateMock).toHaveBeenCalledWith({
      has_completed_baseline: true,
      wpm: 120,
      accuracy: 1,
      efficient_wpm: 120,
    });

    expect(eqMock).toHaveBeenCalledWith("id", "user-123");
  });

  it("returns 500 if profile update fails", async () => {
    eqMock.mockResolvedValue({
      error: { message: "Update failed" },
    });

    updateMock.mockReturnValue({
      eq: eqMock,
    });

    fromMock.mockReturnValue({
      update: updateMock,
    });

    const res = await request(app)
      .post("/api/baseline/submit")
      .send({
        baselineTestId: 1,
        answers: ["A", "B", "C"],
        correctAnswers: ["A", "B", "C"],
        readingTimeSeconds: 60,
        wordCount: 120,
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Update failed",
    });
  });
});