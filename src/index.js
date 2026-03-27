import { matches } from "./db/schema.js";
import express from "express" 
import { matchRouter } from "./routes/matches.js";
import { db } from "./db/db.js";
import http from 'http';
import { attachWebSocketServer } from "./ws/server.js"; 

const app = express();
const port = 8080;
const HOST='0.0.0.0';

app.use(express.json());

const server=http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

app.use('/',matchRouter)

const {broadcastMatchCreated}=attachWebSocketServer(server);

app.locals.broadcastMatchCreated=broadcastMatchCreated;
// ✅ CREATE MATCH API
app.post("/matches", async (req, res) => {
  try {
    const { sport, homeTeam, awayTeam } = req.body;

    const [match] = await db.insert(matches)
      .values({ sport, homeTeam, awayTeam })
      .returning();
      
      req.app.locals.broadcastMatchCreated(match);

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
// 🚀 START SERVER
server.listen(port, HOST, () => {
  const baseUrl = 'http://localhost:8080';
  console.log(`Server running at http://localhost:${port}`);
  console.log(`WSS running on ${baseUrl.replace('http','ws')}/ws`);
});