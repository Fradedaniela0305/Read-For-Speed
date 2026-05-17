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
    from: vi.fn(),
  },
}));

describe("GET /api/stats/heatmap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fills missing days with zero activity", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({
      data: [
        { day: "2026-05-15", total: 3 },
        { day: "2026-05-17", total: 1 },
      ],
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    });

    const res = await request(app).get("/api/stats/heatmap");

    expect(res.status).toBe(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        { day: "2026-05-15", total: 3 },
        { day: "2026-05-16", total: 0 },
        { day: "2026-05-17", total: 1 },
      ])
    );
  });
});


describe("GET /api/stats/graph", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the last 5 progress test attempts from oldest to newest", async () => {
    const mockLimit = vi.fn().mockResolvedValue({
      data: [
        {
          id: "attempt-5",
          effective_wpm: 250,
          created_at: "2026-05-17T10:00:00Z",
        },
        {
          id: "attempt-4",
          effective_wpm: 230,
          created_at: "2026-05-16T10:00:00Z",
        },
      ],
      error: null,
    });

    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }));

    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }));

    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }));

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: mockSelect,
    } as any);

    const res = await request(app).get("/api/stats/graph");

    expect(res.status).toBe(200);

    expect(supabaseAdmin.from).toHaveBeenCalledWith("progress_test_attempts");
    expect(mockSelect).toHaveBeenCalledWith("id, effective_wpm, created_at");
    expect(mockEq).toHaveBeenCalledWith("user_id", "user-123");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(5);

    expect(res.body).toEqual({
      data: [
        {
          id: "attempt-4",
          effective_wpm: 230,
          created_at: "2026-05-16T10:00:00Z",
        },
        {
          id: "attempt-5",
          effective_wpm: 250,
          created_at: "2026-05-17T10:00:00Z",
        },
      ],
    });
  });

  it("returns 500 when Supabase returns an error", async () => {
    const mockLimit = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }));

    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }));

    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }));

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: mockSelect,
    } as any);

    const res = await request(app).get("/api/stats/graph");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Database error",
    });
  });
});



