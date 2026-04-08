import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { REQUIRED_SESSIONS_FOR_TEST } from "../shared/testElegibility.js"


async function requireTrainingElegibility(req: Request, res: Response, next: NextFunction): Promise<void | Response> {

    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("completed_session_count")
            .eq("id", userId)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(500).json({
                error: "Profile not found.",
            });
        }

        if (data?.completed_session_count < REQUIRED_SESSIONS_FOR_TEST) {
            return res.status(403).json({
                error: "5 completed training sessions are required before accessing this resource.",
            });
        }

        next();


    } catch (err) {
        return res.status(500).json({ error: "Server error." });
    }


};






export default requireTrainingElegibility;