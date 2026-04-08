import { describe, it, expect, vi, beforeEach } from "vitest";
import requireTrainingEligibility from "./requireTrainingElegibility.js";

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

describe("requireTrainingEligibility middleware", () => {
  it("returns 403 if user has completed fewer than 5 sessions", async () => {
    singleMock.mockResolvedValue({
      data: { completed_session_count: 3 },
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

    await requireTrainingEligibility(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "5 completed training sessions are required before accessing this resource.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 500 if profile data is missing", async () => {
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

    await requireTrainingEligibility(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Profile not found.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if user has completed 5 sessions", async () => {
    singleMock.mockResolvedValue({
      data: { completed_session_count: 5 },
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

    await requireTrainingEligibility(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("calls next if user has completed more than 5 sessions", async () => {
    singleMock.mockResolvedValue({
      data: { completed_session_count: 8 },
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

    await requireTrainingEligibility(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
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

    await requireTrainingEligibility(req, res, next);

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

    await requireTrainingEligibility(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Server error.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});