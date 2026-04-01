import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

async function requireBaseline(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("has_completed_baseline")
            .eq("id", userId)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data?.has_completed_baseline) {
            return res.status(403).json({
                error: "Baseline test required before accessing this resource.",
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: "Server error." });
    }
}

export default requireBaseline;



