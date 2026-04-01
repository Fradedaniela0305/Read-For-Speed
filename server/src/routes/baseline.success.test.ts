import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../middleware/requireAuth.js", () => ({
  default: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../middleware/preventBaselineRetake.js", () => ({
  default: (_req: any, _res: any, next: any) => next(),
}));


const maybeSingleMock = vi.fn();

vi.mock("../lib/supabaseAdmin.js", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        maybeSingle: maybeSingleMock,
      }),
    }),
  },
}));

import app from "../index.js";

describe("GET /api/baseline/test - success", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns baseline test data", async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 1,
        passage_text: "Test passage",
        word_count: 100,
      },
      error: null,
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
  it("returns calculated metrics", async () => {
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
    expect(res.body).toHaveProperty("wpm");
    expect(res.body).toHaveProperty("accuracy");
    expect(res.body).toHaveProperty("effectiveWPM");
  });
});