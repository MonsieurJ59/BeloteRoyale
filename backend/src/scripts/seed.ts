import { pool } from "../db";

async function seed() {
  try {
    // Vérifier si la table team_tournament_stats existe
    const [tables] = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'belote' AND table_name = 'team_tournament_stats'"
    );
    
    // Si la table n'existe pas, on exécute uniquement le seed pour les tables existantes
    if ((tables as any[]).length === 0) {
      console.log("⚠️ La table team_tournament_stats n'existe pas. Exécution du seed pour les tables existantes uniquement.");
      // Nettoyer les tables existantes
      await pool.query("DELETE FROM matches");
      await pool.query("DELETE FROM teams");
    } else {
      // Nettoyer toutes les tables (dans l'ordre pour respecter les contraintes de clés étrangères)
      await pool.query("DELETE FROM matches");
      await pool.query("DELETE FROM team_tournament_stats");
      await pool.query("DELETE FROM teams");
      await pool.query("DELETE FROM tournaments");
    }

    // Variable pour stocker l'ID du tournoi
    let tournamentId: number | null = null;
    
    // Vérifier si la table tournaments existe
    const [tournamentsTable] = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'belote' AND table_name = 'tournaments'"
    );
    
    // Créer un tournoi si la table existe
    if ((tournamentsTable as any[]).length > 0) {
      const [tournament] = await pool.query(
        "INSERT INTO tournaments (name, date, status) VALUES (?, ?, ?)",
        ["Tournoi de Printemps 2023", new Date("2023-04-15"), "in_progress"]
      );
      tournamentId = (tournament as any).insertId;
    }

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

    // Vérifier si la table team_tournament_stats existe
    const [statsTable] = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'belote' AND table_name = 'team_tournament_stats'"
    );
    
    // Créer les entrées dans team_tournament_stats pour chaque équipe si la table existe et si un tournoi a été créé
    if ((statsTable as any[]).length > 0 && tournamentId !== null) {
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [team1Id, tournamentId, 0, 0, 0]
      );
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [team2Id, tournamentId, 0, 0, 0]
      );
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [team3Id, tournamentId, 0, 0, 0]
      );
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [team4Id, tournamentId, 0, 0, 0]
      );
    }

    // --- Matchs préliminaires ---
    if (tournamentId !== null) {
      // Version avec tournoi
      await pool.query(
        "INSERT INTO matches (tournament_id, is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tournamentId, true, team1Id, team2Id, 520, 480, team1Id]
      );
      
      // Mettre à jour les stats si la table team_tournament_stats existe
      if ((statsTable as any[]).length > 0) {
        await pool.query(
          "UPDATE team_tournament_stats SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [520, team1Id, tournamentId]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [480, team2Id, tournamentId]
        );
      }
      
      await pool.query(
        "INSERT INTO matches (tournament_id, is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tournamentId, true, team3Id, team4Id, 230, 460, team4Id]
      );
      
      if ((statsTable as any[]).length > 0) {
        await pool.query(
          "UPDATE team_tournament_stats SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [460, team4Id, tournamentId]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [230, team3Id, tournamentId]
        );
      }
    } else {
      // Version sans tournoi (ancienne structure)
      await pool.query(
        "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
        [true, team1Id, team2Id, 520, 480, team1Id]
      );
      
      // Mettre à jour les stats dans la table teams si nécessaire
      const [teamsColumns] = await pool.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema = 'belote' AND table_name = 'teams' AND column_name IN ('prelim_points', 'wins', 'losses')"
      );
      
      if ((teamsColumns as any[]).length > 0) {
        await pool.query(
          "UPDATE teams SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE id = ?",
          [520, team1Id]
        );
        await pool.query(
          "UPDATE teams SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE id = ?",
          [480, team2Id]
        );
      }
      
      await pool.query(
        "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
        [true, team3Id, team4Id, 230, 460, team4Id]
      );
      
      if ((teamsColumns as any[]).length > 0) {
        await pool.query(
          "UPDATE teams SET prelim_points = prelim_points + ?, wins = wins + 1 WHERE id = ?",
          [460, team4Id]
        );
        await pool.query(
          "UPDATE teams SET prelim_points = prelim_points + ?, losses = losses + 1 WHERE id = ?",
          [230, team3Id]
        );
      }
    }

    // --- Match principal ---
    if (tournamentId !== null) {
      // Version avec tournoi
      await pool.query(
        "INSERT INTO matches (tournament_id, is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tournamentId, false, team1Id, team4Id, 1000, 750, team1Id]
      );
      
      if ((statsTable as any[]).length > 0) {
        await pool.query(
          "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [team1Id, tournamentId]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [team4Id, tournamentId]
        );
      }
    } else {
      // Version sans tournoi (ancienne structure)
      await pool.query(
        "INSERT INTO matches (is_prelim, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?)",
        [false, team1Id, team4Id, 1000, 750, team1Id]
      );
    }

    // Créer un deuxième tournoi (à venir)
     if ((tournamentsTable as any[]).length > 0) {
       const [tournament2] = await pool.query(
         "INSERT INTO tournaments (name, date, status) VALUES (?, ?, ?)",
         ["Tournoi d'Été 2023", new Date("2023-07-20"), "upcoming"]
       );
       const tournament2Id = (tournament2 as any).insertId;

       // Ajouter les équipes au deuxième tournoi si la table team_tournament_stats existe
        if ((statsTable as any[]).length > 0) {
          await pool.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
            [team1Id, tournament2Id, 0, 0, 0]
          );
          await pool.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
            [team2Id, tournament2Id, 0, 0, 0]
          );
          await pool.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
            [team3Id, tournament2Id, 0, 0, 0]
          );
          await pool.query(
            "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
            [team4Id, tournament2Id, 0, 0, 0]
          );
        }
      }

    console.log("✅ Fixtures insérées avec stats mises à jour !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

seed();
