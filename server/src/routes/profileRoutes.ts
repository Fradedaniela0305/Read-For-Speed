import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/me", requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const email = req.user.email;

        const { data: existingProfile, error: fetchError } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (fetchError) {
            return res.status(500).json({ error: fetchError.message });
        }

        if (!existingProfile) {
            const { data: newProfile, error: insertError } = await supabaseAdmin
                .from("profiles")
                .insert({
                    id: userId,
                    email,
                    nickname: req.user.user_metadata?.nickname || null,
                })
                .select()
                .single();

            if (insertError) {
                return res.status(500).json({ error: insertError.message });
            }

            return res.json(newProfile);
        }

        return res.json(existingProfile);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export { router as profileRoutes };