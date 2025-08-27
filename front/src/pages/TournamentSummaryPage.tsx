// Importation des modules nécessaires
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { Tournament, Team, Match, TeamTournamentStats } from '../types/types';

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
        const [tournamentRes, teamsRes, matchesRes, statsRes] = await Promise.all([
          fetch(`http://localhost:4000/tournaments/${id}`),
          fetch(`http://localhost:4000/teams`),
          fetch(`http://localhost:4000/matches?tournament_id=${id}`),
          fetch(`http://localhost:4000/team-tournament-stats/tournament/${id}`)
        ]);

        if (!tournamentRes.ok) throw new Error('Tournoi non trouvé');
        if (!teamsRes.ok) throw new Error('Erreur lors du chargement des équipes');
        if (!matchesRes.ok) throw new Error('Erreur lors du chargement des matchs');
        if (!statsRes.ok) throw new Error('Erreur lors du chargement des statistiques');

        const tournamentData = await tournamentRes.json();
        const teamsData = await teamsRes.json();
        const matchesData = await matchesRes.json();
        const statsData = await statsRes.json();

        setTournament(tournamentData);
        setMatches(matchesData);

        // Calcul du classement
        calculateRankings(teamsData, statsData, matchesData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  // Fonction pour calculer le classement des équipes
  const calculateRankings = (teamsData: Team[], statsData: TeamTournamentStats[], matchesData: Match[]) => {
    const teamRankings: TeamRanking[] = teamsData
      .map(team => {
        const teamStats = statsData.find(stat => stat.team_id === team.id);
        if (!teamStats) return null;

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
          stats: teamStats,
          prelimScore,
          rank: 0 // Sera calculé après le tri
        };
      })
      .filter(Boolean) as TeamRanking[];

    // Tri par nombre de victoires (décroissant), puis par score préliminaire (décroissant)
    teamRankings.sort((a, b) => {
      if (a.stats.wins !== b.stats.wins) {
        return b.stats.wins - a.stats.wins;
      }
      return b.prelimScore - a.prelimScore;
    });

    // Attribution des rangs
    teamRankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    setRankings(teamRankings);
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

export default TournamentSummaryPage;
