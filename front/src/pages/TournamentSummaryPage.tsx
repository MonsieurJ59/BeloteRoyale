// Importation des modules nécessaires
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { Tournament, Team, Match, TeamTournamentStats } from '../types/api';

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

  // Chargement des données du tournoi
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Récupération des données en parallèle
        const [tournamentRes, teamRankingsRes, matchesRes] = await Promise.all([
          fetch(`http://localhost:4000/tournaments/${id}`),
          fetch(`http://localhost:4000/teams/rankings/tournament/${id}`),
          fetch(`http://localhost:4000/matches?tournament_id=${id}`)
        ]);

        if (!tournamentRes.ok) throw new Error('Tournoi non trouvé');
        if (!teamRankingsRes.ok) throw new Error('Erreur lors du chargement des équipes du tournoi');
        if (!matchesRes.ok) throw new Error('Erreur lors du chargement des matchs');

        const tournamentData = await tournamentRes.json();
        const teamRankingsData = await teamRankingsRes.json();
        const matchesData = await matchesRes.json();

        setTournament(tournamentData);
        setMatches(matchesData);

        // Calcul du classement avec les données déjà filtrées par tournoi
        calculateRankingsFromBackend(teamRankingsData, matchesData);
        
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
    const teamRankings: TeamRanking[] = teamRankingsData.map((teamData, index) => {
      // Reconstitution de l'objet Team à partir des données du backend
      const team: Team = {
        id: teamData.id,
        name: teamData.name,
        player1: teamData.player1,
        player2: teamData.player2
      };

      // Reconstitution des stats à partir des données du backend
      const stats: TeamTournamentStats = {
        id: 0, // Non utilisé dans l'affichage
        team_id: teamData.id,
        tournament_id: parseInt(id!),
        wins: teamData.wins || 0,
        losses: teamData.losses || 0,
        prelim_points: teamData.prelim_points || 0
      };

      // Calcul du score préliminaire total pour cette équipe
      const prelimMatches = matchesData.filter(match => 
        match.match_type === 'preliminaires' && 
        (match.team_a_id === team.id || match.team_b_id === team.id)
      );
      
      const prelimScore = prelimMatches.reduce((total, match) => {
        if (match.team_a_id === team.id) {
          return total + (match.score_a || 0);
        } else {
          return total + (match.score_b || 0);
        }
      }, 0);

      return {
        team,
        stats,
        prelimScore,
        rank: index + 1 // Les données du backend sont déjà triées
      };
    });

    setRankings(teamRankings);
  };

  // Fonction pour grouper les matchs par type
  const getMatchesByType = () => {
    const matchTypes = new Map<string, { type: string; matches: Match[]; displayName: string }>();
    
    matches.forEach(match => {
      if (!matchTypes.has(match.match_type)) {
        let displayName = '';
        if (match.match_type === 'preliminaires') {
          displayName = 'Matchs préliminaires';
        } else if (match.match_type.startsWith('principal_')) {
          const roundNumber = match.match_type.split('_')[1];
          displayName = `Matchs principaux - Manche ${roundNumber}`;
        } else {
          displayName = match.match_type;
        }
        
        matchTypes.set(match.match_type, {
          type: match.match_type,
          matches: [],
          displayName
        });
      }
      matchTypes.get(match.match_type)!.matches.push(match);
    });

    // Trier les types de matchs : préliminaires d'abord, puis principal_1, principal_2, etc.
    return Array.from(matchTypes.values()).sort((a, b) => {
      if (a.type === 'preliminaires') return -1;
      if (b.type === 'preliminaires') return 1;
      if (a.type.startsWith('principal_') && b.type.startsWith('principal_')) {
        const aNum = parseInt(a.type.split('_')[1]);
        const bNum = parseInt(b.type.split('_')[1]);
        return aNum - bNum;
      }
      return a.type.localeCompare(b.type);
    });
  };

  // Fonction pour obtenir le nom d'une équipe par son ID
  const getTeamName = (teamId: number): string => {
    const teamRanking = rankings.find(ranking => ranking.team.id === teamId);
    return teamRanking ? teamRanking.team.name : `Équipe #${teamId}`;
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

      {/* Tableau des matchs par type */}
      <MatchesSection>
        <SectionTitle>Matchs du tournoi</SectionTitle>
        {matches.length === 0 ? (
          <EmptyMessage>Aucun match programmé pour ce tournoi.</EmptyMessage>
        ) : (
          <MatchesByType>
            {getMatchesByType().map(({ type, matches: typeMatches, displayName }) => (
              <MatchTypeSection key={type}>
                <MatchTypeTitle>{displayName} ({typeMatches.length} match{typeMatches.length > 1 ? 's' : ''})</MatchTypeTitle>
                <MatchesTable>
                  <MatchesTableHeader>
                    <MatchHeaderCell>Match</MatchHeaderCell>
                    <MatchHeaderCell>Équipe A</MatchHeaderCell>
                    <MatchHeaderCell>Score</MatchHeaderCell>
                    <MatchHeaderCell>Équipe B</MatchHeaderCell>
                    <MatchHeaderCell>Statut</MatchHeaderCell>
                  </MatchesTableHeader>
                  <MatchesTableBody>
                    {typeMatches.map((match, index) => (
                      <MatchRow key={match.id} $completed={!!match.winner_id}>
                        <MatchCell>#{index + 1}</MatchCell>
                        <TeamMatchCell>
                          <TeamMatchName>{getTeamName(match.team_a_id)}</TeamMatchName>
                        </TeamMatchCell>
                        <ScoreCell>
                          <Score $isWinner={match.winner_id === match.team_a_id}>
                            {match.score_a || 0}
                          </Score>
                          <ScoreSeparator>-</ScoreSeparator>
                          <Score $isWinner={match.winner_id === match.team_b_id}>
                            {match.score_b || 0}
                          </Score>
                        </ScoreCell>
                        <TeamMatchCell>
                          <TeamMatchName>{getTeamName(match.team_b_id)}</TeamMatchName>
                        </TeamMatchCell>
                        <StatusCell>
                          <StatusBadgeMatch $status={match.winner_id ? 'completed' : 'pending'}>
                            {match.winner_id ? 'Terminé' : 'En attente'}
                          </StatusBadgeMatch>
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
  display: grid;
  grid-template-columns: 80px 1fr 120px 1fr 100px;
  background: ${theme.colors.neutral.gray100};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 100px 1fr 80px;
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const MatchHeaderCell = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  border-right: 1px solid ${theme.colors.border.light};
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

const MatchesTableBody = styled.div``;

const MatchRow = styled.div<{ $completed: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr 120px 1fr 100px;
  border-bottom: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.$completed && `
    background: linear-gradient(90deg, ${theme.colors.status.success}10, transparent);
    border-left: 4px solid ${theme.colors.status.success};
  `}
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 100px 1fr 80px;
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

export default TournamentSummaryPage;
