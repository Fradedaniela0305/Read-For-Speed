import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { REQUIRED_SESSIONS_FOR_TEST } from "../shared/testElegibility.js"

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
    attemptsEqMock,
    attemptsSelectMock,
    testsMaybeSingleMock,
    testsLimitMock,
    testsNotMock,
    testsSelectMock,
    orderMock,
    questionsEqMock,
    questionsSelectMock,
    fromMock,
    rpcMock,
    updateMock,
    eqMock,
} = vi.hoisted(() => {
    return {
        attemptsEqMock: vi.fn(),
        attemptsSelectMock: vi.fn(),

        testsMaybeSingleMock: vi.fn(),
        testsLimitMock: vi.fn(),
        testsNotMock: vi.fn(),
        testsSelectMock: vi.fn(),

        orderMock: vi.fn(),
        questionsEqMock: vi.fn(),
        questionsSelectMock: vi.fn(),

        fromMock: vi.fn(),
        rpcMock: vi.fn(),
        updateMock: vi.fn(),
        eqMock: vi.fn(),
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

describe("progress routes", () => {
    describe("GET /api/progress/fetch", () => {
        it("returns a progress test the user has not taken", async () => {
            attemptsEqMock.mockResolvedValue({
                data: [{ progress_test_id: "test-1" }],
                error: null,
            });

            attemptsSelectMock.mockReturnValue({ eq: attemptsEqMock });

            testsMaybeSingleMock.mockResolvedValue({
                data: {
                    id: "test-2",
                    passage_text: "Some passage",
                    word_count: 100,
                },
                error: null,
            });

            testsLimitMock.mockReturnValue({ maybeSingle: testsMaybeSingleMock });
            testsNotMock.mockReturnValue({ limit: testsLimitMock });
            testsSelectMock.mockReturnValue({ not: testsNotMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_attempts") {
                    return { select: attemptsSelectMock };
                }

                if (table === "progress_tests") {
                    return { select: testsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/fetch");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: "test-2",
                passage_text: "Some passage",
                word_count: 100,
            });

            expect(fromMock).toHaveBeenCalledWith("progress_test_attempts");
            expect(fromMock).toHaveBeenCalledWith("progress_tests");
            expect(attemptsSelectMock).toHaveBeenCalledWith("progress_test_id");
            expect(attemptsEqMock).toHaveBeenCalledWith("user_id", "user-123");
            expect(testsSelectMock).toHaveBeenCalledWith("id, passage_text, word_count");
            expect(testsNotMock).toHaveBeenCalledWith("id", "in", '("test-1")');
            expect(testsLimitMock).toHaveBeenCalledWith(1);
        });

        it("returns a test when user has no previous attempts", async () => {
            attemptsEqMock.mockResolvedValue({
                data: [],
                error: null,
            });

            attemptsSelectMock.mockReturnValue({ eq: attemptsEqMock });

            testsMaybeSingleMock.mockResolvedValue({
                data: {
                    id: "test-1",
                    passage_text: "First test",
                    word_count: 80,
                },
                error: null,
            });

            testsLimitMock.mockReturnValue({ maybeSingle: testsMaybeSingleMock });
            testsSelectMock.mockReturnValue({ limit: testsLimitMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_attempts") {
                    return { select: attemptsSelectMock };
                }

                if (table === "progress_tests") {
                    return { select: testsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/fetch");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: "test-1",
                passage_text: "First test",
                word_count: 80,
            });

            expect(testsSelectMock).toHaveBeenCalledWith("id, passage_text, word_count");
            expect(testsLimitMock).toHaveBeenCalledWith(1);
        });

        it("returns 404 if no tests remain", async () => {
            attemptsEqMock.mockResolvedValue({
                data: [{ progress_test_id: "test-1" }],
                error: null,
            });

            attemptsSelectMock.mockReturnValue({ eq: attemptsEqMock });

            testsMaybeSingleMock.mockResolvedValue({
                data: null,
                error: null,
            });

            testsLimitMock.mockReturnValue({ maybeSingle: testsMaybeSingleMock });
            testsNotMock.mockReturnValue({ limit: testsLimitMock });
            testsSelectMock.mockReturnValue({ not: testsNotMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_attempts") {
                    return { select: attemptsSelectMock };
                }

                if (table === "progress_tests") {
                    return { select: testsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/fetch");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                error: "No progress tests remaining",
            });
        });

        it("returns 500 if attempts query fails", async () => {
            attemptsEqMock.mockResolvedValue({
                data: null,
                error: { message: "Attempts failed" },
            });

            attemptsSelectMock.mockReturnValue({ eq: attemptsEqMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_attempts") {
                    return { select: attemptsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/fetch");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: "Attempts failed",
            });
        });

        it("returns 500 if test fetch fails", async () => {
            attemptsEqMock.mockResolvedValue({
                data: [],
                error: null,
            });

            attemptsSelectMock.mockReturnValue({ eq: attemptsEqMock });

            testsMaybeSingleMock.mockResolvedValue({
                data: null,
                error: { message: "Fetch failed" },
            });

            testsLimitMock.mockReturnValue({ maybeSingle: testsMaybeSingleMock });
            testsSelectMock.mockReturnValue({ limit: testsLimitMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_attempts") {
                    return { select: attemptsSelectMock };
                }

                if (table === "progress_tests") {
                    return { select: testsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/fetch");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: "Fetch failed",
            });
        });
    });

    describe("GET /api/progress/questions/:progressTestId", () => {
        it("returns questions for a progress test", async () => {
            orderMock.mockResolvedValue({
                data: [
                    {
                        id: "q1",
                        question_text: "What is learning really about?",
                        option_a: "Understanding how to think",
                        option_b: "Reading faster",
                        option_c: "Memorization",
                        option_d: "Luck",
                        correct_answer: "Understanding how to think",
                        question_order: 1,
                    },
                ],
                error: null,
            });

            questionsEqMock.mockReturnValue({ order: orderMock });
            questionsSelectMock.mockReturnValue({ eq: questionsEqMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_questions") {
                    return { select: questionsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/questions/test-123");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {
                    id: "q1",
                    question_text: "What is learning really about?",
                    option_a: "Understanding how to think",
                    option_b: "Reading faster",
                    option_c: "Memorization",
                    option_d: "Luck",
                    correct_answer: "Understanding how to think",
                    question_order: 1,
                },
            ]);

            expect(fromMock).toHaveBeenCalledWith("progress_test_questions");
            expect(questionsEqMock).toHaveBeenCalledWith("progress_test_id", "test-123");
            expect(orderMock).toHaveBeenCalledWith("question_order", {
                ascending: true,
            });
        });

        it("returns 404 if no questions are found", async () => {
            orderMock.mockResolvedValue({
                data: [],
                error: null,
            });

            questionsEqMock.mockReturnValue({ order: orderMock });
            questionsSelectMock.mockReturnValue({ eq: questionsEqMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_questions") {
                    return { select: questionsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/questions/test-123");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                error: "No questions found for this progress test",
            });
        });

        it("returns 500 if the database query fails", async () => {
            orderMock.mockResolvedValue({
                data: null,
                error: { message: "Database error" },
            });

            questionsEqMock.mockReturnValue({ order: orderMock });
            questionsSelectMock.mockReturnValue({ eq: questionsEqMock });

            fromMock.mockImplementation((table: string) => {
                if (table === "progress_test_questions") {
                    return { select: questionsSelectMock };
                }
            });

            const res = await request(app).get("/api/progress/questions/test-123");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: "Database error",
            });
        });
    });

    describe("POST /api/progress/submit", () => {
        it("submits a progress attempt and returns computed metrics", async () => {
            rpcMock.mockResolvedValue({ error: null });

            const res = await request(app).post("/api/progress/submit").send({
                progressTestId: "test-123",
                correctAnswers: ["A", "B", "C", "D"],
                answers: ["A", "B", "C", "A"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.wpm).toBe(120);
            expect(res.body.accuracy).toBe(0.75);
            expect(res.body.effectiveWPM).toBeDefined();

            expect(rpcMock).toHaveBeenCalledWith("submit_progress_attempt", {
                p_user_id: "user-123",
                p_progress_test_id: "test-123",
                p_reading_time_seconds: 60,
                p_wpm: 120,
                p_accuracy: 0.75,
                p_effective_wpm: res.body.effectiveWPM,
            });
        });

        it("returns 400 for invalid submission data", async () => {
            const res = await request(app).post("/api/progress/submit").send({
                progressTestId: "test-123",
                correctAnswers: ["A", "B"],
                answers: ["A"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "Invalid submission data",
            });
        });

        it("returns 500 if the rpc call fails", async () => {
            rpcMock.mockResolvedValue({
                error: { message: "RPC failed" },
            });

            const res = await request(app).post("/api/progress/submit").send({
                progressTestId: "test-123",
                correctAnswers: ["A", "B", "C", "D"],
                answers: ["A", "B", "C", "A"],
                readingTimeSeconds: 60,
                wordCount: 120,
            });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: "RPC failed",
            });
        });
    });

    describe("POST /api/progress/update", () => {
  it("updates profile progress stats successfully", async () => {
    rpcMock.mockResolvedValue({ error: null });

    const res = await request(app).post("/api/progress/update").send({
      wpm: 300,
      accuracy: 0.8,
      effectiveWPM: 240,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Profile progress stats updated successfully",
    });

    expect(rpcMock).toHaveBeenCalledWith("update_progress_profile_stats", {
      p_user_id: "user-123",
      p_wpm: 300,
      p_accuracy: 0.8,
      p_effective_wpm: 240,
      p_sessions_to_subtract: REQUIRED_SESSIONS_FOR_TEST,
    });
  });

  it("returns 400 if request body is invalid", async () => {
    const res = await request(app).post("/api/progress/update").send({
      wpm: "300",
      accuracy: 0.8,
      effectiveWPM: 240,
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "wpm, accuracy, and effectiveWPM must all be numbers",
    });
  });

  it("returns 500 if the rpc call fails", async () => {
    rpcMock.mockResolvedValue({
      error: { message: "RPC failed" },
    });

    const res = await request(app).post("/api/progress/update").send({
      wpm: 300,
      accuracy: 0.8,
      effectiveWPM: 240,
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "RPC failed",
    });
  });
});


});