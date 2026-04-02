import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../index.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

vi.mock("../middleware/requireAuth", () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

vi.mock("../middleware/requireBaseline", () => ({
  default: (_req: any, _res: any, next: any) => {
    next();
  },
}));

vi.mock("../lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    rpc: vi.fn(),
  },
}));

describe("GET /api/stats/heatmap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns heatmap data", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({
      data: [
        { day: "2026-04-01", total: 3 },
        { day: "2026-04-02", total: 1 },
      ],
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    });

    const res = await request(app).get("/api/stats/heatmap");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [
        { day: "2026-04-01", total: 3 },
        { day: "2026-04-02", total: 1 },
      ],
    });
  });
});