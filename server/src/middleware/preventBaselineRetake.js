import { supabaseAdmin } from "../lib/supabaseAdmin.js"


async function preventBaselineRetake(req, res, next) {
    try {
        const userId = req.user.id

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("has_completed_baseline")
            .eq("id", userId)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        if (data?.has_completed_baseline) {
            return res.status(403).json({ error: "You have already taken the baseline test" })
        }
        next();
    } catch (err) {
        return res.status(500).json({ error: "Server error." })
    }
}

export default preventBaselineRetake