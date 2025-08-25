// Importation des hooks React nécessaires
import { useContext, useEffect, useState } from 'react';
// Importation des composants et hooks de React Router
import { useParams, Link } from 'react-router-dom';
// Importation de styled-components pour le styling
import styled from 'styled-components';
// Importation des contextes pour accéder aux données globales
import { TournamentContext } from '../context/TournamentContext';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
// Importation des types TypeScript
import type { Tournament, Match, Team, TeamTournamentStats } from '../types/types';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:before {
    content: '←';
    margin-right: 8px;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TournamentInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TournamentDate = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-right: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const TournamentStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'in_progress':
        return '#e1f5fe';
      case 'upcoming':
        return '#e8f5e9';
      case 'completed':
        return '#f5f5f5';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'in_progress':
        return '#0288d1';
      case 'upcoming':
        return '#388e3c';
      case 'completed':
        return '#616161';
      default:
        return '#616161';
    }
  }};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MatchCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MatchType = styled.span<{ isPrelim: boolean }>`
  font-size: 0.9rem;
  padding: 3px 8px;
  border-radius: 4px;
  background-color: ${({ isPrelim }) => isPrelim ? '#fff8e1' : '#e8f5e9'};
  color: ${({ isPrelim }) => isPrelim ? '#ffa000' : '#388e3c'};
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const TeamName = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  color: #2c3e50;
  flex: 1;
  text-align: center;
`;

const VersusText = styled.div`
  font-size: 0.9rem;
  color: #95a5a6;
  margin: 0 10px;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
`;

const Score = styled.div<{ isWinner?: boolean }>`
  font-size: 1.5rem;
  font-weight: ${({ isWinner }) => isWinner ? '700' : '500'};
  color: ${({ isWinner }) => isWinner ? '#27ae60' : '#2c3e50'};
  flex: 1;
  text-align: center;
`;

const ScoreInput = styled.input`
  width: 60px;
  padding: 8px;
  font-size: 1.2rem;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const UpdateScoreButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const RankingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #e74c3c;
  background-color: #fdeaea;
  border-radius: 8px;
  margin-bottom: 20px;
`;

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
  
  // Fonction utilitaire pour obtenir le nom d'une équipe à partir de son ID
  const getTeamName = (teamId: number) => {
    // Recherche de l'équipe dans la liste des équipes
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Équipe inconnue'; // Retourne le nom ou une valeur par défaut
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
  const prelimMatches = tournamentMatches.filter(m => m.is_prelim); // Matchs préliminaires
  const mainMatches = tournamentMatches.filter(m => !m.is_prelim); // Matchs principaux
  
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
        <p>Aucune statistique disponible pour ce tournoi.</p>
      )}
      
      {/* Section des matchs préliminaires - affichée uniquement s'il y a des matchs */}
      {prelimMatches.length > 0 && (
        <>
          <SectionTitle>Matchs préliminaires</SectionTitle>
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
        </>
      )}
      
      {/* Section des matchs principaux - affichée uniquement s'il y a des matchs */}
      {mainMatches.length > 0 && (
        <>
          <SectionTitle>Matchs principaux</SectionTitle>
          <MatchesGrid>
            {/* Structure identique à celle des matchs préliminaires */}
            {mainMatches.map(match => (
              <MatchCard key={match.id}>
                <MatchHeader>
                  <MatchType isPrelim={false}>Principal</MatchType>
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
        </>
      )}
      
      {/* Message affiché s'il n'y a aucun match */}
      {tournamentMatches.length === 0 && (
        <p>Aucun match n'a encore été créé pour ce tournoi.</p>
      )}
    </PageContainer>
  );
};

export default TournamentDetailPage;