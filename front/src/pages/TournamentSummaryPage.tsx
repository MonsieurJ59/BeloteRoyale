// Importation des modules nécessaires
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { theme } from '../styles/theme';
import { API_URL } from '../config';
import { generateTeamPairsAvoidingPreviousMatchups as generatePairs } from '../utils/tournamentUtils';
import type { Tournament, Team, Match, TeamTournamentStats, TournamentMatchConfig } from '../types/api';
import { PairsModal, TeamsModal } from '../components/modals/GeneratorMatchModals';
import {
  PageContainer,
  LoadingMessage,
  ErrorMessage,
  TournamentHeader,
  TournamentTitle,
  TournamentInfo,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatusBadge,
  StatsSection,
  ActionsSection,
  ActionMessage,
  SuggestedList,
  CreateMatchesButton,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  RankingSection,
  EmptyMessage,
  RankingTable,
  TableHeader,
  HeaderCell,
  TableBody,
  TableRow,
  RankCell,
  TeamCell,
  TeamName,
  PlayersCell,
  PlayerName,
  StatCell,
  MatchesSection,
  MatchesByType,
  MatchTypeSection,
  MatchTypeTitle,
  MatchesTable,
  MatchesTableHeader,
  HeaderRow,
  MatchesTableBody,
  MatchRow,
  MatchCell,
  TeamMatchCell,
  TeamMatchName,
  ScoreCell,
  Score,
  ScoreSeparator,
  StatusCell,
  StatusBadgeMatch,
  ScoreInput,
  UpdateScoreButton,
  EditScoreButton,
  ActionCell,
  ButtonGroup,
  EditPairsButton,
  CancelButton,
  StartTournamentButton,
  CompleteTournamentButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  ModalFooter,
  PairsList,
  PairItem,
  CancelPhaseButton,
  PhaseButtons
} from '../styles/TournamentSummaryPage.styles';

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
  const [showPairsModal, setShowPairsModal] = useState<boolean>(false);
  const [modalPairs, setModalPairs] = useState<Array<{ teamA: Team; teamB: Team }>>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  // Nouvel état pour la modal des équipes inscrites
  const [showTeamsModal, setShowTeamsModal] = useState<boolean>(false);

  // Chargement des données du tournoi
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Récupération des données en parallèle
        const [tournamentRes, teamRankingsRes, matchesRes, regsRes, configsRes] = await Promise.all([
          fetch(`${API_URL}/tournaments/${id}`),
          fetch(`${API_URL}/teams/rankings/tournament/${id}`),
          fetch(`${API_URL}/matches?tournament_id=${id}`),
          fetch(`${API_URL}/team-tournaments/tournament/${id}/teams`),
          fetch(`${API_URL}/tournament-match-configs/tournament/${id}/configs`)
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

  // Utilisation de la fonction utilitaire pour générer des paires d'équipes
  const generateTeamPairsAvoidingPreviousMatchups = () => {
    return generatePairs(registeredTeams, matches);
  };

  // Fonction pour préparer les données pour la modal avec les paires proposées
  const showPairsInModal = (pairs: Array<{ teamA: Team; teamB: Team }>, title: string) => {
    setModalPairs(pairs);
    setModalTitle(title);
    // Ne pas afficher automatiquement la modale
    // setShowPairsModal(true); // Cette ligne est commentée pour éviter l'affichage automatique
  };

  // Fonction pour afficher la modale manuellement
  const displayPairsModal = () => {
    // Générer des paires optimisées dès l'ouverture de la modale
    const optimizedPairs = generateTeamPairsAvoidingPreviousMatchups();
    setModalPairs(optimizedPairs);
    setShowPairsModal(true);
  };

  // Nouvelle fonction pour afficher la modale lorsque l'utilisateur clique sur le bouton
  const handleShowPairsModal = () => {
    setShowPairsModal(true);
  };

  // Fonction pour valider les paires et créer les matchs
  const validateAndCreateMatches = () => {
    setNextRoundPairs(modalPairs);
    setShowPairsModal(false);
    createSuggestedMainMatches();
  };

  // Fonction pour suggérer des matchs préliminaires
  const suggestPreliminaryMatches = () => {
    if (registeredTeams && registeredTeams.length >= 2) {
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
      const prelimPairs: Array<{ teamA: Team; teamB: Team }> = [];
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
            prelimPairs.push({ teamA, teamB });
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
          prelimPairs.push({
            teamA: remainingTeams[i],
            teamB: remainingTeams[i + 1]
          });
        }
      }
      
      // Préparer les paires pour la modal
      showPairsInModal(prelimPairs, "Affrontements préliminaires proposés");
      // Afficher la modal
      displayPairsModal();
    } else {
      setActionMessage("Impossible de proposer des affrontements : pas assez d'équipes inscrites.");
    }
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
    
    // S'il y a des équipes sans match préliminaire, préparer des paires pour les préliminaires
    // mais ne pas afficher automatiquement la modale
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
      
      // Préparer les paires pour la modal sans l'afficher automatiquement
      showPairsInModal(prelimPairs, "Affrontements préliminaires proposés");
      // Supprimer cette ligne pour éviter l'affichage automatique
      // displayPairsModal();
    } else {
      setActionMessage("Impossible de proposer des affrontements : pas assez d'équipes inscrites.");
    }
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
        const response = await fetch(`${API_URL}/matches`, {
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
      const matchesRes = await fetch(`${API_URL}/matches?tournament_id=${id}`);
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
      const response = await fetch(`${API_URL}/tournaments/${id}`, {
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

  // Fonction pour afficher la modal des équipes inscrites
  const showRegisteredTeamsModal = () => {
    setShowTeamsModal(true);
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
      const response = await fetch(`${API_URL}/matches/${matchId}`, {
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
      const matchesRes = await fetch(`${API_URL}/matches?tournament_id=${id}`);
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

  // Fonction pour annuler une phase et supprimer tous les matchs associés
  const handleCancelPhase = async (phaseType: string) => {
    if (!id) return;
    
    // Confirmation avant annulation
    if (!window.confirm(`Êtes-vous sûr de vouloir annuler la phase ${phaseType === 'preliminaires' ? 'préliminaire' : 'principale'} et régénérer les affrontements ? Cette action est irréversible.`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Supprimer tous les matchs de la phase concernée
      let endpoint = '';
      if (phaseType === 'preliminaires') {
        endpoint = `${API_URL}/matches/tournament/${id}/delete/preliminaires`;
      } else if (phaseType.startsWith('principal_')) {
        // Pour les phases principales, on supprime tous les matchs de la phase actuelle
        const roundNumber = phaseType.replace('principal_', '');
        endpoint = `${API_URL}/matches/tournament/${id}/delete/principal/${roundNumber}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'annulation de la phase: ${response.statusText}`);
      }
      
      // Recharger les données du tournoi
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'annulation de la phase');
    } finally {
      setLoading(false);
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
      {/* Modal pour afficher et modifier les paires proposées */}
      <PairsModal
        showModal={showPairsModal}
        modalTitle={modalTitle}
        modalPairs={modalPairs}
        registeredTeams={registeredTeams}
        onClose={() => setShowPairsModal(false)}
        onValidate={validateAndCreateMatches}
        setModalPairs={setModalPairs}
        generateTeamPairsAvoidingPreviousMatchups={generateTeamPairsAvoidingPreviousMatchups}
      />

      {/* Modal pour afficher les équipes inscrites */}
      <TeamsModal
        showModal={showTeamsModal}
        registeredTeams={registeredTeams}
        onClose={() => setShowTeamsModal(false)}
      />

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
          <InfoItem>
            <InfoLabel>Manches principales:</InfoLabel>
            <InfoValue>
              {matchConfigs.find(c => c.match_type === 'principal_1' && c.is_enabled)?.max_matches ?? 1}
            </InfoValue>
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
                      const prelimPairs: Array<{ teamA: Team; teamB: Team }> = [];
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
                            prelimPairs.push({ teamA, teamB });
                            used.add(teamA.id);
                            used.add(teamB.id);
                            foundOpponent = true;
                            break;
                          }
                        }
                        
                        // Si aucun adversaire sans match précédent n'a été trouvé, on continue
                        if (!foundOpponent) continue;
                        
                        // Si aucun adversaire sans match précédent n'a été trouvé, on continue
                        if (!foundOpponent) continue;
                      }
                      
                      // Deuxième passe: pour les équipes restantes, créer des paires même si elles se sont déjà affrontées
                      const remainingTeams = shuffledTeams.filter(team => !used.has(team.id));
                      for (let i = 0; i < remainingTeams.length; i += 2) {
                        if (i + 1 < remainingTeams.length) {
                          prelimPairs.push({
                            teamA: remainingTeams[i],
                            teamB: remainingTeams[i + 1]
                          });
                        }
                      }
                      
                      // Préparer les données pour la modale
                      showPairsInModal(prelimPairs, "Affrontements préliminaires proposés");
                      // Afficher la modale manuellement
                      displayPairsModal();
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
                        <ButtonGroup>
                          <CompleteTournamentButton onClick={validateTournamentStage}>
                            Terminer le tournoi
                          </CompleteTournamentButton>
                          {/* Bouton pour annuler la dernière phase principale */}
                          <CancelPhaseButton onClick={() => handleCancelPhase(`principal_${currentRound}`)}>
                            Annuler la dernière phase
                          </CancelPhaseButton>
                        </ButtonGroup>
                      </>
                    );
                  } else if (pendingCurrentRound.length > 0) {
                    return (
                      <>
                        <ActionMessage>
                          Manche principale {currentRound} en cours : {pendingCurrentRound.length} match(s) en attente de résultat.
                        </ActionMessage>
                        {/* Ajout du bouton d'annulation pour la phase en cours */}
                        <ButtonGroup>
                          <CancelPhaseButton onClick={() => handleCancelPhase(`principal_${currentRound}`)}>
                            Annuler cette phase
                          </CancelPhaseButton>
                        </ButtonGroup>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <ActionMessage>
                          {currentRound === 0 
                            ? "Les préliminaires sont terminés. Vous pouvez maintenant créer les matchs de la première manche principale." 
                            : `Manche principale ${currentRound} terminée. Vous pouvez maintenant créer les matchs de la manche ${nextRound}.`}
                        </ActionMessage>
                        <PhaseButtons>
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
                              
                              // Préparer les paires pour la modal
                              showPairsInModal(pairs, `Affrontements de la manche ${nextRound} proposés`);
                              // Afficher la modale
                              displayPairsModal();
                            } else {
                              setActionMessage("Impossible de proposer des affrontements : pas assez d'équipes inscrites.");
                            }
                          }}>
                            {currentRound === 0 
                              ? "Créer les matchs de la première manche" 
                              : `Créer les matchs de la manche ${nextRound}`}
                          </CreateMatchesButton>
                          
                          {/* Bouton pour annuler la phase précédente */}
                          {currentRound === 0 ? (
                            <CancelPhaseButton onClick={() => handleCancelPhase('preliminaires')}>
                              Annuler les préliminaires
                            </CancelPhaseButton>
                          ) : (
                            <CancelPhaseButton onClick={() => handleCancelPhase(`principal_${currentRound}`)}>
                              Annuler la manche {currentRound}
                            </CancelPhaseButton>
                          )}
                        </PhaseButtons>
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
      
      </ActionsSection>

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
                      <HeaderCell>Actions</HeaderCell>
                    </HeaderRow>
                  </MatchesTableHeader>
                  <MatchesTableBody>
                    {matches.filter(m => m.match_type === type).map(match => (
                      <MatchRow key={match.id} $status={match.winner_id ? 'completed' : 'in_progress'}>
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
                        <ActionCell>
                          {editingMatch === match.id ? (
                            <ButtonGroup>
                              <UpdateScoreButton onClick={() => handleUpdateScore(match.id)}>
                                Valider
                              </UpdateScoreButton>
                              <CancelButton onClick={() => setEditingMatch(null)}>
                                Annuler
                              </CancelButton>
                            </ButtonGroup>
                          ) : (
                            <EditScoreButton onClick={() => handleEditMatch(match)}>
                              {match.winner_id ? 'Modifier score' : 'Saisir score'}
                            </EditScoreButton>
                          )}
                        </ActionCell>
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

      {/* Statistiques du tournoi */}
      <StatsSection>
        <SectionTitle>Statistiques du tournoi</SectionTitle>
        <StatsGrid>
          <StatCard onClick={showRegisteredTeamsModal} style={{ cursor: 'pointer' }}>
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
    </PageContainer>
  );
};

export default TournamentSummaryPage;
