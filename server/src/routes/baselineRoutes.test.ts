import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../middleware/requireAuth.js", () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = { id: "user-123" };
        next();
    },
}));

vi.mock("../middleware/preventBaselineRetake.js", () => ({
    default: (_req: any, _res: any, next: any) => next(),
}));

const { maybeSingleMock, selectMock, fromMock, rpcMock } = vi.hoisted(() => {
    return {
        maybeSingleMock: vi.fn(),
        selectMock: vi.fn(),
        fromMock: vi.fn(),
        rpcMock: vi.fn(),
    };
});

vi.mock("../lib/supabaseAdmin.js", () => ({
    supabaseAdmin: {
        from: fromMock,
        rpc: rpcMock,
    },
}));

import app from "../index.js";

beforeEach(() => {
    vi.clearAllMocks();
});

describe("GET /api/baseline/test - success", () => {
    it("returns baseline test data", async () => {
        maybeSingleMock.mockResolvedValue({
            data: {
                id: 1,
                passage_text: "Test passage",
                word_count: 100,
            },
            error: null,
        });

        selectMock.mockReturnValue({
            maybeSingle: maybeSingleMock,
        });

        fromMock.mockReturnValue({
            select: selectMock,
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
    it("returns calculated metrics and calls the baseline RPC", async () => {
        rpcMock.mockResolvedValue({
            error: null,
        });

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
        expect(res.body).toEqual({
            success: true,
            wpm: 120,
            accuracy: 1,
            effectiveWPM: 120,
        });

        expect(rpcMock).toHaveBeenCalledWith("submit_baseline_attempt", {
            p_user_id: "user-123",
            p_baseline_test_id: 1,
            p_reading_time_seconds: 60,
            p_wpm: 120,
            p_accuracy: 1,
            p_effective_wpm: 120,
        });
    });

    it("returns 500 if the RPC fails", async () => {
        rpcMock.mockResolvedValue({
            error: { message: "RPC failed" },
        });

        const res = await request(app)
            .post("/api/baseline/submit")
            .send({
                baselineTestId: 1,
                answers: ["A", "B", "C"],
                correctAnswers: ["A", "B", "C"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            error: "RPC failed",
        });
    });

    it("returns 400 if required fields are missing", async () => {
        const res = await request(app)
            .post("/api/baseline/submit")
            .send({
                baselineTestId: 1,
                answers: ["A", "B", "C"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "Invalid submission data",
        });
    });

    it("returns 400 if answers and correctAnswers lengths do not match", async () => {
        const res = await request(app)
            .post("/api/baseline/submit")
            .send({
                baselineTestId: 1,
                answers: ["A", "B"],
                correctAnswers: ["A", "B", "C"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

        expect(res.status).toBe(400);
    });

    it("returns 400 if readingTimeSeconds is invalid", async () => {
        const res = await request(app)
            .post("/api/baseline/submit")
            .send({
                baselineTestId: 1,
                answers: ["A", "B", "C"],
                correctAnswers: ["A", "B", "C"],
                readingTimeSeconds: 0,
                wordCount: 120,
            });

        expect(res.status).toBe(400);
    });
});