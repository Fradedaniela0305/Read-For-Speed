import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import { profileRoutes } from "./routes/profileRoutes.js";
import { baselineRoutes } from "./routes/baselineRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
});

app.use("/api/profile", profileRoutes);
app.use("/api/baseline", baselineRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 3001;


export default app;

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });