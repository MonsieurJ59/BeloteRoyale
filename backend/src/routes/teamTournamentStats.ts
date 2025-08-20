import express from "express";
import { pool } from "../db";
import { CreateTeamTournamentStatsDto, UpdateTeamTournamentStatsDto } from "../types";

const router = express.Router();

// GET all team tournament stats
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT ts.*, t.name as team_name, tr.name as tournament_name " +
      "FROM team_tournament_stats ts " +
      "JOIN teams t ON ts.team_id = t.id " +
      "JOIN tournaments tr ON ts.tournament_id = tr.id"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team tournament stats by tournament ID
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const [rows] = await pool.query(
      "SELECT ts.*, t.name as team_name " +
      "FROM team_tournament_stats ts " +
      "JOIN teams t ON ts.team_id = t.id " +
      "WHERE ts.tournament_id = ? " +
      "ORDER BY ts.prelim_points DESC, ts.wins DESC",
      [tournamentId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team tournament stats by team ID and tournament ID
router.get("/team/:teamId/tournament/:tournamentId", async (req, res) => {
  try {
    const { teamId, tournamentId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM team_tournament_stats WHERE team_id = ? AND tournament_id = ?",
      [teamId, tournamentId]
    );
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Team tournament stats not found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create team tournament stats
router.post("/", async (req, res) => {
  try {
    const { team_id, tournament_id, prelim_points = 0, wins = 0, losses = 0 } = req.body as CreateTeamTournamentStatsDto;
    
    if (!team_id) return res.status(400).json({ error: "Team ID is required" });
    if (!tournament_id) return res.status(400).json({ error: "Tournament ID is required" });
    
    // Validate team and tournament exist
    const [teams] = await pool.query("SELECT id FROM teams WHERE id = ?", [team_id]);
    if ((teams as any[]).length === 0) {
      return res.status(400).json({ error: "Team does not exist" });
    }
    
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournament_id]);
    if ((tournaments as any[]).length === 0) {
      return res.status(400).json({ error: "Tournament does not exist" });
    }
    
    // Check if stats already exist for this team and tournament
    const [existingStats] = await pool.query(
      "SELECT id FROM team_tournament_stats WHERE team_id = ? AND tournament_id = ?",
      [team_id, tournament_id]
    );
    
    if ((existingStats as any[]).length > 0) {
      return res.status(400).json({ error: "Stats already exist for this team and tournament" });
    }
    
    // Create stats
    const [result] = await pool.query(
      "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
      [team_id, tournament_id, prelim_points, wins, losses]
    );
    
    const statsId = (result as any).insertId;
    const [stats] = await pool.query("SELECT * FROM team_tournament_stats WHERE id = ?", [statsId]);
    res.status(201).json((stats as any[])[0]);
  } catch (error) {
    console.error("Error creating team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update team tournament stats
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { prelim_points, wins, losses } = req.body as UpdateTeamTournamentStatsDto;
    
    let query = "UPDATE team_tournament_stats SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (prelim_points !== undefined) {
      values.push(prelim_points);
      updateFields.push(`prelim_points = ?`);
    }
    if (wins !== undefined) {
      values.push(wins);
      updateFields.push(`wins = ?`);
    }
    if (losses !== undefined) {
      values.push(losses);
      updateFields.push(`losses = ?`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id = ?`;

    const [result] = await pool.query(query, values);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Team tournament stats not found" });
    }
    
    const [stats] = await pool.query("SELECT * FROM team_tournament_stats WHERE id = ?", [id]);
    res.json((stats as any[])[0]);
  } catch (error) {
    console.error("Error updating team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update team tournament stats by team and tournament IDs
router.patch("/team/:teamId/tournament/:tournamentId", async (req, res) => {
  try {
    const { teamId, tournamentId } = req.params;
    const { prelim_points, wins, losses } = req.body as UpdateTeamTournamentStatsDto;
    
    // Check if stats exist
    const [existingStats] = await pool.query(
      "SELECT id FROM team_tournament_stats WHERE team_id = ? AND tournament_id = ?",
      [teamId, tournamentId]
    );
    
    if ((existingStats as any[]).length === 0) {
      return res.status(404).json({ error: "Team tournament stats not found" });
    }
    
    const statsId = (existingStats as any[])[0].id;
    
    let query = "UPDATE team_tournament_stats SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (prelim_points !== undefined) {
      values.push(prelim_points);
      updateFields.push(`prelim_points = ?`);
    }
    if (wins !== undefined) {
      values.push(wins);
      updateFields.push(`wins = ?`);
    }
    if (losses !== undefined) {
      values.push(losses);
      updateFields.push(`losses = ?`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(statsId);
    query += ` WHERE id = ?`;

    await pool.query(query, values);
    
    const [stats] = await pool.query("SELECT * FROM team_tournament_stats WHERE id = ?", [statsId]);
    res.json((stats as any[])[0]);
  } catch (error) {
    console.error("Error updating team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE team tournament stats
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [stats] = await pool.query("SELECT * FROM team_tournament_stats WHERE id = ?", [id]);
    if ((stats as any[]).length === 0) {
      return res.status(404).json({ error: "Team tournament stats not found" });
    }
    await pool.query("DELETE FROM team_tournament_stats WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting team tournament stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET tournament rankings
router.get("/rankings/tournament/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const [rows] = await pool.query(
      "SELECT ts.*, t.name as team_name, t.player1, t.player2 " +
      "FROM team_tournament_stats ts " +
      "JOIN teams t ON ts.team_id = t.id " +
      "WHERE ts.tournament_id = ? " +
      "ORDER BY ts.prelim_points DESC, ts.wins DESC, ts.losses ASC",
      [tournamentId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tournament rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;