// Importation des hooks React nécessaires
import { useContext, useEffect, useState } from 'react';
// Importation des composants et hooks de React Router
import { useParams } from 'react-router-dom';
// Importation des contextes pour accéder aux données globales
import { TournamentContext } from '../context/TournamentContext';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
// Importation des types TypeScript depuis le backend
import type { Match, Tournament, TeamTournamentStats } from '../types/api';
// Importation des styles
import {
  PageContainer,
  BackLink,
  Header,
  Title,
  TournamentInfo,
  TournamentDate,
  TournamentStatus,
  SectionTitle,
  GenerateButton,
  NoDataMessage,
  MatchesGrid,
  MatchCard,
  MatchHeader,
  MatchType,
  TeamsContainer,
  TeamName,
  VersusText,
  ScoreContainer,
  Score,
  ScoreInput,
  UpdateScoreButton,
  RankingsTable,
  LoadingMessage,
  ErrorMessage
} from '../styles/TournamentDetailPage.styles.ts';

const TournamentDetailPage = () => {
  // Récupération du paramètre id depuis l'URL avec useParams
  const { id } = useParams<{ id: string }>();
  
  // Utilisation des contextes pour accéder aux données globales
  // useContext permet d'accéder aux données et fonctions fournies par les Providers
  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useContext(TournamentContext);
  const { matches, loading: matchesLoading, error: matchesError, updateMatchScore } = useContext(MatchContext);
  const { teams, loading: teamsLoading } = useContext(TeamContext);
  
  // Définition des états locaux avec useState
  // Ces états sont spécifiques à ce composant et ne sont pas partagés
  const [tournament, setTournament] = useState<Tournament | null>(null); // Le tournoi actuel
  const [tournamentMatches, setTournamentMatches] = useState<Match[]>([]); // Les matchs du tournoi
  const [editingMatch, setEditingMatch] = useState<number | null>(null); // ID du match en cours d'édition
  const [scoreA, setScoreA] = useState<number>(0); // Score de l'équipe A
  const [scoreB, setScoreB] = useState<number>(0); // Score de l'équipe B
  const [teamStats, setTeamStats] = useState<TeamTournamentStats[]>([]); // Statistiques des équipes
  
  // useEffect pour récupérer les données du tournoi
  // Ce hook s'exécute quand tournaments ou id changent
  useEffect(() => {
    if (tournaments.length > 0 && id) {
      // Recherche du tournoi correspondant à l'id dans la liste des tournois
      const foundTournament = tournaments.find(t => t.id === parseInt(id));
      if (foundTournament) {
        setTournament(foundTournament); // Mise à jour de l'état local
      }
    }
  }, [tournaments, id]); // Dépendances du useEffect
  
  // useEffect pour récupérer les matchs du tournoi
  // Ce hook s'exécute quand matches ou id changent
  useEffect(() => {
    if (matches.length > 0 && id) {
      // Filtrage des matchs pour ne garder que ceux du tournoi actuel
      const filteredMatches = matches.filter(m => m.tournament_id === parseInt(id));
      setTournamentMatches(filteredMatches); // Mise à jour de l'état local
    }
  }, [matches, id]); // Dépendances du useEffect
  
  // useEffect pour récupérer les statistiques des équipes pour ce tournoi
  // Ce hook s'exécute quand id change
  useEffect(() => {
    // Fonction asynchrone pour récupérer les données depuis l'API
    const fetchTeamStats = async () => {
      if (!id) return; // Si pas d'id, on ne fait rien
      
      try {
        // Appel à l'API pour récupérer les statistiques
        const response = await fetch(`${import.meta.env.VITE_API_URL}/team-tournament-stats/tournament/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        const data = await response.json();
        setTeamStats(data); // Mise à jour de l'état local
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
      }
    };
    
    fetchTeamStats(); // Appel de la fonction
  }, [id]); // Dépendance du useEffect
  
  // Fonction pour gérer le début de l'édition d'un match
  const handleEditMatch = (match: Match) => {
    setEditingMatch(match.id); // Définir le match en cours d'édition
    setScoreA(match.score_a); // Initialiser le score A avec la valeur actuelle
    setScoreB(match.score_b); // Initialiser le score B avec la valeur actuelle
  };
  
  // Fonction asynchrone pour mettre à jour le score d'un match
  const handleUpdateScore = async (matchId: number) => {
    // Appel à la fonction du contexte pour mettre à jour le score dans l'API
    await updateMatchScore(matchId, scoreA, scoreB);
    setEditingMatch(null); // Sortir du mode édition
  };
  
  // Fonction pour obtenir le nom d'une équipe à partir de son ID
  const getTeamName = (teamId: number): string => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Équipe ${teamId}`;
  };
  
  // Fonctions pour générer les matchs
  const generatePrelimMatches = async (tournamentId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/matches/tournament/${tournamentId}/generate/prelim`, {
        method: 'POST'
      });
      if (response.ok) {
        // Recharger les matchs
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la génération des matchs préliminaires:', error);
    }
  };
  
  const generateMainMatches = async (tournamentId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/matches/tournament/${tournamentId}/generate/main`, {
        method: 'POST'
      });
      if (response.ok) {
        // Recharger les matchs
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la génération des matchs principaux:', error);
    }
  };
  
  // Fonction utilitaire pour formater une date
  const formatDate = (date: Date) => {
    // Utilisation de l'API Intl pour formater la date en français
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Fonction utilitaire pour obtenir le libellé d'un statut
  const getStatusLabel = (status: string) => {
    // Conversion des valeurs techniques en libellés utilisateur
    switch (status) {
      case 'in_progress':
        return 'En cours';
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Terminé';
      default:
        return '';
    }
  };
  
  // Rendu conditionnel : affichage d'un message de chargement
  if (tournamentsLoading || matchesLoading || teamsLoading) {
    return (
      <PageContainer>
        <LoadingMessage>Chargement des données du tournoi...</LoadingMessage>
      </PageContainer>
    );
  }
  
  // Rendu conditionnel : affichage d'un message d'erreur
  if (tournamentsError || matchesError) {
    return (
      <PageContainer>
        <BackLink to="/tournaments">Retour aux tournois</BackLink>
        <ErrorMessage>
          {tournamentsError || matchesError}
        </ErrorMessage>
      </PageContainer>
    );
  }
  
  // Rendu conditionnel : si le tournoi n'est pas trouvé
  if (!tournament) {
    return (
      <PageContainer>
        <BackLink to="/tournaments">Retour aux tournois</BackLink>
        <ErrorMessage>Tournoi non trouvé</ErrorMessage>
      </PageContainer>
    );
  }
  
  // Préparation des données pour l'affichage
  // Séparer les matchs préliminaires et principaux
  const prelimMatches = tournamentMatches.filter(m => m.match_type === 'preliminaires'); // Matchs préliminaires
  const mainMatches = tournamentMatches.filter(m => m.match_type.startsWith('principal_')); // Matchs principaux
  
  // Rendu principal du composant
  return (
    <PageContainer>
      {/* Lien de retour vers la liste des tournois */}
      <BackLink to="/tournaments">Retour aux tournois</BackLink>
      
      {/* En-tête avec le nom et les informations du tournoi */}
      <Header>
        <Title>{tournament.name}</Title>
        <TournamentInfo>
          <TournamentDate>{formatDate(tournament.date)}</TournamentDate>
          <TournamentStatus status={tournament.status}>
            {getStatusLabel(tournament.status)}
          </TournamentStatus>
        </TournamentInfo>
      </Header>
      
      {/* Section du classement des équipes */}
      <SectionTitle>Classement</SectionTitle>
      {/* Affichage conditionnel : tableau si des stats existent, message sinon */}
      {teamStats.length > 0 ? (
        <RankingsTable>
          <thead>
            <tr>
              <th>Position</th>
              <th>Équipe</th>
              <th>Points préliminaires</th>
              <th>Victoires</th>
              <th>Défaites</th>
            </tr>
          </thead>
          <tbody>
            {/* Tri et affichage des statistiques des équipes */}
            {teamStats
              .sort((a, b) => {
                // Tri multi-critères :
                // D'abord par nombre de victoires
                if (a.wins !== b.wins) return b.wins - a.wins;
                // Ensuite par points préliminaires
                if (a.prelim_points !== b.prelim_points) return b.prelim_points - a.prelim_points;
                // Enfin par nombre de défaites (moins de défaites est mieux)
                return a.losses - b.losses;
              })
              // Création des lignes du tableau avec map
              .map((stat, index) => (
                <tr key={stat.id}>
                  <td>{index + 1}</td>
                  <td>{getTeamName(stat.team_id)}</td>
                  <td>{stat.prelim_points}</td>
                  <td>{stat.wins}</td>
                  <td>{stat.losses}</td>
                </tr>
              ))}
          </tbody>
        </RankingsTable>
      ) : (
        <NoDataMessage>Aucune statistique disponible pour ce tournoi.</NoDataMessage>
      )}
      
      {/* Section des matchs préliminaires */}
      <SectionTitle>
        Matchs préliminaires ({prelimMatches.length})
        <GenerateButton onClick={() => generatePrelimMatches(tournament.id)}>
          Générer les matchs préliminaires
        </GenerateButton>
      </SectionTitle>
      {prelimMatches.length > 0 ? (
          <MatchesGrid>
            {/* Création des cartes de match avec map */}
            {prelimMatches.map(match => (
              <MatchCard key={match.id}>
                <MatchHeader>
                  <MatchType isPrelim={true}>Préliminaire</MatchType>
                </MatchHeader>
                {/* Affichage des noms d'équipes */}
                <TeamsContainer>
                  <TeamName>{getTeamName(match.team_a_id)}</TeamName>
                  <VersusText>VS</VersusText>
                  <TeamName>{getTeamName(match.team_b_id)}</TeamName>
                </TeamsContainer>
                
                {/* Rendu conditionnel : formulaire d'édition ou affichage du score */}
                {editingMatch === match.id ? (
                  // Mode édition : formulaire pour modifier le score
                  <>
                    <ScoreContainer>
                      <ScoreInput 
                        type="number" 
                        value={scoreA} 
                        onChange={(e) => setScoreA(parseInt(e.target.value) || 0)} 
                      />
                      <VersusText>-</VersusText>
                      <ScoreInput 
                        type="number" 
                        value={scoreB} 
                        onChange={(e) => setScoreB(parseInt(e.target.value) || 0)} 
                      />
                    </ScoreContainer>
                    <UpdateScoreButton onClick={() => handleUpdateScore(match.id)}>
                      Mettre à jour
                    </UpdateScoreButton>
                  </>
                ) : (
                  // Mode affichage : scores actuels
                  <>
                    <ScoreContainer>
                      {/* Mise en évidence du score gagnant */}
                      <Score isWinner={match.winner_id === match.team_a_id}>{match.score_a}</Score>
                      <VersusText>-</VersusText>
                      <Score isWinner={match.winner_id === match.team_b_id}>{match.score_b}</Score>
                    </ScoreContainer>
                    {/* Bouton de modification affiché uniquement si le tournoi est en cours */}
                    {tournament.status === 'in_progress' && (
                      <UpdateScoreButton onClick={() => handleEditMatch(match)}>
                        Modifier le score
                      </UpdateScoreButton>
                    )}
                  </>
                )}
              </MatchCard>
            ))}
          </MatchesGrid>
      ) : (
        <NoDataMessage>Aucun match préliminaire pour ce tournoi</NoDataMessage>
      )}
      
      {/* Section des matchs principaux */}
      <SectionTitle>
        Matchs principaux ({mainMatches.length})
        <GenerateButton onClick={() => generateMainMatches(tournament.id)}>
          Générer les matchs principaux
        </GenerateButton>
      </SectionTitle>
      {mainMatches.length > 0 ? (
        <MatchesGrid>
          {mainMatches.map((match: Match) => (
            <MatchCard key={match.id}>
              <MatchHeader>
                <MatchType isPrelim={false}>
                  {match.match_type === 'preliminaires' ? 'Préliminaire' : `Principal ${match.match_type.replace('principal_', '')}`}
                </MatchType>
              </MatchHeader>
              <TeamsContainer>
                <TeamName>{getTeamName(match.team_a_id)}</TeamName>
                <VersusText>VS</VersusText>
                <TeamName>{getTeamName(match.team_b_id)}</TeamName>
              </TeamsContainer>
              
              {editingMatch === match.id ? (
                <>
                  <ScoreContainer>
                    <ScoreInput 
                      type="number" 
                      value={scoreA} 
                      onChange={(e) => setScoreA(parseInt(e.target.value) || 0)} 
                    />
                    <VersusText>-</VersusText>
                    <ScoreInput 
                      type="number" 
                      value={scoreB} 
                      onChange={(e) => setScoreB(parseInt(e.target.value) || 0)} 
                    />
                  </ScoreContainer>
                  <UpdateScoreButton onClick={() => handleUpdateScore(match.id)}>
                    Mettre à jour
                  </UpdateScoreButton>
                </>
              ) : (
                <>
                  <ScoreContainer>
                    <Score isWinner={match.winner_id === match.team_a_id}>{match.score_a}</Score>
                    <VersusText>-</VersusText>
                    <Score isWinner={match.winner_id === match.team_b_id}>{match.score_b}</Score>
                  </ScoreContainer>
                  {tournament.status === 'in_progress' && (
                    <UpdateScoreButton onClick={() => handleEditMatch(match)}>
                      Modifier le score
                    </UpdateScoreButton>
                  )}
                </>
              )}
            </MatchCard>
          ))}
        </MatchesGrid>
      ) : (
        <NoDataMessage>Aucun match principal pour ce tournoi</NoDataMessage>
      )}
    </PageContainer>
  );
};

export default TournamentDetailPage;