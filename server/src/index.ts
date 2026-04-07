import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import { profileRoutes } from "./routes/profileRoutes.js";
import { baselineRoutes } from "./routes/baselineRoutes.js";
import { statsRoutes } from "./routes/statsRoutes.js"
import { rsvpRoutes } from "./routes/rsvpRoutes.js"

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://read-for-speed-qi6bqtvnu-danis-projects-2f94e641.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
});

app.use("/api/profile", profileRoutes);
app.use("/api/baseline", baselineRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/rsvp", rsvpRoutes)

const port = process.env.PORT ? Number(process.env.PORT) : 3001;


export default app;

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });