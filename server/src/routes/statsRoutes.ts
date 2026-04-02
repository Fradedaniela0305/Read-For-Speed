import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";



const router = express.Router();

router.get("/heatmap", requireAuth, requireBaseline, async (req: Request, res: Response) => {
    try {

        const userId = req.user.id;

        const { data, error } = await supabaseAdmin.rpc("get_heatmap_data", {
            user_id_input: userId,
        });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "No stats found" });
        }

        return res.status(200).json({
            data: data ?? [],
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

});


export { router as statsRoutes }