import { pool } from "../db";

async function seed() {
  try {
    console.log("🌱 Démarrage du seed avec données simplifiées...");

    // Nettoyer toutes les tables (dans l'ordre pour respecter les contraintes de clés étrangères)
    console.log("🧹 Nettoyage des tables existantes...");
    await pool.query("DELETE FROM matches");
    await pool.query("DELETE FROM team_tournament_stats");
    await pool.query("DELETE FROM team_tournament");
    await pool.query("DELETE FROM tournament_match_configs");
    await pool.query("DELETE FROM teams");
    await pool.query("DELETE FROM tournaments");

    // ==========================================
    // CRÉATION DES ÉQUIPES (30 équipes)
    // ==========================================
    console.log("👥 Création de 30 équipes...");
    
    const teams = [
      // Équipes thématiques françaises
      { name: "Les As de Pique", player1: "Antoine", player2: "Amélie" },
      { name: "Les Rois de Cœur", player1: "Baptiste", player2: "Béatrice" },
      { name: "Les Dames de Carreau", player1: "Clément", player2: "Camille" },
      { name: "Les Valets de Trèfle", player1: "Damien", player2: "Delphine" },
      { name: "Les Maîtres du Jeu", player1: "Étienne", player2: "Élise" },
      { name: "Les Champions", player1: "Fabien", player2: "Fanny" },
      { name: "Les Virtuoses", player1: "Gabriel", player2: "Gabrielle" },
      { name: "Les Stratèges", player1: "Henri", player2: "Hélène" },
      { name: "Les Invincibles", player1: "Julien", player2: "Julie" },
      { name: "Les Légendes", player1: "Kevin", player2: "Karine" },
      
      // Équipes régionales
      { name: "Les Parisiens", player1: "Louis", player2: "Laure" },
      { name: "Les Marseillais", player1: "Marc", player2: "Marie" },
      { name: "Les Lyonnais", player1: "Nicolas", player2: "Nathalie" },
      { name: "Les Toulousains", player1: "Olivier", player2: "Océane" },
      { name: "Les Bordelais", player1: "Pierre", player2: "Pauline" },
      { name: "Les Lillois", player1: "Quentin", player2: "Quitterie" },
      { name: "Les Nantais", player1: "Raphaël", player2: "Rachel" },
      { name: "Les Strasbourgeois", player1: "Sébastien", player2: "Sophie" },
      { name: "Les Rennais", player1: "Thomas", player2: "Théa" },
      { name: "Les Montpelliérains", player1: "Ulysse", player2: "Ursula" },
      
      // Équipes créatives
      { name: "Les Foudres de Belote", player1: "Victor", player2: "Victoire" },
      { name: "Les Éclairs Dorés", player1: "William", player2: "Wendy" },
      { name: "Les Tornades Bleues", player1: "Xavier", player2: "Xavière" },
      { name: "Les Comètes Rouges", player1: "Yann", player2: "Yasmine" },
      { name: "Les Météores Verts", player1: "Zacharie", player2: "Zoé" },
      { name: "Les Phénix Dorés", player1: "Adrien", player2: "Anaïs" },
      { name: "Les Dragons Noirs", player1: "Bastien", player2: "Blandine" },
      { name: "Les Aigles Royaux", player1: "Cédric", player2: "Céline" },
      { name: "Les Lions Sauvages", player1: "Dorian", player2: "Diane" },
      { name: "Les Tigres Blancs", player1: "Émile", player2: "Estelle" }
    ];

    const teamIds: number[] = [];
    for (const team of teams) {
      const [result] = await pool.query(
        "INSERT INTO teams (name, player1, player2) VALUES (?, ?, ?)",
        [team.name, team.player1, team.player2]
      );
      teamIds.push((result as any).insertId);
    }

    // ==========================================
    // CRÉATION DES TOURNOIS (2 tournois)
    // ==========================================
    console.log("🏆 Création de 2 tournois...");

    const tournaments = [
      {
        name: "Championnat de Printemps 2024",
        date: new Date("2024-03-15"),
        status: "completed" as const,
        description: "Tournoi terminé avec tous les matchs joués"
      },
      {
        name: "Coupe d'Été 2024",
        date: new Date("2024-06-20"),
        status: "upcoming" as const,
        description: "Tournoi à venir"
      }
    ];

    const tournamentIds: number[] = [];
    for (const tournament of tournaments) {
      const [result] = await pool.query(
        "INSERT INTO tournaments (name, date, status) VALUES (?, ?, ?)",
        [tournament.name, tournament.date, tournament.status]
      );
      const tournamentId = (result as any).insertId;
      tournamentIds.push(tournamentId);

      // Créer les configurations de match pour chaque tournoi
      await pool.query(
        "INSERT INTO tournament_match_configs (tournament_id, match_type, is_enabled, max_matches) VALUES (?, ?, ?, ?)",
        [tournamentId, 'preliminaires', true, 8]
      );
      
      // Créer 8 configurations pour les manches principales
      for (let i = 1; i <= 8; i++) {
        await pool.query(
          "INSERT INTO tournament_match_configs (tournament_id, match_type, is_enabled, max_matches) VALUES (?, ?, ?, ?)",
          [tournamentId, `principal_${i}`, true, 8]
        );
      }
    }

    // ==========================================
    // INSCRIPTION DES ÉQUIPES AUX TOURNOIS
    // ==========================================
    console.log("📝 Inscription des équipes aux tournois...");

    // Fonction pour mélanger un tableau
    function shuffleArray<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Fix TypeScript error by using temporary variable
        const temp = shuffled[i];
        shuffled[i] = shuffled[j]!;
        shuffled[j] = temp!;
      }
      return shuffled;
    }

    // Inscrire 16 équipes au tournoi terminé
    const completedTournamentTeams = shuffleArray(teamIds).slice(0, 16);
    for (const teamId of completedTournamentTeams) {
      // Inscription équipe-tournoi
      await pool.query(
        "INSERT INTO team_tournament (team_id, tournament_id) VALUES (?, ?)",
        [teamId, tournamentIds[0]]
      );

      // Créer les stats initiales
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [teamId, tournamentIds[0], 0, 0, 0]
      );
    }

    // Inscrire 16 équipes au tournoi à venir
    const upcomingTournamentTeams = shuffleArray(teamIds).slice(0, 16);
    for (const teamId of upcomingTournamentTeams) {
      // Inscription équipe-tournoi
      await pool.query(
        "INSERT INTO team_tournament (team_id, tournament_id) VALUES (?, ?)",
        [teamId, tournamentIds[1]]
      );

      // Créer les stats initiales
      await pool.query(
        "INSERT INTO team_tournament_stats (team_id, tournament_id, prelim_points, wins, losses) VALUES (?, ?, ?, ?, ?)",
        [teamId, tournamentIds[1], 0, 0, 0]
      );
    }

    // ==========================================
    // FONCTION POUR GÉNÉRER UN SCORE
    // ==========================================
    function generateBeloteScore(): { scoreA: number; scoreB: number; winnerId: number } {
      const scores = [
        { scoreA: 162, scoreB: 0, winnerId: 1 },   // Capot
        { scoreA: 258, scoreB: 0, winnerId: 1 },   // Général
        { scoreA: 152, scoreB: 10, winnerId: 1 },  // Victoire normale
        { scoreA: 82, scoreB: 80, winnerId: 1 },   // Victoire serrée
        { scoreA: 91, scoreB: 71, winnerId: 1 },   // Victoire moyenne
        { scoreA: 0, scoreB: 162, winnerId: 2 },   // Capot inverse
        { scoreA: 0, scoreB: 258, winnerId: 2 },   // Général inverse
        { scoreA: 10, scoreB: 152, winnerId: 2 },  // Défaite normale
        { scoreA: 80, scoreB: 82, winnerId: 2 },   // Défaite serrée
        { scoreA: 71, scoreB: 91, winnerId: 2 }    // Défaite moyenne
      ];
      return scores[Math.floor(Math.random() * scores.length)]!;
    }

    // ==========================================
    // TOURNOI TERMINÉ : CRÉATION DES MATCHS
    // ==========================================
    console.log("🏆 Création des matchs pour le tournoi terminé...");
    
    // Phase préliminaires : chaque équipe joue 1 match préliminaire
    for (let i = 0; i < 8; i++) {
      const teamA = completedTournamentTeams[i * 2];
      const teamB = completedTournamentTeams[i * 2 + 1];
      
      const score = generateBeloteScore();
      const winnerId = score.winnerId === 1 ? teamA : teamB;
      
      await pool.query(
        "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tournamentIds[0], 'preliminaires', teamA, teamB, score.scoreA, score.scoreB, winnerId]
      );
      
      // Mettre à jour les statistiques
      if (score.winnerId === 1) {
        await pool.query(
          "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamA, tournamentIds[0]]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamB, tournamentIds[0]]
        );
      } else {
        await pool.query(
          "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamB, tournamentIds[0]]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamA, tournamentIds[0]]
        );
      }
    }

    // Phases principales : 8 manches, chaque équipe joue exactement 1 match par manche
    for (let round = 1; round <= 8; round++) {
      console.log(`Création des matchs principal_${round}...`);
      
      // Utilisation de l'algorithme de round-robin
      // Pour 16 équipes, on fixe une équipe et on fait tourner les 15 autres
      const fixedTeam = completedTournamentTeams[0];
      const rotatingTeams = [...completedTournamentTeams.slice(1)];
      
      // Rotation basée sur la manche
      for (let i = 0; i < round - 1; i++) {
        const firstTeam = rotatingTeams.shift();
        if (firstTeam) rotatingTeams.push(firstTeam);
      }
      
      // Premier match: équipe fixe contre première équipe rotative
      let teamA = fixedTeam;
      let teamB = rotatingTeams[0];
      
      let score = generateBeloteScore();
      let winnerId = score.winnerId === 1 ? teamA : teamB;
      
      await pool.query(
        "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tournamentIds[0], `principal_${round}`, teamA, teamB, score.scoreA, score.scoreB, winnerId]
      );
      
      // Mettre à jour les statistiques
      if (score.winnerId === 1) {
        await pool.query(
          "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamA, tournamentIds[0]]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamB, tournamentIds[0]]
        );
      } else {
        await pool.query(
          "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamB, tournamentIds[0]]
        );
        await pool.query(
          "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
          [teamA, tournamentIds[0]]
        );
      }
      
      // Les 7 autres matchs: appariement des équipes restantes
      for (let i = 0; i < 7; i++) {
        teamA = rotatingTeams[i + 1];
        teamB = rotatingTeams[14 - i];
        
        score = generateBeloteScore();
        winnerId = score.winnerId === 1 ? teamA : teamB;
        
        await pool.query(
          "INSERT INTO matches (tournament_id, match_type, team_a_id, team_b_id, score_a, score_b, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [tournamentIds[0], `principal_${round}`, teamA, teamB, score.scoreA, score.scoreB, winnerId]
        );
        
        // Mettre à jour les statistiques
        if (score.winnerId === 1) {
          await pool.query(
            "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
            [teamA, tournamentIds[0]]
          );
          await pool.query(
            "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
            [teamB, tournamentIds[0]]
          );
        } else {
          await pool.query(
            "UPDATE team_tournament_stats SET wins = wins + 1 WHERE team_id = ? AND tournament_id = ?",
            [teamB, tournamentIds[0]]
          );
          await pool.query(
            "UPDATE team_tournament_stats SET losses = losses + 1 WHERE team_id = ? AND tournament_id = ?",
            [teamA, tournamentIds[0]]
          );
        }
      }
    }

    console.log("✅ Seed terminé avec succès !");
    console.log("📊 Résumé des données créées :");
    console.log(`   - ${teams.length} équipes`);
    console.log(`   - 2 tournois (1 terminé, 1 à venir)`);
    console.log("   - Tournoi 1 : Terminé (16 équipes, 9 matchs chacune)");
    console.log("   - Tournoi 2 : À venir (16 équipes)");

  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
  } finally {
    await pool.end();
  }
}

seed();