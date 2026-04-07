import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();


router.post("/results", requireAuth, requireBaseline, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { wpm, wordCount, completed_at } = req.body;

        if (
            wpm === undefined ||
            wordCount === undefined ||
            completed_at === undefined
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { error } = await supabaseAdmin.rpc(
            "insert_training_attempt_and_update_profile",
            {
                p_user_id: userId,
                p_training_type: "rsvp",
                p_wpm: wpm,
                p_word_count: wordCount,
                p_completed_at: completed_at,
            }
        );

        if (error) {
            console.error(error);
            return res.status(500).json({error: "Internal Server Error"})
        }


        return res.status(201).json({
            message: "RSVP results saved successfully",
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});


export { router as rsvpRoutes };