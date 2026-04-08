import { Request, Response, NextFunction } from "express";
import { supabaseAuth } from "../lib/supabaseAuth.js";



async function requireTrainingElegibility(req: Request, res: Response, next: NextFunction) : Promise<void | Response>{


}






export default requireTrainingElegibility;