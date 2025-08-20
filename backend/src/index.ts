import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams";
import matchesRouter from "./routes/matches";

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/teams", teamsRouter);
app.use("/matches", matchesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
