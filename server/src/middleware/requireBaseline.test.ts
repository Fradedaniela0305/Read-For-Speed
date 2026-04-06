import { describe, it, expect, vi, beforeEach } from "vitest";
import requireBaseline from "./requireBaseline.js";

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

describe("requireBaseline middleware", () => {
  it("returns 403 if user has not completed baseline", async () => {
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

    await requireBaseline(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Baseline test required before accessing this resource.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 if profile data is missing", async () => {
    singleMock.mockResolvedValue({
      data: null,
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

    await requireBaseline(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Baseline test required before accessing this resource.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if user has completed baseline", async () => {
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

    await requireBaseline(req, res, next);

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

    await requireBaseline(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database failed",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 500 if an unexpected error happens", async () => {
    fromMock.mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req: any = {
      user: { id: "user-123" },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireBaseline(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Server error.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});