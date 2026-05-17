import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { fillHeatmapDates } from "../utils/dataParser.js";


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

    const filledData = fillHeatmapDates(data ?? []);

    return res.status(200).json({
      data: filledData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/graph", requireAuth, requireBaseline, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from("progress_test_attempts")
      .select("id, effective_wpm, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const graphData = (data ?? []).reverse();

    return res.status(200).json({
      data: graphData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as statsRoutes }