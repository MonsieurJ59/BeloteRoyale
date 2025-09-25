// Importation des modules nécessaires
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { Tournament, Team, Match, TeamTournamentStats, TournamentMatchConfig } from '../types/api';

// Interface pour les données de classement
interface TeamRanking {
  team: Team;
  stats: TeamTournamentStats;
  prelimScore: number;
  rank: number;
}

// Composant principal de la page de résumé de tournoi
const TournamentSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>([]);
  const [matchConfigs, setMatchConfigs] = useState<TournamentMatchConfig[]>([]);
  const [nextRoundPairs, setNextRoundPairs] = useState<Array<{ teamA: Team; teamB: Team }>>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isEditingPairs, setIsEditingPairs] = useState<boolean>(false);
  const [customPairs, setCustomPairs] = useState<Array<{ teamA: Team; teamB: Team }>>([]);
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('');

  // Chargement des données du tournoi
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Récupération des données en parallèle
        const [tournamentRes, teamRankingsRes, matchesRes, regsRes, configsRes] = await Promise.all([
          fetch(`http://localhost:4000/tournaments/${id}`),
          fetch(`http://localhost:4000/teams/rankings/tournament/${id}`),
          fetch(`http://localhost:4000/matches?tournament_id=${id}`),
          fetch(`http://localhost:4000/team-tournaments/tournament/${id}/teams`),
          fetch(`http://localhost:4000/tournament-match-configs/tournament/${id}/configs`)
        ]);

        if (!tournamentRes.ok) throw new Error('Tournoi non trouvé');
        if (!teamRankingsRes.ok) throw new Error('Erreur lors du chargement des équipes du tournoi');
        if (!matchesRes.ok) throw new Error('Erreur lors du chargement des matchs');
        if (!regsRes.ok) throw new Error("Erreur lors du chargement des équipes inscrites");
        if (!configsRes.ok) throw new Error("Erreur lors du chargement des configurations du tournoi");

        const tournamentData = await tournamentRes.json();
        const teamRankingsData = await teamRankingsRes.json();
        const matchesData = await matchesRes.json();
        const regsData = await regsRes.json();
        const configsData = await configsRes.json();

        setTournament(tournamentData);
        setMatches(matchesData);
        setRegisteredTeams(regsData);
        setMatchConfigs(configsData);

        // Calcul du classement avec les données déjà filtrées par tournoi
        calculateRankingsFromBackend(teamRankingsData, matchesData);

        // Calculer les suggestions pour la prochaine manche principale si applicable
        computeNextRoundSuggestions(regsData, matchesData, configsData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  // Fonction pour calculer le classement avec les données du backend déjà filtrées
  const calculateRankingsFromBackend = (teamRankingsData: any[], matchesData: Match[]) => {
    const teamRankings: TeamRanking[] = teamRankingsData.map((teamData) => {
      // Reconstitution de l'objet Team à partir des données du backend
      const team: Team = {
        id: teamData.id,
        name: teamData.name,
        player1: teamData.player1,
        player2: teamData.player2
      };

      // Calcul des statistiques à jour
      let wins = 0;
      let losses = 0;
      let prelimScore = 0;

      // Calcul du score préliminaire pour cette équipe
      const prelimMatches = matchesData.filter(match => 
        match.match_type === 'preliminaires' && 
        (match.team_a_id === team.id || match.team_b_id === team.id)
      );
      
      prelimMatches.forEach(match => {
        if (match.team_a_id === team.id) {
          prelimScore += (match.score_a || 0);
        } else {
          prelimScore += (match.score_b || 0);
        }
      });
      
      // Calcul des victoires et défaites uniquement pour les matchs principaux
      const mainMatches = matchesData.filter(match => 
        match.match_type.startsWith('principal_') && 
        (match.team_a_id === team.id || match.team_b_id === team.id) &&
        match.winner_id !== null
      );
      
      mainMatches.forEach(match => {
        if (match.winner_id === team.id) {
          wins++;
        } else {
          losses++;
        }
      });

      // Reconstitution des stats à partir des calculs
      const stats: TeamTournamentStats = {
        id: 0, // Non utilisé dans l'affichage
        team_id: teamData.id,
        tournament_id: parseInt(id!),
        wins: wins,
        losses: losses,
        prelim_points: prelimScore
      };

      return {
        team,
        stats,
        prelimScore,
        rank: 0 // Sera calculé après le tri
      };
    });

    // Tri des équipes selon les critères de classement
    teamRankings.sort((a, b) => {
      // D'abord par nombre de victoires
      if (a.stats.wins !== b.stats.wins) return b.stats.wins - a.stats.wins;
      // Ensuite par points préliminaires
      if (a.prelimScore !== b.prelimScore) return b.prelimScore - a.prelimScore;
      // Enfin par nombre de défaites (moins de défaites est mieux)
      return a.stats.losses - b.stats.losses;
    });

    // Attribution des rangs après le tri
    teamRankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    setRankings(teamRankings);
  };

  // Fonction pour obtenir les types de matchs uniques et triés
  const getMatchTypes = () => {
    const types = Array.from(new Set(matches.map(match => match.match_type)));
    
    // Trier les types de matchs : préliminaires d'abord, puis principal_1, principal_2, etc.
    return types.sort((a, b) => {
      if (a === 'preliminaires') return -1;
      if (b === 'preliminaires') return 1;
      if (a.startsWith('principal_') && b.startsWith('principal_')) {
        const aNum = parseInt(a.split('_')[1]);
        const bNum = parseInt(b.split('_')[1]);
        return aNum - bNum;
      }
      return a.localeCompare(b);
    });
  };
  
  // Obtenir les types de matchs uniques
  const matchTypes = getMatchTypes();

  // Fonction pour obtenir le nom d'une équipe par son ID
  const getTeamName = (teamId: number): string => {
    const teamRanking = rankings.find(ranking => ranking.team.id === teamId);
    return teamRanking ? teamRanking.team.name : `Équipe #${teamId}`;
  };

  // Déterminer l'étape actuelle et préparer les suggestions
  const computeNextRoundSuggestions = (
    teams: Team[],
    allMatches: Match[],
    configs: TournamentMatchConfig[]
  ) => {
    console.log("computeNextRoundSuggestions appelée");
    
    // Étape 1: vérifier que chaque équipe inscrite a au moins un match préliminaire programmé
    const prelimByTeamCount = new Map<number, number>();
    teams.forEach(t => prelimByTeamCount.set(t.id, 0));
    
    const prelimMatches = allMatches.filter(m => m.match_type === 'preliminaires');
    prelimMatches.forEach(m => {
      prelimByTeamCount.set(m.team_a_id, (prelimByTeamCount.get(m.team_a_id) || 0) + 1);
      prelimByTeamCount.set(m.team_b_id, (prelimByTeamCount.get(m.team_b_id) || 0) + 1);
    });

    const teamsMissingPrelim = teams.filter(t => (prelimByTeamCount.get(t.id) || 0) === 0);
    
    // S'il y a des équipes sans match préliminaire, proposer des paires pour les préliminaires
    if (teamsMissingPrelim.length > 0) {
      // Créer des paires pour les préliminaires
      const prelimPairs: Array<{ teamA: Team; teamB: Team }> = [];
      const used = new Set<number>();
      
      for (const team of teamsMissingPrelim) {
        if (used.has(team.id)) continue;
        
        // Chercher un adversaire qui n'a pas encore de match préliminaire
        const opponent = teamsMissingPrelim.find(t => !used.has(t.id) && t.id !== team.id);
        
        if (opponent) {
          prelimPairs.push({ teamA: team, teamB: opponent });
          used.add(team.id);
          used.add(opponent.id);
        }
      }
      
      setNextRoundPairs(prelimPairs);
      setCustomPairs([...prelimPairs]);
      setIsEditingPairs(true);
      setActionMessage(
        `Préliminaires: ${prelimPairs.length} paire(s) proposée(s) pour les matchs préliminaires.`
      );
      return;
    }
    
    // Vérifier si tous les matchs préliminaires sont terminés
    const pendingPrelims = prelimMatches.filter(m => m.winner_id === null);
    if (pendingPrelims.length > 0) {
      setNextRoundPairs([]);
      setActionMessage(
        `Préliminaires en cours: ${pendingPrelims.length} match(s) préliminaire(s) en attente de résultat.`
      );
      return;
    }

    // Étape 2: préparer la prochaine manche principale
    const principalConfig = configs.find(c => c.match_type === 'principal_1' && c.is_enabled);
    const maxRounds = principalConfig?.max_matches ?? 1;

    // Compter combien de matchs principaux chaque équipe a déjà joués
    const mainMatches = allMatches.filter(m => m.match_type.startsWith('principal_'));
    const mainCountByTeam = new Map<number, number>();
    teams.forEach(t => mainCountByTeam.set(t.id, 0));
    mainMatches.forEach(m => {
      mainCountByTeam.set(m.team_a_id, (mainCountByTeam.get(m.team_a_id) || 0) + 1);
      mainCountByTeam.set(m.team_b_id, (mainCountByTeam.get(m.team_b_id) || 0) + 1);
    });

    const roundsCompleted = Math.min(...teams.map(t => mainCountByTeam.get(t.id) || 0));
    if (roundsCompleted >= maxRounds) {
      setNextRoundPairs([]);
      setActionMessage('Tous les matchs principaux prévus ont été programmés.');
      return;
    }

    // Vérifier si tous les matchs principaux de la manche actuelle sont terminés
    const currentRound = roundsCompleted + 1;
    const currentRoundMatches = mainMatches.filter(m => 
      m.match_type === `principal_${currentRound}` || 
      (currentRound === 1 && m.match_type === 'principal_1')
    );
    const pendingCurrentRound = currentRoundMatches.filter(m => m.winner_id === null);
    
    if (pendingCurrentRound.length > 0) {
      setNextRoundPairs([]);
      setActionMessage(
        `Manche principale ${currentRound} en cours: ${pendingCurrentRound.length} match(s) en attente de résultat.`
      );
      return;
    }

    // Construire l'historique des affrontements pour éviter les répétitions
    const facedMap = new Map<number, Set<number>>();
    teams.forEach(t => facedMap.set(t.id, new Set()));
    mainMatches.forEach(m => {
      facedMap.get(m.team_a_id)!.add(m.team_b_id);
      facedMap.get(m.team_b_id)!.add(m.team_a_id);
    });

    // Équipes éligibles pour la prochaine manche = celles qui ont joué exactement roundsCompleted matchs principaux
    const eligible = teams.filter(t => (mainCountByTeam.get(t.id) || 0) === roundsCompleted);

    // Algorithme glouton: apparier en minimisant les répétitions
    const pairs: Array<{ teamA: Team; teamB: Team }> = [];
    const used = new Set<number>();
    const sorted = [...eligible].sort((a, b) => (facedMap.get(a.id)!.size - facedMap.get(b.id)!.size));

    for (const team of sorted) {
      if (used.has(team.id)) continue;
      // Chercher des adversaires non utilisés avec lesquels il n'a jamais joué
      let opponent = eligible.find(t => !used.has(t.id) && t.id !== team.id && !facedMap.get(team.id)!.has(t.id));
      // Si pas trouvé, accepter un adversaire déjà affronté le moins souvent (fallback)
      if (!opponent) {
        opponent = eligible.find(t => !used.has(t.id) && t.id !== team.id);
      }
      if (opponent) {
        pairs.push({ teamA: team, teamB: opponent });
        used.add(team.id);
        used.add(opponent.id);
      }
    }

    setNextRoundPairs(pairs);
    setCustomPairs([...pairs]); // Initialiser les paires personnalisées avec les suggestions
    setIsEditingPairs(true); // Activer le mode d'édition des paires
    setActionMessage(
      pairs.length > 0
        ? `Manche principale ${currentRound + 1}: ${pairs.length} paire(s) proposée(s).`
        : 'Aucune paire suggérée pour la prochaine manche.'
    );
  };

  // Créer les matchs suggérés via l'API
  const createSuggestedMainMatches = async () => {
    if (!id || nextRoundPairs.length === 0) return;
    
    try {
      setLoading(true);
      
      // Déterminer le type de match à créer
      let matchType = 'preliminaires';
      
      // Si des matchs préliminaires existent déjà et sont tous terminés, créer des matchs principaux
      const prelimMatches = matches.filter(m => m.match_type === 'preliminaires');
      const allPrelimsCompleted = prelimMatches.length > 0 && 
                                 prelimMatches.every(m => m.winner_id !== null);
      
      if (allPrelimsCompleted) {
        // Trouver la prochaine manche principale
        const mainRounds = [...new Set(matches
          .filter(m => m.match_type.startsWith('principal_'))
          .map(m => parseInt(m.match_type.replace('principal_', ''))))]; 
        
        const nextRound = mainRounds.length > 0 ? Math.max(...mainRounds) + 1 : 1;
        matchType = `principal_${nextRound}`;
      }
      
      // Créer les matchs un par un
      for (const pair of nextRoundPairs) {
        const response = await fetch(`http://localhost:4000/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tournament_id: Number(id),
            match_type: matchType,
            team_a_id: pair.teamA.id,
            team_b_id: pair.teamB.id,
            score_a: 0,
            score_b: 0,
            winner_id: null
          })
        });
        
        if (!response.ok) throw new Error(`Erreur lors de la création du match ${pair.teamA.name} vs ${pair.teamB.name}`);
      }
      
      // Recharger les matchs
      const matchesRes = await fetch(`http://localhost:4000/matches?tournament_id=${id}`);
      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
        // Recalculer le classement avec les nouveaux matchs
        calculateRankingsFromBackend(registeredTeams, matchesData);
        computeNextRoundSuggestions(registeredTeams, matchesData, matchConfigs);
      }
      
      // Réinitialiser les paires
      setNextRoundPairs([]);
      setActionMessage(`${nextRoundPairs.length} match(s) créé(s) avec succès.`);
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : 'Erreur lors de la création des matchs');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePairsEditing = () => {
    if (!isEditingPairs) {
      // Initialiser les paires personnalisées avec les suggestions actuelles
      setCustomPairs([...nextRoundPairs]);
    }
    setIsEditingPairs(!isEditingPairs);
  };
  
  const validateTournamentStage = async () => {
    if (!id || !tournament) return;
    try {
      const newStatus = tournament.status === 'upcoming' ? 'in_progress' : 'completed';
      const response = await fetch(`http://localhost:4000/tournaments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error(`Erreur lors de la mise à jour du statut du tournoi`);
      
      // Mettre à jour l'état local
      setTournament({ ...tournament, status: newStatus });
      setActionMessage(`Le tournoi est maintenant ${newStatus === 'in_progress' ? 'en cours' : 'terminé'}.`);
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match.id);
    setScoreA(match.score_a || 0);
    setScoreB(match.score_b || 0);
  };

  const handleUpdateScore = async (matchId: number) => {
    if (!id) return;
    try {
      // Déterminer le gagnant
      let winnerId = null;
      if (scoreA > scoreB) {
        const match = matches.find(m => m.id === matchId);
        if (match) winnerId = match.team_a_id;
      } else if (scoreB > scoreA) {
        const match = matches.find(m => m.id === matchId);
        if (match) winnerId = match.team_b_id;
      }
      
      // Appel à l'API pour mettre à jour le match
      const response = await fetch(`http://localhost:4000/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_a: scoreA,
          score_b: scoreB,
          winner_id: winnerId
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du score');
      
      // Recharger les matchs et recalculer
      const matchesRes = await fetch(`http://localhost:4000/matches?tournament_id=${id}`);
      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
        calculateRankingsFromBackend(registeredTeams, matchesData);
      }
      
      setEditingMatch(null);
      setActionMessage('Score mis à jour avec succès');
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : 'Erreur lors de la mise à jour du score');
    }
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  // Calcul des statistiques du tournoi
  const totalMatches = matches.length;
  const completedMatches = matches.filter(match => match.winner_id).length;
  const prelimMatches = matches.filter(match => match.match_type === 'preliminaires').length;
  const mainMatches = matches.filter(match => match.match_type.startsWith('principal')).length;

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Chargement du résumé du tournoi...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error || !tournament) {
    return (
      <PageContainer>
        <ErrorMessage>{error || 'Tournoi non trouvé'}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* En-tête du tournoi */}
      <TournamentHeader>
        <TournamentTitle>{tournament.name}</TournamentTitle>
        <TournamentInfo>
          <InfoItem>
            <InfoLabel>Date:</InfoLabel>
            <InfoValue>{formatDate(tournament.date)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Statut:</InfoLabel>
            <StatusBadge $status={tournament.status}>
              {getStatusLabel(tournament.status)}
            </StatusBadge>
          </InfoItem>
        </TournamentInfo>
      </TournamentHeader>

      {/* Étape actuelle et actions */}
      <ActionsSection>
        <SectionTitle>Étape du tournoi</SectionTitle>
        
        {/* Affichage de l'étape actuelle du tournoi */}
        {tournament?.status === 'upcoming' && (
          <>
            <ActionMessage>Le tournoi n'a pas encore commencé. Cliquez sur "Démarrer le tournoi" pour commencer.</ActionMessage>
            <StartTournamentButton onClick={validateTournamentStage}>
              Démarrer le tournoi
            </StartTournamentButton>
          </>
        )}
        
        {tournament?.status === 'in_progress' && (
          <>
            {/* Étape des préliminaires */}
            {prelimMatches === 0 && (
              <>
                <ActionMessage>Étape des préliminaires : Aucun match préliminaire n'a été créé.</ActionMessage>
                <ButtonGroup>
                  <CreateMatchesButton onClick={() => {
                    if (registeredTeams && registeredTeams.length >= 2) {
                      // Créer des paires pour les préliminaires
                      const prelimPairs: Array<{ teamA: Team; teamB: Team }> = [];
                      const used = new Set<number>();
                      
                      for (let i = 0; i < registeredTeams.length; i++) {
                        const team = registeredTeams[i];
                        if (used.has(team.id)) continue;
                        
                        // Chercher un adversaire qui n'est pas encore utilisé
                        const opponent = registeredTeams.find(t => !used.has(t.id) && t.id !== team.id);
                        
                        if (opponent) {
                          prelimPairs.push({ teamA: team, teamB: opponent });
                          used.add(team.id);
                          used.add(opponent.id);
                        }
                      }
                      
                      setNextRoundPairs(prelimPairs);
                      setCustomPairs([...prelimPairs]);
                      setIsEditingPairs(true);
                      setActionMessage(`Préliminaires : ${prelimPairs.length} paire(s) proposée(s).`);
                    } else {
                      setActionMessage("Impossible de proposer des affrontements : pas assez d'équipes inscrites.");
                    }
                  }}>
                    Proposer les affrontements préliminaires
                  </CreateMatchesButton>
                </ButtonGroup>
              </>
            )}
            
            {/* Préliminaires en cours */}
            {prelimMatches > 0 && matches.filter(m => m.match_type === 'preliminaires' && m.winner_id === null).length > 0 && (
              <ActionMessage>
                Étape des préliminaires en cours : {matches.filter(m => m.match_type === 'preliminaires' && m.winner_id === null).length} match(s) en attente de résultat.
              </ActionMessage>
            )}
            
            {/* Préliminaires terminés, passage aux matchs principaux */}
            {prelimMatches > 0 && matches.filter(m => m.match_type === 'preliminaires' && m.winner_id === null).length === 0 && (
              <>
                {/* Déterminer la manche principale actuelle */}
                {(() => {
                  // Trouver la manche principale actuelle
                  const mainRounds = [...new Set(matches
                    .filter(m => m.match_type.startsWith('principal_'))
                    .map(m => parseInt(m.match_type.replace('principal_', ''))))];
                  
                  const currentRound = mainRounds.length > 0 ? Math.max(...mainRounds) : 0;
                  const nextRound = currentRound + 1;
                  
                  // Vérifier si tous les matchs de la manche actuelle sont terminés
                  const currentRoundMatches = matches.filter(m => m.match_type === `principal_${currentRound}`);
                  const pendingCurrentRound = currentRoundMatches.filter(m => m.winner_id === null);
                  
                  // Vérifier si on a atteint le nombre maximum de manches
                  const principalConfig = matchConfigs.find(c => c.match_type === 'principal_1' && c.is_enabled);
                  const maxRounds = principalConfig?.max_matches ?? 1;
                  
                  if (currentRound >= maxRounds) {
                    return (
                      <>
                        <ActionMessage>Toutes les manches principales ont été jouées. Vous pouvez terminer le tournoi.</ActionMessage>
                        <CompleteTournamentButton onClick={validateTournamentStage}>
                          Terminer le tournoi
                        </CompleteTournamentButton>
                      </>
                    );
                  } else if (pendingCurrentRound.length > 0) {
                    return (
                      <ActionMessage>
                        Manche principale {currentRound} en cours : {pendingCurrentRound.length} match(s) en attente de résultat.
                      </ActionMessage>
                    );
                  } else {
                    return (
                      <>
                        <ActionMessage>
                          {currentRound === 0 
                            ? "Les préliminaires sont terminés. Vous pouvez maintenant créer les matchs de la première manche principale." 
                            : `Manche principale ${currentRound} terminée. Vous pouvez maintenant créer les matchs de la manche ${nextRound}.`}
                        </ActionMessage>
                        <ButtonGroup>
                          <CreateMatchesButton onClick={() => {
                            if (registeredTeams && registeredTeams.length >= 2) {
                              // Construire l'historique des affrontements pour éviter les répétitions
                              const facedMap = new Map<number, Set<number>>();
                              registeredTeams.forEach(t => facedMap.set(t.id, new Set()));
                              
                              matches.filter(m => m.match_type.startsWith('principal_')).forEach(m => {
                                facedMap.get(m.team_a_id)?.add(m.team_b_id);
                                facedMap.get(m.team_b_id)?.add(m.team_a_id);
                              });
                              
                              // Algorithme glouton: apparier en minimisant les répétitions
                              const pairs: Array<{ teamA: Team; teamB: Team }> = [];
                              const used = new Set<number>();
                              const sorted = [...registeredTeams].sort((a, b) => 
                                (facedMap.get(a.id)?.size || 0) - (facedMap.get(b.id)?.size || 0)
                              );
                              
                              for (const team of sorted) {
                                if (used.has(team.id)) continue;
                                
                                // Chercher des adversaires non utilisés avec lesquels il n'a jamais joué
                                let opponent = registeredTeams.find(t => 
                                  !used.has(t.id) && 
                                  t.id !== team.id && 
                                  !(facedMap.get(team.id)?.has(t.id))
                                );
                                
                                // Si pas trouvé, accepter un adversaire déjà affronté
                                if (!opponent) {
                                  opponent = registeredTeams.find(t => !used.has(t.id) && t.id !== team.id);
                                }
                                
                                if (opponent) {
                                  pairs.push({ teamA: team, teamB: opponent });
                                  used.add(team.id);
                                  used.add(opponent.id);
                                }
                              }
                              
                              setNextRoundPairs(pairs);
                              setCustomPairs([...pairs]);
                              setIsEditingPairs(true);
                              setActionMessage(`Manche principale ${nextRound} : ${pairs.length} paire(s) proposée(s).`);
                            } else {
                              setActionMessage("Impossible de proposer des affrontements : pas assez d'équipes inscrites.");
                            }
                          }}>
                            Proposer les affrontements de la manche {nextRound}
                          </CreateMatchesButton>
                        </ButtonGroup>
                      </>
                    );
                  }
                })()}
              </>
            )}
          </>
        )}
        
        {tournament?.status === 'completed' && (
          <ActionMessage>Le tournoi est terminé. Tous les matchs ont été joués.</ActionMessage>
        )}
        
        {/* Affichage des paires proposées */}
        {isEditingPairs && (
          <div>
            <SuggestedList>
              {customPairs.map((p, idx) => (
                <li key={`custom-${p.teamA.id}-${p.teamB.id}-${idx}`}>
                  {p.teamA.name} vs {p.teamB.name}
                </li>
              ))}
            </SuggestedList>
            <ButtonGroup>
              <CreateMatchesButton onClick={() => {
                setNextRoundPairs(customPairs);
                setIsEditingPairs(false);
                createSuggestedMainMatches();
              }}>
                Valider et créer ces matchs
              </CreateMatchesButton>
              <CancelButton onClick={togglePairsEditing}>
                Annuler
              </CancelButton>
            </ButtonGroup>
          </div>
        )}
      </ActionsSection>

      {/* Statistiques du tournoi */}
      <StatsSection>
        <SectionTitle>Statistiques du tournoi</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>{rankings.length}</StatNumber>
            <StatLabel>Équipes inscrites</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{totalMatches}</StatNumber>
            <StatLabel>Matchs total</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{completedMatches}</StatNumber>
            <StatLabel>Matchs terminés</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{prelimMatches}</StatNumber>
            <StatLabel>Matchs préliminaires</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{mainMatches}</StatNumber>
            <StatLabel>Matchs principaux</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Liste des matchs */}
      <MatchesSection>
        <SectionTitle>Matchs du tournoi</SectionTitle>
        {matches.length === 0 ? (
          <EmptyMessage>Aucun match créé pour ce tournoi.</EmptyMessage>
        ) : (
          <MatchesByType>
            {matchTypes.map(type => (
              <MatchTypeSection key={type}>
                <MatchTypeTitle>
                  {type === 'preliminaires' ? 'Matchs préliminaires' : `Matchs principaux - Manche ${type.replace('principal_', '')}`}
                </MatchTypeTitle>
                <MatchesTable>
                  <MatchesTableHeader>
                    <HeaderRow>
                      <HeaderCell>Équipe A</HeaderCell>
                      <HeaderCell>Score</HeaderCell>
                      <HeaderCell>Équipe B</HeaderCell>
                      <HeaderCell>Statut</HeaderCell>
                    </HeaderRow>
                  </MatchesTableHeader>
                  <MatchesTableBody>
                    {matches.filter(m => m.match_type === type).map(match => (
                      <MatchRow key={match.id}>
                        <TeamMatchCell>
                          <TeamMatchName>{getTeamName(match.team_a_id)}</TeamMatchName>
                        </TeamMatchCell>
                        <ScoreCell>
                          {editingMatch === match.id ? (
                            <>
                              <ScoreInput 
                                type="number" 
                                value={scoreA} 
                                onChange={(e) => setScoreA(parseInt(e.target.value) || 0)} 
                              />
                              <ScoreSeparator>-</ScoreSeparator>
                              <ScoreInput 
                                type="number" 
                                value={scoreB} 
                                onChange={(e) => setScoreB(parseInt(e.target.value) || 0)} 
                              />
                            </>
                          ) : (
                            <>
                              <Score $isWinner={match.winner_id === match.team_a_id}>
                                {match.score_a || 0}
                              </Score>
                              <ScoreSeparator>-</ScoreSeparator>
                              <Score $isWinner={match.winner_id === match.team_b_id}>
                                {match.score_b || 0}
                              </Score>
                            </>
                          )}
                        </ScoreCell>
                        <TeamMatchCell>
                          <TeamMatchName>{getTeamName(match.team_b_id)}</TeamMatchName>
                        </TeamMatchCell>
                        <StatusCell>
                          {editingMatch === match.id ? (
                            <UpdateScoreButton onClick={() => handleUpdateScore(match.id)}>
                              Valider
                            </UpdateScoreButton>
                          ) : (
                            <>
                              <StatusBadgeMatch $status={match.winner_id ? 'completed' : 'pending'}>
                                {match.winner_id ? 'Terminé' : 'En attente'}
                              </StatusBadgeMatch>
                              {tournament?.status === 'in_progress' && !match.winner_id && (
                                <EditScoreButton onClick={() => handleEditMatch(match)}>
                                  Saisir score
                                </EditScoreButton>
                              )}
                            </>
                          )}
                        </StatusCell>
                      </MatchRow>
                    ))}
                  </MatchesTableBody>
                </MatchesTable>
              </MatchTypeSection>
            ))}
          </MatchesByType>
        )}
      </MatchesSection>

      {/* Classement des équipes */}
      <RankingSection>
        <SectionTitle>Classement des équipes</SectionTitle>
        {rankings.length === 0 ? (
          <EmptyMessage>Aucune équipe inscrite dans ce tournoi.</EmptyMessage>
        ) : (
          <RankingTable>
            <TableHeader>
              <HeaderCell>Rang</HeaderCell>
              <HeaderCell>Équipe</HeaderCell>
              <HeaderCell>Joueurs</HeaderCell>
              <HeaderCell>Victoires</HeaderCell>
              <HeaderCell>Défaites</HeaderCell>
              <HeaderCell>Score préliminaire</HeaderCell>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => (
                <TableRow key={ranking.team.id} $rank={ranking.rank}>
                  <RankCell $rank={ranking.rank}>
                    {ranking.rank === 1 && '🥇'}
                    {ranking.rank === 2 && '🥈'}
                    {ranking.rank === 3 && '🥉'}
                    {ranking.rank > 3 && ranking.rank}
                  </RankCell>
                  <TeamCell>
                    <TeamName>{ranking.team.name}</TeamName>
                  </TeamCell>
                  <PlayersCell>
                    <PlayerName>{ranking.team.player1}</PlayerName>
                    <PlayerName>{ranking.team.player2}</PlayerName>
                  </PlayersCell>
                  <StatCell $highlight={true}>{ranking.stats.wins}</StatCell>
                  <StatCell>{ranking.stats.losses}</StatCell>
                  <StatCell>{ranking.prelimScore} pts</StatCell>
                </TableRow>
              ))}
            </TableBody>
          </RankingTable>
        )}
      </RankingSection>
    </PageContainer>
  );
};

// Styles avec styled-components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
`;

const TournamentHeader = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  color: ${theme.colors.text.light};
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.lg};
`;

const TournamentTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const TournamentInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const InfoLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  opacity: 0.9;
`;

const InfoValue = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const StatusBadge = styled.span<{ $status: Tournament['status'] }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'upcoming': return theme.colors.status.info;
      case 'in_progress': return theme.colors.status.success;
      case 'completed': return theme.colors.neutral.gray600;
      default: return theme.colors.neutral.gray600;
    }
  }};
  color: ${theme.colors.text.light};
`;

const StatsSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

// Actions and suggestions styles
const ActionsSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
`;

const ActionMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const SuggestedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.sm};

  li {
    background: ${theme.colors.neutral.gray50};
    border: 1px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    text-align: center;
  }
`;

const CreateMatchesButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
  }
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${theme.colors.background.card};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

const StatNumber = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const RankingSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

const RankingTable = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px 100px 150px;
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 80px 80px 100px;
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const HeaderCell = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
    
    &:nth-child(3) {
      display: none; // Masquer la colonne joueurs sur mobile
    }
  }
`;

const TableBody = styled.div``;

const TableRow = styled.div<{ $rank: number }>`
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px 100px 150px;
  border-bottom: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.$rank <= 3 && `
    background: linear-gradient(90deg, ${theme.colors.accent.main}10, transparent);
    border-left: 4px solid ${theme.colors.accent.main};
  `}
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 80px 80px 100px;
  }
`;

const RankCell = styled.div<{ $rank: number }>`
  padding: ${theme.spacing.lg};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$rank <= 3 && `
    color: ${theme.colors.accent.main};
  `}
`;

const TeamCell = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
`;

const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const PlayersCell = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none; // Masquer sur mobile
  }
`;

const PlayerName = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const StatCell = styled.div<{ $highlight?: boolean }>`
  padding: ${theme.spacing.lg};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.$highlight ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${props => props.$highlight ? theme.colors.primary.main : theme.colors.text.primary};
`;

// Styles pour la section des matchs
const MatchesSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

const MatchesByType = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const MatchTypeSection = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
`;

const MatchTypeTitle = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.light};
  background: ${theme.colors.primary.main};
  padding: ${theme.spacing.lg};
  margin: 0;
  text-align: center;
`;

const MatchesTable = styled.div`
  overflow-x: auto;
`;

const MatchesTableHeader = styled.div`
  background: ${theme.colors.neutral.gray100};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 100px 1fr 80px;
  }
`;

const MatchesTableBody = styled.div``;

const MatchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  border-bottom: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 100px 1fr 80px;
  }
`;

const MatchCell = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const TeamMatchCell = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

const TeamMatchName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const ScoreCell = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

const Score = styled.span<{ $isWinner?: boolean }>`
  font-weight: ${props => props.$isWinner ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${props => props.$isWinner ? theme.colors.status.success : theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const ScoreSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const StatusCell = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

const StatusBadgeMatch = styled.span<{ $status: 'completed' | 'pending' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'completed': return theme.colors.status.success;
      case 'pending': return theme.colors.status.warning;
      default: return theme.colors.neutral.gray600;
    }
  }};
  color: ${theme.colors.text.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  }
`;

// Styles pour les nouveaux composants
const ScoreInput = styled.input`
  width: 60px;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: center;
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background.card};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
`;

const UpdateScoreButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.dark}, ${theme.colors.primary.main});
    box-shadow: ${theme.shadows.md};
  }
`;

const EditScoreButton = styled.button`
  background: transparent;
  color: ${theme.colors.primary.main};
  border: 1px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-top: ${theme.spacing.xs};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.main}10;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const EditPairsButton = styled.button`
  background: transparent;
  color: ${theme.colors.primary.main};
  border: 1px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.main}10;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${theme.colors.status.error};
  border: 1px solid ${theme.colors.status.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.status.error}10;
  }
`;

const StartTournamentButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.status.success}, ${theme.colors.status.success}80);
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CompleteTournamentButton = styled(StartTournamentButton)`
  background: linear-gradient(135deg, ${theme.colors.status.warning}, ${theme.colors.status.warning}80);
`;

export default TournamentSummaryPage;
