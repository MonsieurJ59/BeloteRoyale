import { Router } from "express";
import { pool } from "../db";
import type { CreateTeamTournamentDto } from "../types";

const router = Router();

// GET registered teams for a tournament
router.get("/tournament/:tournamentId/teams", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const [rows] = await pool.query(
      "SELECT tt.team_id as id, t.name, t.player1, t.player2, tt.registration_date FROM team_tournament tt JOIN teams t ON tt.team_id = t.id WHERE tt.tournament_id = ? ORDER BY tt.registration_date ASC",
      [tournamentId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching tournament teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST register a team to a tournament
router.post("/tournament/:tournamentId/teams", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { team_id } = req.body as CreateTeamTournamentDto & { team_id: number };

    if (!team_id) return res.status(400).json({ error: "team_id is required" });

    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const [teams] = await pool.query("SELECT id FROM teams WHERE id = ?", [team_id]);
    if ((teams as any[]).length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM team_tournament WHERE team_id = ? AND tournament_id = ?",
      [team_id, tournamentId]
    );

    if ((existing as any[]).length > 0) {
      return res.status(400).json({ error: "Team already registered for this tournament" });
    }

    await pool.query(
      "INSERT INTO team_tournament (team_id, tournament_id, registration_date) VALUES (?, ?, NOW())",
      [team_id, tournamentId]
    );

    // Ensure stats row exists for this team & tournament
    const [existingStats] = await pool.query(
      "SELECT id FROM team_tournament_stats WHERE team_id = ? AND tournament_id = ?",
      [team_id, tournamentId]
    );
    if ((existingStats as any[]).length === 0) {
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, 0, 0, 0)",
        [team_id, tournamentId]
      );
    }

    res.status(201).json({ message: "Team registered" });
  } catch (error) {
    console.error("Error registering team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE unregister a team from a tournament
router.delete("/tournament/:tournamentId/teams/:teamId", async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;

    const [existing] = await pool.query(
      "SELECT id FROM team_tournament WHERE team_id = ? AND tournament_id = ?",
      [teamId, tournamentId]
    );

    if ((existing as any[]).length === 0) {
      return res.status(404).json({ error: "Team is not registered for this tournament" });
    }

    await pool.query("DELETE FROM team_tournament WHERE team_id = ? AND tournament_id = ?", [teamId, tournamentId]);

    res.status(204).send();
  } catch (error) {
    console.error("Error unregistering team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
