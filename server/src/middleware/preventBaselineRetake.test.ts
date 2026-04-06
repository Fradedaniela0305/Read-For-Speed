import { describe, it, expect, vi, beforeEach } from "vitest";
import preventBaselineRetake from "./preventBaselineRetake.js";

const { singleMock, eqMock, selectMock, fromMock } = vi.hoisted(() => {
  return {
    singleMock: vi.fn(),
    eqMock: vi.fn(),
    selectMock: vi.fn(),
    fromMock: vi.fn(),
  };
});

vi.mock("../lib/supabaseAdmin.js", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("preventBaselineRetake middleware", () => {
  it("returns 403 if user already completed baseline", async () => {
    singleMock.mockResolvedValue({
      data: { has_completed_baseline: true },
      error: null,
    });

    eqMock.mockReturnValue({ single: singleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    const req: any = {
      user: { id: "user-123" },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await preventBaselineRetake(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "You have already taken the baseline test",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if user has NOT completed baseline", async () => {
    singleMock.mockResolvedValue({
      data: { has_completed_baseline: false },
      error: null,
    });

    eqMock.mockReturnValue({ single: singleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    const req: any = {
      user: { id: "user-123" },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await preventBaselineRetake(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 if Supabase returns an error", async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: { message: "Database failed" },
    });

    eqMock.mockReturnValue({ single: singleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    const req: any = {
      user: { id: "user-123" },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await preventBaselineRetake(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database failed",
    });
    expect(next).not.toHaveBeenCalled();
  });
});