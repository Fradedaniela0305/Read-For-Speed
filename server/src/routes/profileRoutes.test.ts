import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { maybeSingleMock, singleMock, selectMock, eqMock, insertMock, fromMock } =
  vi.hoisted(() => {
    return {
      maybeSingleMock: vi.fn(),
      singleMock: vi.fn(),
      selectMock: vi.fn(),
      eqMock: vi.fn(),
      insertMock: vi.fn(),
      fromMock: vi.fn(),
    };
  });


vi.mock("../middleware/requireAuth.js", () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-123",
      email: "test@example.com",
      user_metadata: {
        nickname: "Dani",
      },
    };
    next();
  },
}));

vi.mock("../lib/supabaseAdmin.js", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
}));

import app from "../index.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/profile/me", () => {
  it("returns existing profile if it already exists", async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: "user-123",
        email: "test@example.com",
        nickname: "Dani",
      },
      error: null,
    });

    eqMock.mockReturnValue({
      maybeSingle: maybeSingleMock,
    });

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    fromMock.mockReturnValue({
      select: selectMock,
    });

    const res = await request(app).get("/api/profile/me");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "user-123",
      email: "test@example.com",
      nickname: "Dani",
    });
  });

  it("creates and returns a new profile if one does not exist", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: null,
    });

    singleMock.mockResolvedValue({
      data: {
        id: "user-123",
        email: "test@example.com",
        nickname: "Dani",
      },
      error: null,
    });

    insertMock.mockReturnValue({
      select: () => ({
        single: singleMock,
      }),
    });

    eqMock.mockReturnValue({
      maybeSingle: maybeSingleMock,
    });

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    fromMock.mockReturnValue({
      select: selectMock,
      insert: insertMock,
    });

    const res = await request(app).get("/api/profile/me");

    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith({
      id: "user-123",
      email: "test@example.com",
      nickname: "Dani",
    });
    expect(res.body).toEqual({
      id: "user-123",
      email: "test@example.com",
      nickname: "Dani",
    });
  });

  it("returns 500 if fetching the profile fails", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: "Fetch failed" },
    });

    eqMock.mockReturnValue({
      maybeSingle: maybeSingleMock,
    });

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    fromMock.mockReturnValue({
      select: selectMock,
    });

    const res = await request(app).get("/api/profile/me");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Fetch failed",
    });
  });
});