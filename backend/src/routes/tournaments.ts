import express from "express";
import { pool } from "../db";
import { CreateTournamentDto, UpdateTournamentDto } from "../types";

const router = express.Router();

// GET all tournaments
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tournaments ORDER BY date DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET tournament by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create tournament
router.post("/", async (req, res) => {
  try {
    const { name, date, status = 'upcoming', match_configs, selected_team_ids } = req.body;
    
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!date) return res.status(400).json({ error: "Date is required" });
    
    // Validate configs if provided: require at least one enabled preliminaires and one enabled principal_1 with max_matches >= 1
    if (match_configs && Array.isArray(match_configs)) {
      const prelim = match_configs.find(c => c.match_type === 'preliminaires' && c.is_enabled);
      const principal1 = match_configs.find(c => c.match_type === 'principal_1' && c.is_enabled);

      if (!prelim) {
        return res.status(400).json({ error: "A tournament must have an enabled 'preliminaires' config" });
      }
      if (!principal1) {
        return res.status(400).json({ error: "A tournament must have an enabled 'principal_1' config" });
      }
      if (principal1.max_matches !== undefined && principal1.max_matches !== null && principal1.max_matches < 1) {
        return res.status(400).json({ error: "'principal_1' max_matches must be at least 1" });
      }
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create tournament
      const [result] = await connection.query(
        "INSERT INTO tournaments (name, date, status) VALUES (?, ?, ?)",
        [name, date, status]
      );
      
      const tournamentId = (result as any).insertId;
      
      // Create default match configs if none provided
      const configs = match_configs || [
        { tournament_id: tournamentId, match_type: 'preliminaires', is_enabled: true, max_matches: 10 },
        { tournament_id: tournamentId, match_type: 'principal_1', is_enabled: true, max_matches: 5 }
      ];
      
      // Insert match configs (ensure tournament_id is correct)
      for (const config of configs) {
        await connection.query(
          "INSERT INTO tournament_match_configs (tournament_id, match_type, is_enabled, max_matches) VALUES (?, ?, ?, ?)",
          [tournamentId, config.match_type, config.is_enabled, config.max_matches]
        );
      }
      
      // Enroll selected teams if provided
      if (selected_team_ids && Array.isArray(selected_team_ids) && selected_team_ids.length > 0) {
        for (const teamId of selected_team_ids) {
          // Insert into team_tournament table
          await connection.query(
            "INSERT INTO team_tournament (team_id, tournament_id, registration_date) VALUES (?, ?, NOW())",
            [teamId, tournamentId]
          );
          
          // Create stats entry for this team in this tournament
          await connection.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, 0, 0, 0)",
            [teamId, tournamentId]
          );
        }
      }
      
      await connection.commit();
      
      const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [tournamentId]);
      res.status(201).json((tournaments as any[])[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update tournament
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, status } = req.body as UpdateTournamentDto;
    
    let query = "UPDATE tournaments SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (name !== undefined) {
      values.push(name);
      updateFields.push(`name = ?`);
    }
    if (date !== undefined) {
      values.push(date);
      updateFields.push(`date = ?`);
    }
    if (status !== undefined) {
      values.push(status);
      updateFields.push(`status = ?`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id = ?`;

    const [result] = await pool.query(query, values);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [id]);
    res.json((tournaments as any[])[0]);
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE tournament
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [id]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    await pool.query("DELETE FROM tournaments WHERE id = ?", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET active tournament
router.get("/status/active", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tournaments WHERE status = 'in_progress' LIMIT 1");
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "No active tournament found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching active tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;