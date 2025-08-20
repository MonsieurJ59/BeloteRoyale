import { pool } from "../db";

async function seed() {
  try {
    // Nettoyer les tables
    await pool.query("DELETE FROM matches");
    await pool.query("DELETE FROM teams");

    // Insérer des équipes
    const [team1] = await pool.query(
      "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
      ["Les As", "Alice", "Bob"]
    );
    const team1Id = (team1 as any).insertId;

    const [team2] = await pool.query(
      "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
      ["Les Rois", "Charlie", "David"]
    );
    const team2Id = (team2 as any).insertId;

    const [team3] = await pool.query(
      "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
      ["Les Dames", "Emma", "Frank"]
    );
    const team3Id = (team3 as any).insertId;

    const [team4] = await pool.query(
      "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
      ["Les Valets", "George", "Hugo"]
    );
    const team4Id = (team4 as any).insertId;

    // --- Matchs préliminaires ---
    await pool.query(
      "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
      [true, team1Id, team2Id, 520, 480, team1Id]
    );
    // update stats
    await pool.query(
      "UPDATE teams SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE id = ?",
      [520, team1Id]
    );
    await pool.query(
      "UPDATE teams SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE id = ?",
      [480, team2Id]
    );

    await pool.query(
      "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
      [true, team3Id, team4Id, 230, 460, team4Id]
    );
    await pool.query(
      "UPDATE teams SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE id = ?",
      [460, team4Id]
    );
    await pool.query(
      "UPDATE teams SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE id = ?",
      [230, team3Id]
    );

    // --- Match principal ---
    await pool.query(
      "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
      [false, team1Id, team4Id, 80, 70, team1Id]
    );
    await pool.query(
      "UPDATE teams SET wins = wins + 1 WHERE id = ?",
      [team1Id]
    );
    await pool.query(
      "UPDATE teams SET losses = losses + 1 WHERE id = ?",
      [team4Id]
    );

    console.log("✅ Fixtures insérées avec stats mises à jour !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

seed();
