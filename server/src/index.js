import express from "express";
import cors from "cors";
import "dotenv/config";

import { profileRoutes } from "./routes/profileRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/profile", profileRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3001}`);
});