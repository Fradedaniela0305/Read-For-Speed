import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({
    insert: insertMock,
  }));

  return { insertMock, fromMock };
});

vi.mock("../middleware/requireAuth.js", () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

vi.mock("../middleware/requireBaseline.js", () => ({
  default: (_req: any, _res: any, next: any) => {
    next();
  },
}));

vi.mock("../lib/supabaseAdmin.js", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
}));

import { rsvpRoutes } from "./rsvpRoutes.js";

describe("rsvpRoutes", () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/rsvp", rsvpRoutes);
  });

  it("should save RSVP results and return 201", async () => {
    insertMock.mockResolvedValue({ error: null });

    const response = await request(app).post("/api/rsvp/results").send({
      wpm: 300,
      wordCount: 250,
      completed_at: "2026-04-02T12:00:00.000Z",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "RSVP results saved successfully",
    });

    expect(fromMock).toHaveBeenCalledWith("training_attempts");
    expect(insertMock).toHaveBeenCalledWith({
      user_id: "user-123",
      training_type: "rsvp",
      wpm: 300,
      word_count: 250,
      completed_at: "2026-04-02T12:00:00.000Z",
    });
  });

  it("should return 400 if wpm is missing", async () => {
    const response = await request(app).post("/api/rsvp/results").send({
      wordCount: 250,
      completed_at: "2026-04-02T12:00:00.000Z",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required fields",
    });

    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("should return 400 if wordCount is missing", async () => {
    const response = await request(app).post("/api/rsvp/results").send({
      wpm: 300,
      completed_at: "2026-04-02T12:00:00.000Z",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required fields",
    });

    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("should return 400 if completed_at is missing", async () => {
    const response = await request(app).post("/api/rsvp/results").send({
      wpm: 300,
      wordCount: 250,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required fields",
    });

    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("should return 500 if supabase insert fails", async () => {
    insertMock.mockResolvedValue({
      error: { message: "Insert failed" },
    });

    const response = await request(app).post("/api/rsvp/results").send({
      wpm: 300,
      wordCount: 250,
      completed_at: "2026-04-02T12:00:00.000Z",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Failed to save RSVP results",
    });
  });

  it("should return 500 if an unexpected error is thrown", async () => {
    fromMock.mockImplementationOnce(() => {
      throw new Error("Unexpected failure");
    });

    const response = await request(app).post("/api/rsvp/results").send({
      wpm: 300,
      wordCount: 250,
      completed_at: "2026-04-02T12:00:00.000Z",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal server error",
    });
  });
});