import { Router } from "express";
import { pool } from "../db";
import type { CreateTeamDto, UpdateTeamDto } from "../types";

const router = Router();

// GET all teams
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teams ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create team
router.post("/", async (req, res) => {
  try {
    const { name, players } = req.body as CreateTeamDto;
    if (!name) return res.status(400).json({ error: "Name is required" });

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create team
      const teamResult = await client.query(
        "INSERT INTO teams (name) VALUES ($1) RETURNING *",
        [name]
      );
      const team = teamResult.rows[0];
      
      // Create players if provided
      if (players && players.length > 0) {
        for (const playerName of players) {
          await client.query(
            "INSERT INTO players (name, team_id) VALUES ($1, $2)",
            [playerName, team.id]
          );
        }
      }
      
      await client.query('COMMIT');
      res.status(201).json(team);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update team
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, prelim_points, wins, losses } = req.body as UpdateTeamDto;
    
    // Build dynamic query based on provided fields
    let query = "UPDATE teams SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (name !== undefined) {
      values.push(name);
      updateFields.push(`name=$${values.length}`);
    }
    
    if (prelim_points !== undefined) {
      values.push(prelim_points);
      updateFields.push(`prelim_points=$${values.length}`);
    }
    
    if (wins !== undefined) {
      values.push(wins);
      updateFields.push(`wins=$${values.length}`);
    }
    
    if (losses !== undefined) {
      values.push(losses);
      updateFields.push(`losses=$${values.length}`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id=$${values.length} RETURNING *`;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE team
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete associated players first
      await client.query("DELETE FROM players WHERE team_id=$1", [id]);
      
      // Delete team
      const result = await client.query("DELETE FROM teams WHERE id=$1 RETURNING *", [id]);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: "Team not found" });
      }
      
      await client.query('COMMIT');
      res.status(204).send();
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM teams WHERE id=$1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET players by team ID
router.get("/:id/players", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if team exists
    const teamResult = await pool.query("SELECT * FROM teams WHERE id=$1", [id]);
    
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    const playersResult = await pool.query("SELECT * FROM players WHERE team_id=$1", [id]);
    res.json(playersResult.rows);
  } catch (error) {
    console.error("Error fetching team players:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team rankings
router.get("/rankings/all", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teams ORDER BY wins DESC, prelim_points DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching team rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
