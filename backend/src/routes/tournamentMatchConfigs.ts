import { Router } from "express";
import { pool } from "../db";
import type { CreateTournamentMatchConfigDto, MatchType } from "../types";

const router = Router();

// GET configs for a tournament
router.get("/tournament/:tournamentId/configs", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM tournament_match_configs WHERE tournament_id = ? ORDER BY id ASC",
      [tournamentId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching match configs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST add a config for a tournament
router.post("/tournament/:tournamentId/configs", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { match_type, is_enabled, max_matches } = req.body as Omit<CreateTournamentMatchConfigDto, "tournament_id"> & { match_type: MatchType };

    const [tournaments] = await pool.query("SELECT id FROM tournaments WHERE id = ?", [tournamentId]);
    if ((tournaments as any[]).length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, match_type]
    );
    if ((existing as any[]).length > 0) {
      return res.status(400).json({ error: "Config for this match_type already exists" });
    }

    // Enforce business rules:
    // - preliminaires must stay enabled
    // - principal_1 must be enabled and have max_matches >= 1
    if (match_type === 'preliminaires' && is_enabled === false) {
      return res.status(400).json({ error: "'preliminaires' config must be enabled" });
    }
    if (match_type === 'principal_1') {
      const mm = max_matches ?? 1;
      if (is_enabled === false || mm < 1) {
        return res.status(400).json({ error: "'principal_1' must be enabled with max_matches >= 1" });
      }
    }

    await pool.query(
      "INSERT INTO tournament_match_configs (tournament_id, match_type, is_enabled, max_matches) VALUES (?, ?, ?, ?)",
      [tournamentId, match_type, is_enabled ?? true, max_matches ?? null]
    );

    const [rows] = await pool.query(
      "SELECT * FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, match_type]
    );
    res.status(201).json((rows as any[])[0]);
  } catch (error) {
    console.error("Error creating match config:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update a config
router.patch("/tournament/:tournamentId/configs/:matchType", async (req, res) => {
  try {
    const { tournamentId, matchType } = req.params;
    const { is_enabled, max_matches } = req.body as { is_enabled?: boolean; max_matches?: number | null };

    const [existing] = await pool.query(
      "SELECT id FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, matchType]
    );
    if ((existing as any[]).length === 0) {
      return res.status(404).json({ error: "Config not found" });
    }

    // Enforce business rules before updating
    if (matchType === 'preliminaires' && is_enabled === false) {
      return res.status(400).json({ error: "'preliminaires' config must remain enabled" });
    }
    if (matchType === 'principal_1') {
      // If disabling or setting max < 1, reject
      if (is_enabled === false) {
        return res.status(400).json({ error: "'principal_1' must remain enabled" });
      }
      if (max_matches !== undefined && max_matches !== null && max_matches < 1) {
        return res.status(400).json({ error: "'principal_1' max_matches must be >= 1" });
      }
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    if (typeof is_enabled === "boolean") {
      updateFields.push("is_enabled = ?");
      values.push(is_enabled);
    }
    if (max_matches !== undefined) {
      updateFields.push("max_matches = ?");
      values.push(max_matches);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(tournamentId, matchType);

    await pool.query(
      `UPDATE tournament_match_configs SET ${updateFields.join(", ")} WHERE tournament_id = ? AND match_type = ?`,
      values
    );

    const [rows] = await pool.query(
      "SELECT * FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, matchType]
    );
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error updating match config:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a config
router.delete("/tournament/:tournamentId/configs/:matchType", async (req, res) => {
  try {
    const { tournamentId, matchType } = req.params;

    const [existing] = await pool.query(
      "SELECT id FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, matchType]
    );
    if ((existing as any[]).length === 0) {
      return res.status(404).json({ error: "Config not found" });
    }

    await pool.query(
      "DELETE FROM tournament_match_configs WHERE tournament_id = ? AND match_type = ?",
      [tournamentId, matchType]
    );

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match config:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
