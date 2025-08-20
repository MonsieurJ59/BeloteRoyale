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
    const { name, date, status = 'upcoming' } = req.body as CreateTournamentDto;
    
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!date) return res.status(400).json({ error: "Date is required" });
    
    // Create tournament
    const [result] = await pool.query(
      "INSERT INTO tournaments (name, date, status) VALUES (?, ?, ?)",
      [name, date, status]
    );
    
    const tournamentId = (result as any).insertId;
    const [tournaments] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [tournamentId]);
    res.status(201).json((tournaments as any[])[0]);
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