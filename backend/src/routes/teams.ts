import { Router } from "express";
import { pool } from "../db";
import type { CreateTeamDto, UpdateTeamDto } from "../types";

const router = Router();

// GET all teams
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM teams ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create team
router.post("/", async (req, res) => {
  try {
    const { name, player1, player2 } = req.body as CreateTeamDto;

    if (!name || !player1 || !player2) {
      return res.status(400).json({ error: "Name, player1 and player2 are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
      [name, player1, player2]
    );

    const teamId = (result as any).insertId;

    const [teams] = await pool.query("SELECT * FROM teams WHERE id = ?", [teamId]);
    res.status(201).json((teams as any[])[0]);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update team
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, player1, player2 } = req.body as UpdateTeamDto;
    
    let query = "UPDATE teams SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (name !== undefined) {
      values.push(name);
      updateFields.push(`name = ?`);
    }
    if (player1 !== undefined) {
      values.push(player1);
      updateFields.push(`player1 = ?`);
    }
    if (player2 !== undefined) {
      values.push(player2);
      updateFields.push(`player2 = ?`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id = ?`;

    const [result] = await pool.query(query, values);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const [teams] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);
    res.json((teams as any[])[0]);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE team
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team rankings for all tournaments (aggregated stats)
router.get("/rankings", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT t.id, t.name, t.player1, t.player2, " +
      "SUM(ts.wins) as total_wins, " +
      "SUM(ts.losses) as total_losses, " +
      "SUM(ts.prelim_points) as total_prelim_points " +
      "FROM teams t " +
      "LEFT JOIN team_tournament_stats ts ON t.id = ts.team_id " +
      "GROUP BY t.id " +
      "ORDER BY total_wins DESC, total_prelim_points DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team rankings for a specific tournament
router.get("/rankings/tournament/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    // Validate tournament exists
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    const [rows] = await pool.query(
      "SELECT t.id, t.name, t.player1, t.player2, ts.prelim_points, ts.wins, ts.losses " +
      "FROM teams t " +
      "JOIN team_tournament_stats ts ON t.id = ts.team_id " +
      "WHERE ts.tournament_id = ? " +
      "ORDER BY ts.wins DESC, ts.prelim_points DESC",
      [tournamentId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tournament team rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
