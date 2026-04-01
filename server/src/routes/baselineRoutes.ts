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
    baselineTestId: number | string;
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

router.post("/submit", requireAuth, preventBaselineRetake, async (req: Request<{}, {}, SubmitBaselineBody>, res: Response) => {
    try {
        const { baselineTestId, correctAnswers, answers, readingTimeSeconds, wordCount} = req.body;

        const wpm : number = calculateWPM(wordCount, readingTimeSeconds);
        const accuracy : number = calculateAccuracy(correctAnswers, answers);
        const effectiveWPM : number = calculateEffectiveWPM(wpm, accuracy);

        return res.status(200).json({wpm, accuracy, effectiveWPM});
        
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export { router as baselineRoutes };