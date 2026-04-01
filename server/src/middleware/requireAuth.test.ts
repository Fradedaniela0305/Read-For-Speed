import { describe, it, expect, vi, beforeEach } from "vitest";
import requireAuth from "./requireAuth.js";

const { getUserMock } = vi.hoisted(() => {
  return {
    getUserMock: vi.fn(),
  };
});

vi.mock("../lib/supabaseAuth.js", () => ({
  supabaseAuth: {
    auth: {
      getUser: getUserMock,
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requireAuth middleware", () => {
  it("returns 401 when authorization header is missing", async () => {
    const req: any = {
      headers: {},
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when authorization header is not Bearer", async () => {
    const req: any = {
      headers: {
        authorization: "Basic abc123",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when Supabase does not find a user", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const req: any = {
      headers: {
        authorization: "Bearer fake-token",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith("fake-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when Supabase returns an error", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    const req: any = {
      headers: {
        authorization: "Bearer fake-token",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith("fake-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches user to req and calls next when token is valid", async () => {
    const fakeUser = {
      id: "user-123",
      email: "test@example.com",
    };

    getUserMock.mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    });

    const req: any = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(getUserMock).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when an unexpected error happens", async () => {
    getUserMock.mockRejectedValue(new Error("Unexpected failure"));

    const req: any = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});