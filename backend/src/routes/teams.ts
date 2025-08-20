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
    const { name, players } = req.body as CreateTeamDto;
    if (!name) return res.status(400).json({ error: "Name is required" });

    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Create team
      const [result] = await connection.query(
        "INSERT INTO teams (name) VALUES (?)",
        [name]
      );
      const teamId = (result as any).insertId;
      
      // Get the created team
      const [teams] = await connection.query(
        "SELECT * FROM teams WHERE id = ?",
        [teamId]
      );
      const team = (teams as any[])[0];
      
      // Create players if provided
      if (players && players.length > 0) {
        for (const playerName of players) {
          await connection.query(
            "INSERT INTO players (name, team_id) VALUES (?, ?)",
            [playerName, teamId]
          );
        }
      }
      
      await connection.commit();
      res.status(201).json(team);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
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
      updateFields.push(`name = ?`);
    }
    
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
      return res.status(404).json({ error: "Team not found" });
    }
    
    // Get the updated team
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
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete associated players first
      await connection.query("DELETE FROM players WHERE team_id = ?", [id]);
      
      // Delete team
      const [result] = await connection.query("DELETE FROM teams WHERE id = ?", [id]);
      
      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: "Team not found" });
      }
      
      await connection.commit();
      res.status(204).send();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
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

// GET players by team ID
router.get("/:id/players", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if team exists
    const [teams] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);
    
    if ((teams as any[]).length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    const [players] = await pool.query("SELECT * FROM players WHERE team_id = ?", [id]);
    res.json(players);
  } catch (error) {
    console.error("Error fetching team players:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET team rankings
router.get("/rankings/all", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM teams ORDER BY wins DESC, prelim_points DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team rankings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
