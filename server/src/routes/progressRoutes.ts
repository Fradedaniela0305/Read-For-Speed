import express, { Request, Response } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireBaseline from "../middleware/requireBaseline.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import requireTrainingElegibility from "../middleware/requireTrainingElegibility.js"


const router = express.Router();







router.get("/fetch", requireAuth, requireBaseline, requireTrainingElegibility, )


export { router as progressRoutes }