import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../middleware/requireAuth.js", () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

vi.mock("../middleware/requireBaseline.js", () => ({
  default: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../middleware/requireTrainingElegibility.js", () => ({
  default: (_req: any, _res: any, next: any) => next(),
}));

const {
  singleMock,
  limitMock,
  notMock,
  selectMock,
  fromMock,
} = vi.hoisted(() => {
  return {
    singleMock: vi.fn(),
    limitMock: vi.fn(),
    notMock: vi.fn(),
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

describe("GET /api/progress/fetch", () => {
  it("returns an available progress test the user has not taken", async () => {
    singleMock.mockResolvedValue({
      data: {
        id: "test-1",
        title: "The Silent Forest",
        passage_text: "The forest was unusually quiet that morning...",
        word_count: 82,
      },
      error: null,
    });

    limitMock.mockReturnValue({ single: singleMock });
    notMock.mockReturnValue({ limit: limitMock });
    selectMock.mockReturnValue({ not: notMock });
    fromMock.mockReturnValue({ select: selectMock });

    const res = await request(app).get("/api/progress/fetch");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "test-1",
      title: "The Silent Forest",
      passage_text: "The forest was unusually quiet that morning...",
      word_count: 82,
    });

    expect(fromMock).toHaveBeenCalledWith("progress_tests");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(notMock).toHaveBeenCalled();
    expect(limitMock).toHaveBeenCalledWith(1);
  });

  it("returns 404 if no progress tests remain", async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: null,
    });

    limitMock.mockReturnValue({ single: singleMock });
    notMock.mockReturnValue({ limit: limitMock });
    selectMock.mockReturnValue({ not: notMock });
    fromMock.mockReturnValue({ select: selectMock });

    const res = await request(app).get("/api/progress/fetch");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "No progress tests remaining",
    });
  });

  it("returns 500 if the database query fails", async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: { message: "Database exploded" },
    });

    limitMock.mockReturnValue({ single: singleMock });
    notMock.mockReturnValue({ limit: limitMock });
    selectMock.mockReturnValue({ not: notMock });
    fromMock.mockReturnValue({ select: selectMock });

    const res = await request(app).get("/api/progress/fetch");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Failed to fetch progress test",
    });
  });
});