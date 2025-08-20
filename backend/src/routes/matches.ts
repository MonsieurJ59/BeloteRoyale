import { Router } from "express";
import { pool } from "../db";
import type { CreateMatchDto, UpdateMatchDto } from "../types";

const router = Router();

// GET all matches
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM matches ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET match by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM matches WHERE id=$1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create match
router.post("/", async (req, res) => {
  try {
    const { round, team_a_id, team_b_id, score_a = 0, score_b = 0, winner_id = null } = req.body as CreateMatchDto;
    
    // Validate required fields
    if (!round) return res.status(400).json({ error: "Round is required" });
    if (!team_a_id) return res.status(400).json({ error: "Team A ID is required" });
    if (!team_b_id) return res.status(400).json({ error: "Team B ID is required" });
    
    // Validate teams exist
    const teamsResult = await pool.query(
      "SELECT id FROM teams WHERE id IN ($1, $2)",
      [team_a_id, team_b_id]
    );
    
    if (teamsResult.rows.length !== 2) {
      return res.status(400).json({ error: "One or both teams do not exist" });
    }
    
    // Create match
    const result = await pool.query(
      "INSERT INTO matches (round, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [round, team_a_id, team_b_id, score_a, score_b, winner_id]
    );
    
    res.status(201).json(result.rows[0]);
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
    
    // Build dynamic query based on provided fields
    let query = "UPDATE matches SET ";
    const values: any[] = [];
    const updateFields: string[] = [];
    
    if (score_a !== undefined) {
      values.push(score_a);
      updateFields.push(`score_a=$${values.length}`);
    }
    
    if (score_b !== undefined) {
      values.push(score_b);
      updateFields.push(`score_b=$${values.length}`);
    }
    
    if (winner_id !== undefined) {
      values.push(winner_id);
      updateFields.push(`winner_id=$${values.length}`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    query += updateFields.join(", ");
    values.push(id);
    query += ` WHERE id=$${values.length} RETURNING *`;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    
    // If winner is updated, update team stats
    if (winner_id !== undefined) {
      const match = result.rows[0];
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Get the teams involved
        const teamsResult = await client.query(
          "SELECT id FROM teams WHERE id IN ($1, $2)",
          [match.team_a_id, match.team_b_id]
        );
        
        if (teamsResult.rows.length === 2) {
          // If there's a winner, update wins/losses
          if (winner_id) {
            // Update winner
            await client.query(
              "UPDATE teams SET wins = wins + 1 WHERE id = $1",
              [winner_id]
            );
            
            // Update loser
            const loserId = winner_id === match.team_a_id ? match.team_b_id : match.team_a_id;
            await client.query(
              "UPDATE teams SET losses = losses + 1 WHERE id = $1",
              [loserId]
            );
          }
        }
        
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE match
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM matches WHERE id=$1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET matches by round
router.get("/round/:round", async (req, res) => {
  try {
    const { round } = req.params;
    
    if (round !== 'preliminaire' && round !== 'principal') {
      return res.status(400).json({ error: "Invalid round type" });
    }
    
    const result = await pool.query(
      "SELECT m.*, ta.name as team_a_name, tb.name as team_b_name " +
      "FROM matches m " +
      "JOIN teams ta ON m.team_a_id = ta.id " +
      "JOIN teams tb ON m.team_b_id = tb.id " +
      "WHERE m.round = $1 " +
      "ORDER BY m.id ASC",
      [round]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(`Error fetching ${req.params.round} matches:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate preliminary round matches
router.post("/generate/preliminary", async (_req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get all teams
      const teamsResult = await client.query("SELECT id FROM teams");
      const teams = teamsResult.rows;
      
      if (teams.length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams to generate matches" });
      }
      
      // Clear existing preliminary matches
      await client.query("DELETE FROM matches WHERE round = 'preliminaire'");
      
      // Reset preliminary points
      await client.query("UPDATE teams SET prelim_points = 0");
      
      // Generate all possible team combinations
      const matches = [];
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push({
            team_a_id: teams[i].id,
            team_b_id: teams[j].id
          });
        }
      }
      
      // Insert matches
      for (const match of matches) {
        await client.query(
          "INSERT INTO matches (round, team_a_id, team_b_id) VALUES ('preliminaire', $1, $2)",
          [match.team_a_id, match.team_b_id]
        );
      }
      
      await client.query('COMMIT');
      res.status(201).json({ message: `Generated ${matches.length} preliminary matches` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error generating preliminary matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate main round matches
router.post("/generate/main", async (_req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get all teams
      const teamsResult = await client.query("SELECT id FROM teams");
      const teams = teamsResult.rows;
      
      if (teams.length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams to generate matches" });
      }
      
      // Get existing main round matches to avoid rematches if possible
      const existingMatchesResult = await client.query(
        "SELECT team_a_id, team_b_id FROM matches WHERE round = 'principal'"
      );
      const existingMatches = existingMatchesResult.rows;
      
      // Create a set of existing match pairs
      const existingPairs = new Set();
      for (const match of existingMatches) {
        // Store both combinations to handle either order
        existingPairs.add(`${match.team_a_id}-${match.team_b_id}`);
        existingPairs.add(`${match.team_b_id}-${match.team_a_id}`);
      }
      
      // Shuffle teams
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      // Generate matches avoiding rematches when possible
      const newMatches = [];
      const matchCount = Math.min(5, Math.floor(teams.length / 2));
      
      // First try to create matches without rematches
      for (let i = 0; i < shuffledTeams.length && newMatches.length < matchCount; i++) {
        for (let j = i + 1; j < shuffledTeams.length && newMatches.length < matchCount; j++) {
          const pairKey = `${shuffledTeams[i].id}-${shuffledTeams[j].id}`;
          
          if (!existingPairs.has(pairKey)) {
            newMatches.push({
              team_a_id: shuffledTeams[i].id,
              team_b_id: shuffledTeams[j].id
            });
            existingPairs.add(pairKey);
            existingPairs.add(`${shuffledTeams[j].id}-${shuffledTeams[i].id}`);
            break;
          }
        }
      }
      
      // If we couldn't create enough matches without rematches, allow rematches
      if (newMatches.length < matchCount) {
        for (let i = 0; i < shuffledTeams.length && newMatches.length < matchCount; i++) {
          for (let j = i + 1; j < shuffledTeams.length && newMatches.length < matchCount; j++) {
            const alreadyMatched = newMatches.some(
              m => (m.team_a_id === shuffledTeams[i].id && m.team_b_id === shuffledTeams[j].id) ||
                   (m.team_a_id === shuffledTeams[j].id && m.team_b_id === shuffledTeams[i].id)
            );
            
            if (!alreadyMatched) {
              newMatches.push({
                team_a_id: shuffledTeams[i].id,
                team_b_id: shuffledTeams[j].id
              });
              break;
            }
          }
        }
      }
      
      // Insert new matches
      for (const match of newMatches) {
        await client.query(
          "INSERT INTO matches (round, team_a_id, team_b_id) VALUES ('principal', $1, $2)",
          [match.team_a_id, match.team_b_id]
        );
      }
      
      await client.query('COMMIT');
      res.status(201).json({ message: `Generated ${newMatches.length} main round matches` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error generating main round matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;