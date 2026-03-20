import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js"

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
    const userId = req.user.id
    const email = req.user.email

    const { data: existingProfile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (fetchError) { 
        return res.status(500).json({ error: fetchError.message })
    }

    if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabaseAdmin
            .from("profiles")
            .insert({
                id: userId,
                email: email,
                nickname: req.user.user_metadata?.nickname || null
            })
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ error: insertError.message });
        }

        return res.json(newProfile);

    }

    return res.json(existingProfile);



});

export { router as profileRoutes };