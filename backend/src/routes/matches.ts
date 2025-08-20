import { Router } from "express";
import { pool } from "../db";
import type { CreateMatchDto, UpdateMatchDto } from "../types";

const router = Router();

// GET all matches
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM matches ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET match by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM matches WHERE id = ?", [id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create match
router.post("/", async (req, res) => {
  try {
    const { is_prelim, team_a_id, team_b_id, score_a = 0, score_b = 0, winner_id = null } = req.body as CreateMatchDto;
    
    if (is_prelim === undefined) return res.status(400).json({ error: "is_prelim is required" });
    if (!team_a_id) return res.status(400).json({ error: "Team A ID is required" });
    if (!team_b_id) return res.status(400).json({ error: "Team B ID is required" });
    
    // Validate teams exist
    const [teams] = await pool.query("SELECT id FROM teams WHERE id IN (?, ?)", [team_a_id, team_b_id]);
    if ((teams as any[]).length !== 2) {
      return res.status(400).json({ error: "One or both teams do not exist" });
    }
    
    // Create match
    const [result] = await pool.query(
      "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
      [is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id]
    );
    
    const matchId = (result as any).insertId;
    const [matches] = await pool.query("SELECT * FROM matches WHERE id = ?", [matchId]);
    res.status(201).json((matches as any[])[0]);
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update match
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { score_a, score_b, winner_id } = req.body as UpdateMatchDto;
    
    let query = "UPDATE matches SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (score_a !== undefined) {
      values.push(score_a);
      updateFields.push(`score_a = ?`);
    }
    if (score_b !== undefined) {
      values.push(score_b);
      updateFields.push(`score_b = ?`);
    }
    if (winner_id !== undefined) {
      values.push(winner_id);
      updateFields.push(`winner_id = ?`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id = ?`;

    const [result] = await pool.query(query, values);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    
    const [matches] = await pool.query("SELECT * FROM matches WHERE id = ?", [id]);
    res.json((matches as any[])[0]);
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE match
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [matches] = await pool.query("SELECT * FROM matches WHERE id = ?", [id]);
    if ((matches as any[]).length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    await pool.query("DELETE FROM matches WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET matches by type (prelim or main)
router.get("/type/:prelim", async (req, res) => {
  try {
    const isPrelim = req.params.prelim === "prelim";
    const [rows] = await pool.query(
      "SELECT m.*, ta.name as team_a_name, tb.name as team_b_name " +
      "FROM matches m " +
      "JOIN teams ta ON m.team_a_id = ta.id " +
      "JOIN teams tb ON m.team_b_id = tb.id " +
      "WHERE m.is_prelim = ? ORDER BY m.id ASC",
      [isPrelim]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate preliminary matches
router.post("/generate/prelim", async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [teams] = await connection.query("SELECT id FROM teams");
      if ((teams as any[]).length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams" });
      }
      await connection.query("DELETE FROM matches WHERE is_prelim = TRUE");
      await connection.query("UPDATE teams SET prelim_points = 0");
      const matches = [];
      for (let i = 0; i < (teams as any[]).length; i++) {
        for (let j = i + 1; j < (teams as any[]).length; j++) {
          matches.push({ team_a_id: (teams as any[])[i].id, team_b_id: (teams as any[])[j].id });
        }
      }
      for (const match of matches) {
        await connection.query("INSERT INTO matches (is_prelim, team_a_id, team_b_id) VALUES (TRUE, ?, ?)", [match.team_a_id, match.team_b_id]);
      }
      await connection.commit();
      res.status(201).json({ message: `Generated ${matches.length} preliminary matches` });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error generating prelim matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate main matches
router.post("/generate/main", async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [teams] = await connection.query("SELECT id FROM teams");
      if ((teams as any[]).length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams" });
      }
      await connection.query("DELETE FROM matches WHERE is_prelim = FALSE");
      const shuffled = [...(teams as any[])].sort(() => Math.random() - 0.5);
      const newMatches = [];
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        newMatches.push({ team_a_id: shuffled[i].id, team_b_id: shuffled[i + 1].id });
      }
      for (const match of newMatches) {
        await connection.query("INSERT INTO matches (is_prelim, team_a_id, team_b_id) VALUES (FALSE, ?, ?)", [match.team_a_id, match.team_b_id]);
      }
      await connection.commit();
      res.status(201).json({ message: `Generated ${newMatches.length} main matches` });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error generating main matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;