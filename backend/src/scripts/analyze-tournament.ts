import { pool } from "../db";

async function analyzeTournament() {
  try {
    console.log("🔍 Analyse du tournoi terminé...");
    
    // Récupérer le premier tournoi (terminé)
    const [tournaments] = await pool.query(
      "SELECT * FROM tournaments WHERE status = 'completed' ORDER BY id LIMIT 1"
    ) as any[];
    
    if (tournaments.length === 0) {
      console.log("❌ Aucun tournoi terminé trouvé");
      return;
    }
    
    const tournament = tournaments[0];
    console.log(`📊 Analyse du tournoi: ${tournament.name} (ID: ${tournament.id})`);
    
    // Récupérer la configuration du tournoi pour connaître le nombre de manches principales
    const [matchConfigs] = await pool.query(
      "SELECT * FROM tournament_match_configs WHERE tournament_id = ? AND match_type = 'principal_1'",
      [tournament.id]
    ) as any[];
    
    const expectedPrincipalRounds = matchConfigs.length > 0 ? matchConfigs[0].max_matches : 8;
    console.log(`🎯 Nombre de manches principales attendues: ${expectedPrincipalRounds}`);
    
    // Récupérer toutes les équipes inscrites (correction du nom de table)
    const [registeredTeams] = await pool.query(
      "SELECT t.* FROM teams t JOIN team_tournament tt ON t.id = tt.team_id WHERE tt.tournament_id = ?",
      [tournament.id]
    ) as any[];
    
    console.log(`👥 Équipes inscrites: ${registeredTeams.length}`);
    
    // Analyser les matchs par équipe
    const teamAnalysis = new Map();
    let allTeamsValid = true;
    
    for (const team of registeredTeams) {
      // Récupérer tous les matchs de l'équipe
      const [allMatches] = await pool.query(
        "SELECT * FROM matches WHERE tournament_id = ? AND (team_a_id = ? OR team_b_id = ?)",
        [tournament.id, team.id, team.id]
      ) as any[];
      
      // Séparer les matchs préliminaires et principaux
      const prelimMatches = allMatches.filter((m: any) => m.match_type === 'preliminaires');
      const principalMatches = allMatches.filter((m: any) => m.match_type.startsWith('principal_'));
      
      // Compter les victoires et défaites dans les matchs principaux uniquement
      let victories = 0;
      let defeats = 0;
      
      for (const match of principalMatches) {
        if (match.winner_id === team.id) {
          victories++;
        } else if (match.winner_id !== null) {
          defeats++;
        }
      }
      
      // Analyser les manches principales jouées
      const roundsPlayed = new Set<number>();
      for (const match of principalMatches) {
        const roundNumber = match.match_type.replace('principal_', '');
        roundsPlayed.add(parseInt(roundNumber));
      }
      
      const analysis = {
        teamName: team.name,
        totalMatches: allMatches.length,
        prelimMatches: prelimMatches.length,
        principalMatches: principalMatches.length,
        victories,
        defeats,
        totalVictoriesDefeats: victories + defeats,
        roundsPlayed: Array.from(roundsPlayed).sort((a: number, b: number) => a - b),
        expectedRounds: Array.from({length: expectedPrincipalRounds}, (_, i) => i + 1)
      };
      
      teamAnalysis.set(team.id, analysis);
      
      // Vérifier si l'équipe respecte les critères
      const hasCorrectRounds = analysis.roundsPlayed.length === expectedPrincipalRounds;
      const hasCorrectTotal = analysis.totalVictoriesDefeats === expectedPrincipalRounds;
      
      if (!hasCorrectRounds || !hasCorrectTotal) {
        allTeamsValid = false;
      }
    }
    
    // Afficher les résultats détaillés
    console.log("\n📈 Analyse détaillée par équipe:");
    console.log("=".repeat(100));
    console.log("Équipe".padEnd(20) + "Matchs".padEnd(8) + "Prélim".padEnd(8) + "Principal".padEnd(10) + "Victoires".padEnd(10) + "Défaites".padEnd(10) + "Total V+D".padEnd(10) + "Manches jouées");
    console.log("-".repeat(100));
    
    for (const [teamId, analysis] of teamAnalysis) {
      const roundsStr = analysis.roundsPlayed.join(',');
      const isValid = analysis.totalVictoriesDefeats === expectedPrincipalRounds && analysis.roundsPlayed.length === expectedPrincipalRounds;
      const status = isValid ? "✅" : "❌";
      
      console.log(
        `${status} ${analysis.teamName.padEnd(18)}` +
        `${analysis.totalMatches.toString().padEnd(8)}` +
        `${analysis.prelimMatches.toString().padEnd(8)}` +
        `${analysis.principalMatches.toString().padEnd(10)}` +
        `${analysis.victories.toString().padEnd(10)}` +
        `${analysis.defeats.toString().padEnd(10)}` +
        `${analysis.totalVictoriesDefeats.toString().padEnd(10)}` +
        `[${roundsStr}]`
      );
    }
    
    console.log("=".repeat(100));
    
    // Résumé de validation
    if (allTeamsValid) {
      console.log(`✅ TOURNOI VALIDE: Toutes les équipes ont joué exactement ${expectedPrincipalRounds} manches principales`);
      console.log(`✅ Chaque équipe a un total victoires + défaites = ${expectedPrincipalRounds}`);
    } else {
      console.log(`❌ TOURNOI INVALIDE: Certaines équipes n'ont pas le bon nombre de matchs ou de victoires/défaites`);
      
      // Détailler les problèmes
      console.log("\n🔍 Problèmes détectés:");
      for (const [teamId, analysis] of teamAnalysis) {
        const hasCorrectRounds = analysis.roundsPlayed.length === expectedPrincipalRounds;
        const hasCorrectTotal = analysis.totalVictoriesDefeats === expectedPrincipalRounds;
        
        if (!hasCorrectRounds) {
          console.log(`  ❌ ${analysis.teamName}: a joué ${analysis.roundsPlayed.length} manches au lieu de ${expectedPrincipalRounds}`);
          const missingRounds = analysis.expectedRounds.filter((r: number) => !analysis.roundsPlayed.includes(r));
          if (missingRounds.length > 0) {
            console.log(`     Manches manquantes: [${missingRounds.join(',')}]`);
          }
        }
        
        if (!hasCorrectTotal) {
          console.log(`  ❌ ${analysis.teamName}: total V+D = ${analysis.totalVictoriesDefeats} au lieu de ${expectedPrincipalRounds}`);
        }
      }
    }
    
    // Analyser les types de matchs
    const [allMatches] = await pool.query(
      "SELECT match_type, COUNT(*) as count FROM matches WHERE tournament_id = ? GROUP BY match_type ORDER BY match_type",
      [tournament.id]
    ) as any[];
    
    console.log("\n📋 Répartition des matchs par type:");
    for (const match of allMatches) {
      console.log(`  ${match.match_type}: ${match.count} matchs`);
    }
    
    // Vérification globale
    const expectedTotalPrincipalMatches = (registeredTeams.length / 2) * expectedPrincipalRounds;
    const actualPrincipalMatches = allMatches
      .filter((m: any) => m.match_type.startsWith('principal_'))
      .reduce((sum: number, m: any) => sum + m.count, 0);
    
    console.log(`\n🎯 Vérification globale:`);
    console.log(`  Matchs principaux attendus: ${expectedTotalPrincipalMatches} (${registeredTeams.length} équipes ÷ 2 × ${expectedPrincipalRounds} manches)`);
    console.log(`  Matchs principaux trouvés: ${actualPrincipalMatches}`);
    
    if (actualPrincipalMatches === expectedTotalPrincipalMatches) {
      console.log(`  ✅ Nombre total de matchs principaux correct`);
    } else {
      console.log(`  ❌ Nombre total de matchs principaux incorrect`);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse:", error);
  } finally {
    await pool.end();
  }
}

analyzeTournament();