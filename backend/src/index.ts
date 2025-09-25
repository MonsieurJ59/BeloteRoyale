import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams";
import matchesRouter from "./routes/matches";
import tournamentsRouter from "./routes/tournaments";
import teamTournamentStatsRouter from "./routes/teamTournamentStats";
import teamTournamentsRouter from "./routes/teamTournaments";
import tournamentMatchConfigsRouter from "./routes/tournamentMatchConfigs";

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/teams", teamsRouter);
app.use("/matches", matchesRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/team-tournament-stats", teamTournamentStatsRouter);
app.use("/team-tournaments", teamTournamentsRouter);
app.use("/tournament-match-configs", tournamentMatchConfigsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
