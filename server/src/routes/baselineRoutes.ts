import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import preventBaselineRetake from "../middleware/preventBaselineRetake.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { calculateWPM, calculateAccuracy, calculateEffectiveWPM } from "../utils/calculations.js"

const router = express.Router();

type BaselineTestParams = {
    baselineTestId: string;
};


type SubmitBaselineBody = {
    testId: string;
    answers: string[];
    correctAnswers: string[];
    readingTimeSeconds: number;
    wordCount: number;
}

router.get("/test", requireAuth, preventBaselineRetake, async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("baseline_tests")
            .select("id, passage_text, word_count")
            .maybeSingle();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "No baseline test found" });
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get(
    "/questions/:baselineTestId",
    requireAuth,
    preventBaselineRetake,
    async (req: Request<BaselineTestParams>, res: Response) => {
        const { baselineTestId } = req.params;

        try {
            const { data, error } = await supabaseAdmin
                .from("baseline_questions")
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
                .eq("baseline_test_id", baselineTestId)
                .order("question_order", { ascending: true });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    error: "No questions found for this baseline test",
                });
            }

            console.log(data);

            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Request<Params, ResBody, ReqBody, Query>


router.post(
    "/submit",
    requireAuth,
    preventBaselineRetake,
    async (req: Request<{}, {}, SubmitBaselineBody>, res: Response) => {
        try {
            const {
                testId,
                correctAnswers,
                answers,
                readingTimeSeconds,
                wordCount,
            } = req.body;

            console.log(req.body);
            console.log(testId);

            if (
                testId == null ||
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

            const wpm = calculateWPM(wordCount, readingTimeSeconds);
            const accuracy = calculateAccuracy(correctAnswers, answers);
            const effectiveWPM = calculateEffectiveWPM(wpm, accuracy);

            const userId = req.user.id;

            const { error } = await supabaseAdmin.rpc("submit_baseline_attempt", {
                p_user_id: userId,
                p_baseline_test_id: testId,
                p_reading_time_seconds: readingTimeSeconds,
                p_wpm: wpm,
                p_accuracy: accuracy,
                p_effective_wpm: effectiveWPM,
            });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({
                success: true,
                wpm,
                accuracy,
                effectiveWPM,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

export { router as baselineRoutes };
