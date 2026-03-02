import express from "express";
import cors from "cors";
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: true, db: r.rows[0].ok });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});



app.post("/attempts", async(req,res) => {
    try {
        const { userId, drillType, targetWpm, accuracy } = req.body;
        if (!userId || !drillType || typeof targetWpm !== "number" || typeof accuracy !== "number") {
            return res.status(400).json({ error: "Missing/invalid fields" });
        }
        if (accuracy < 0 || accuracy > 1) {
            return res.status(400).json({ error: "accuracy must be between 0 and 1" });
        }

        const effectiveSpeed = targetWpm * accuracy;

        const result = await pool.query(
        `insert into attempts (user_id, drill_type, target_wpm, accuracy, effective_speed)
        values ($1, $2, $3, $4, $5)
        returning *`,
        [userId, drillType, targetWpm, accuracy, effectiveSpeed]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create attempt" });
  }
 
    })


app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3001}`);
});