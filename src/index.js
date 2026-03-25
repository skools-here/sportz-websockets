import express from "express";
import { db } from "./db/db.js";
import { matches } from "./db/schema.js";

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});


// ✅ CREATE MATCH API
app.post("/matches", async (req, res) => {
  try {
    const { sport, homeTeam, awayTeam } = req.body;

    const [match] = await db.insert(matches)
      .values({ sport, homeTeam, awayTeam })
      .returning();

    res.json(match);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);   // 👈 IMPORTANT
    res.status(500).json({ error: err.message }); // 👈 show actual error
  }
});

// ✅ GET ALL MATCHES
app.get("/matches", async (req, res) => {
  try {
    const data = await db.select().from(matches);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});


// 🚀 START SERVER
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});