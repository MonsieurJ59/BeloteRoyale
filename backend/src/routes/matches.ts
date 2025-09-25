import { Router } from "express";
import { pool } from "../db";
import type { CreateMatchDto, UpdateMatchDto } from "../types";

const router = Router();

// GET all matches (with optional tournament_id filter)
router.get("/", async (req, res) => {
  try {
    const { tournament_id } = req.query;
    
    let query = "SELECT m.*, ta.name as team_a_name, tb.name as team_b_name, t.name as tournament_name " +
      "FROM matches m " +
      "JOIN teams ta ON m.team_a_id = ta.id " +
      "JOIN teams tb ON m.team_b_id = tb.id " +
      "JOIN tournaments t ON m.tournament_id = t.id";
    
    const queryParams: any[] = [];
    
    if (tournament_id) {
      query += " WHERE m.tournament_id = ?";
      queryParams.push(tournament_id);
    }
    
    query += " ORDER BY m.id ASC";
    
    const [rows] = await pool.query(query, queryParams);
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
    const { tournament_id, match_type, team_a_id, team_b_id, score_a = 0, score_b = 0, winner_id = null, match_order } = req.body as CreateMatchDto;
    
    if (!tournament_id) return res.status(400).json({ error: "Tournament ID is required" });
    if (!match_type) return res.status(400).json({ error: "match_type is required" });
    if (!team_a_id) return res.status(400).json({ error: "Team A ID is required" });
    if (!team_b_id) return res.status(400).json({ error: "Team B ID is required" });
    
    // Validate tournament exists
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournament_id]);
    if ((tournaments as any[]).length === 0) {
      return res.status(400).json({ error: "Tournament does not exist" });
    }
    
    // Validate teams exist
    const [teams] = await pool.query("SELECT id FROM teams WHERE id IN (?, ?)", [team_a_id, team_b_id]);
    if ((teams as any[]).length !== 2) {
      return res.status(400).json({ error: "One or both teams do not exist" });
    }

    // Validate both teams are registered to the tournament
    const [registrations] = await pool.query(
      "SELECT team_id FROM team_tournament WHERE tournament_id = ? AND team_id IN (?, ?)",
      [tournament_id, team_a_id, team_b_id]
    );
    if ((registrations as any[]).length !== 2) {
      return res.status(400).json({ error: "Both teams must be registered to this tournament" });
    }
    
    // Create match
    const [result] = await pool.query(
      "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id, score_a, score_b, winner_id, match_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [tournament_id, match_type, team_a_id, team_b_id, score_a, score_b, winner_id, match_order]
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

// GET matches by tournament and type
router.get("/tournament/:tournamentId/type/:matchType", async (req, res) => {
  try {
    const { tournamentId, matchType } = req.params;
    
    // Validate tournament exists
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    const [rows] = await pool.query(
      "SELECT m.*, ta.name as team_a_name, tb.name as team_b_name, t.name as tournament_name " +
      "FROM matches m " +
      "JOIN teams ta ON m.team_a_id = ta.id " +
      "JOIN teams tb ON m.team_b_id = tb.id " +
      "JOIN tournaments t ON m.tournament_id = t.id " +
      "WHERE m.tournament_id = ? AND m.match_type = ? ORDER BY m.id ASC",
      [tournamentId, matchType]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET matches by type for all tournaments
router.get("/type/:matchType", async (req, res) => {
  try {
    const { matchType } = req.params;
    const [rows] = await pool.query(
      "SELECT m.*, ta.name as team_a_name, tb.name as team_b_name, t.name as tournament_name " +
      "FROM matches m " +
      "JOIN teams ta ON m.team_a_id = ta.id " +
      "JOIN teams tb ON m.team_b_id = tb.id " +
      "JOIN tournaments t ON m.tournament_id = t.id " +
      "WHERE m.match_type = ? ORDER BY m.tournament_id, m.id ASC",
      [matchType]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate preliminary matches for a tournament
router.post("/tournament/:tournamentId/generate/prelim", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    // Validate tournament exists
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Use only teams registered to this tournament
      const [teams] = await connection.query(
        "SELECT tt.team_id AS id FROM team_tournament tt WHERE tt.tournament_id = ? ORDER BY tt.registration_date ASC",
        [tournamentId]
      );
      if ((teams as any[]).length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams" });
      }
      
      // Delete existing preliminary matches for this tournament
      await connection.query("DELETE FROM matches WHERE tournament_id = ? AND match_type = 'preliminaires'", [tournamentId]);
      
      // Reset preliminary points for all registered teams in this tournament
      await connection.query(
        "UPDATE team_tournament_stats SET prelim_points = 0 WHERE tournament_id = ?", 
        [tournamentId]
      );
      
      // Ensure team_tournament_stats entries exist for registered teams
      for (const team of (teams as any[])) {
        const [existingStats] = await connection.query(
          "SELECT id FROM team_tournament_stats WHERE team_id = ? AND tournament_id = ?",
          [team.id, tournamentId]
        );
        
        if ((existingStats as any[]).length === 0) {
          await connection.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, 0, 0, 0)",
            [team.id, tournamentId]
          );
        }
      }
      // Build round-robin combinations
      const matches = [] as { team_a_id: number; team_b_id: number }[];
      for (let i = 0; i < (teams as any[]).length; i++) {
        for (let j = i + 1; j < (teams as any[]).length; j++) {
          matches.push({ team_a_id: (teams as any[])[i].id, team_b_id: (teams as any[])[j].id });
        }
      }
      
      // Respect max_matches from tournament_match_configs if provided
      const [configRows] = await connection.query(
        "SELECT max_matches FROM tournament_match_configs WHERE tournament_id = ? AND match_type = 'preliminaires' AND is_enabled = 1 LIMIT 1",
        [tournamentId]
      );
      const maxMatches = (configRows as any[])[0]?.max_matches as number | null | undefined;
      const matchesToCreate = typeof maxMatches === 'number' && maxMatches > 0 ? matches.slice(0, maxMatches) : matches;

      for (const match of matchesToCreate) {
        await connection.query(
          "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id) VALUES (?, 'preliminaires', ?, ?)", 
          [tournamentId, match.team_a_id, match.team_b_id]
        );
      }
      
      await connection.commit();
      res.status(201).json({ message: `Generated ${matchesToCreate.length} preliminary matches for tournament ${tournamentId}` });
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

// Generate main matches for a tournament
router.post("/tournament/:tournamentId/generate/main", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    // Validate tournament exists
    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Get teams with their stats for this tournament, ordered by prelim points
      // Only teams registered to this tournament with stats
      const [teamsWithStats] = await connection.query(
        "SELECT t.id, ts.prelim_points FROM teams t " +
        "JOIN team_tournament_stats ts ON t.id = ts.team_id " +
        "JOIN team_tournament tt ON tt.team_id = t.id AND tt.tournament_id = ts.tournament_id " +
        "WHERE ts.tournament_id = ? " +
        "ORDER BY ts.prelim_points DESC",
        [tournamentId]
      );
      
      if ((teamsWithStats as any[]).length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams" });
      }
      
      // Delete existing main matches for this tournament
      await connection.query("DELETE FROM matches WHERE tournament_id = ? AND match_type LIKE 'principal_%'", [tournamentId]);
      
      // Shuffle teams with similar prelim points to add some randomness while respecting rankings
      const groupedTeams: any[][] = [];
      let currentGroup: any[] = [];
      let currentPoints: number | null = null;
      
      for (const team of (teamsWithStats as any[])) {
        // Vérifier que team.prelim_points existe et n'est pas undefined
        const teamPoints = team.prelim_points !== undefined ? team.prelim_points : 0;
        
        if (currentPoints === null || teamPoints === currentPoints) {
          currentGroup.push(team);
          currentPoints = teamPoints;
        } else {
          if (currentGroup.length > 0) {
            groupedTeams.push([...currentGroup]);
          }
          currentGroup = [team];
          currentPoints = teamPoints;
        }
      }
      
      if (currentGroup.length > 0) {
        groupedTeams.push(currentGroup);
      }
      
      // Shuffle each group of teams with the same points
      for (let i = 0; i < groupedTeams.length; i++) {
        const group = groupedTeams[i];
        if (group && group.length > 0) {
          groupedTeams[i] = group.sort(() => Math.random() - 0.5);
        }
      }
      
      // Flatten the groups back into a single array
      const sortedTeams = groupedTeams.flat();
      
      const newMatches: { team_a_id: number; team_b_id: number }[] = [];
      for (let i = 0; i < sortedTeams.length - 1; i += 2) {
        newMatches.push({ team_a_id: sortedTeams[i].id, team_b_id: sortedTeams[i + 1].id });
      }
      
      // Respect max_matches from tournament_match_configs for principal_1
      const [configRows] = await connection.query(
        "SELECT max_matches FROM tournament_match_configs WHERE tournament_id = ? AND match_type = 'principal_1' AND is_enabled = 1 LIMIT 1",
        [tournamentId]
      );
      const maxMatches = (configRows as any[])[0]?.max_matches as number | null | undefined;
      const matchesToCreate = typeof maxMatches === 'number' && maxMatches > 0 ? newMatches.slice(0, maxMatches) : newMatches;

      for (const match of matchesToCreate) {
        await connection.query(
          "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id) VALUES (?, 'principal_1', ?, ?)", 
          [tournamentId, match.team_a_id, match.team_b_id]
        );
      }
      
      // Update tournament status to in_progress if it was upcoming
      await connection.query(
        "UPDATE tournaments SET status = 'in_progress' WHERE id = ? AND status = 'upcoming'",
        [tournamentId]
      );
      
      await connection.commit();
      res.status(201).json({ message: `Generated ${matchesToCreate.length} main matches for tournament ${tournamentId}` });
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