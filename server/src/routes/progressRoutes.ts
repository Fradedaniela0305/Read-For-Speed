import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import requireTrainingElegibility from "../middleware/requireTrainingElegibility.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { calculateWPM, calculateAccuracy, calculateEffectiveWPM } from "../utils/calculations.js";
import { REQUIRED_SESSIONS_FOR_TEST } from "../shared/testElegibility.js"

const router = express.Router();

type ProgressTestParams = {
    progressTestId: string;
};

type ProgressTestSuccess = {
    id: string;
    passage_text: string;
    word_count: number;
};

type ProgressQuestion = {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    question_order: number;
};

type ErrorResponse = {
    error: string;
};

type FetchProgressTestResponse = ProgressTestSuccess | ErrorResponse;
type FetchProgressQuestionsResponse = ProgressQuestion[] | ErrorResponse;

type SubmitProgressBody = {
    testId: string;
    answers: string[];
    correctAnswers: string[];
    readingTimeSeconds: number;
    wordCount: number;
};

type SubmitProgressSuccess = {
    success: true;
    wpm: number;
    accuracy: number;
    effectiveWPM: number;
};

type SubmitProgressResponse = SubmitProgressSuccess | ErrorResponse;

type AuthenticatedRequest<
    P = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
> = Request<P, ResBody, ReqBody, ReqQuery> & {
    user?: {
        id: string;
    };
};

router.get(
    "/fetch",
    requireAuth,
    requireBaseline,
    requireTrainingElegibility,
    async (
        req: AuthenticatedRequest,
        res: Response<FetchProgressTestResponse>
    ) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const { data: attempts, error: attemptsError } = await supabaseAdmin
                .from("progress_test_attempts")
                .select("progress_test_id")
                .eq("user_id", userId);

            if (attemptsError) {
                return res.status(500).json({ error: attemptsError.message });
            }

            const attemptedIds = attempts.map((attempt) => attempt.progress_test_id);

            let query = supabaseAdmin
                .from("progress_tests")
                .select("id, passage_text, word_count");

            if (attemptedIds.length > 0) {
                const formattedIds = `(${attemptedIds.map((id) => `"${id}"`).join(",")})`;
                query = query.not("id", "in", formattedIds);
            }

            const { data, error } = await query.limit(1).maybeSingle();

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            if (!data) {
                return res.status(404).json({ error: "No progress tests remaining" });
            }

            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.get("/questions/:progressTestId", requireAuth, requireBaseline, requireTrainingElegibility,
    async (
        req: AuthenticatedRequest<ProgressTestParams>,
        res: Response<FetchProgressQuestionsResponse>
    ) => {
        const { progressTestId } = req.params;

        try {
            const { data, error } = await supabaseAdmin
                .from("progress_test_questions")
                .select(`
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          question_order
        `)
                .eq("progress_test_id", progressTestId)
                .order("question_order", { ascending: true });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    error: "No questions found for this progress test",
                });
            }

            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.post("/submit", requireAuth, requireBaseline, requireTrainingElegibility,
    async (
        req: AuthenticatedRequest<{}, SubmitProgressResponse, SubmitProgressBody>,
        res: Response<SubmitProgressResponse>
    ) => {
        try {
            const {
                testId,
                correctAnswers,
                answers,
                readingTimeSeconds,
                wordCount,
            } = req.body;

            if (
                !testId ||
                !Array.isArray(correctAnswers) ||
                !Array.isArray(answers) ||
                correctAnswers.length === 0 ||
                answers.length === 0 ||
                correctAnswers.length !== answers.length ||
                typeof readingTimeSeconds !== "number" ||
                typeof wordCount !== "number" ||
                readingTimeSeconds <= 0 ||
                wordCount <= 0
            ) {
                return res.status(400).json({ error: "Invalid submission data" });
            }

            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const wpm = calculateWPM(wordCount, readingTimeSeconds);
            const accuracy = calculateAccuracy(correctAnswers, answers);
            const effectiveWPM = calculateEffectiveWPM(wpm, accuracy);

            const { error } = await supabaseAdmin.rpc("submit_progress_attempt", {
                p_user_id: userId,
                p_progress_test_id: testId,
                p_wpm: wpm,
                p_accuracy: accuracy,
                p_effective_wpm: effectiveWPM,
            });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            console.log(effectiveWPM);

            return res.status(200).json({
                success: true,
                wpm,
                accuracy,
                effectiveWPM,
            });
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.post("/update", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { wpm, accuracy, effectiveWPM } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      typeof wpm !== "number" ||
      typeof accuracy !== "number" ||
      typeof effectiveWPM !== "number"
    ) {
      return res.status(400).json({
        error: "wpm, accuracy, and effectiveWPM must all be numbers",
      });
    }

    const { error } = await supabaseAdmin.rpc("update_progress_profile_stats", {
      p_user_id: userId,
      p_wpm: wpm,
      p_accuracy: accuracy,
      p_effective_wpm: effectiveWPM,
      p_sessions_to_subtract: REQUIRED_SESSIONS_FOR_TEST,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Profile progress stats updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile progress stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as progressRoutes };