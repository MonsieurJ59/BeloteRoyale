import { Team, Match } from '../types/api';

// Fonction pour générer des paires d'équipes en évitant les affrontements précédents
export const generateTeamPairsAvoidingPreviousMatchups = (
  registeredTeams: Team[],
  matches: Match[]
): Array<{ teamA: Team; teamB: Team }> => {
  // Créer un ensemble pour suivre les paires d'équipes qui se sont déjà affrontées
  const previousMatchups = new Set<string>();
  
  // Remplir l'ensemble avec les matchs existants
  matches.forEach(match => {
    const pairKey1 = `${match.team_a_id}-${match.team_b_id}`;
    const pairKey2 = `${match.team_b_id}-${match.team_a_id}`;
    previousMatchups.add(pairKey1);
    previousMatchups.add(pairKey2);
  });
  
  // Mélanger les équipes pour des affrontements aléatoires
  const shuffledTeams = [...registeredTeams].sort(() => Math.random() - 0.5);
  const newPairs: Array<{ teamA: Team; teamB: Team }> = [];
  const used = new Set<number>();
  
  // Première passe: essayer de créer des paires sans répéter les affrontements
  for (let i = 0; i < shuffledTeams.length; i++) {
    const teamA = shuffledTeams[i];
    if (used.has(teamA.id)) continue;
    
    // Chercher un adversaire qui n'a pas encore affronté cette équipe
    let foundOpponent = false;
    for (let j = 0; j < shuffledTeams.length; j++) {
      if (i === j) continue;
      
      const teamB = shuffledTeams[j];
      if (used.has(teamB.id)) continue;
      
      const pairKey1 = `${teamA.id}-${teamB.id}`;
      const pairKey2 = `${teamB.id}-${teamA.id}`;
      
      // Vérifier si ces équipes ne se sont pas déjà affrontées
      if (!previousMatchups.has(pairKey1) && !previousMatchups.has(pairKey2)) {
        newPairs.push({ teamA, teamB });
        used.add(teamA.id);
        used.add(teamB.id);
        foundOpponent = true;
        break;
      }
    }
    
    // Si aucun adversaire sans match précédent n'a été trouvé, on continue
    if (!foundOpponent) continue;
  }
  
  // Deuxième passe: pour les équipes restantes, créer des paires même si elles se sont déjà affrontées
  const remainingTeams = shuffledTeams.filter(team => !used.has(team.id));
  for (let i = 0; i < remainingTeams.length; i += 2) {
    if (i + 1 < remainingTeams.length) {
      newPairs.push({
        teamA: remainingTeams[i],
        teamB: remainingTeams[i + 1]
      });
    }
  }
  
  return newPairs;
};