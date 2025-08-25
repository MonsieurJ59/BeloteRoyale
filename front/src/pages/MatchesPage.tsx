import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
import { TournamentContext } from '../context/TournamentContext';
import type { Match, Tournament } from '../types/types';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  width: 100%;
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
  background: linear-gradient(135deg, ${theme.colors.background.card}, ${theme.colors.neutral.gray50});
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 220px;
`;

const FilterLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const FilterSelect = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.background.card};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MatchCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.border.light};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  margin-top: ${theme.spacing.sm};
`;

const TournamentName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const MatchType = styled.span<{ isPrelim: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.lighter : theme.colors.status.success + '20'};
  color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.dark : theme.colors.status.success};
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  flex: 1;
  text-align: center;
`;

const VersusText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.muted};
  margin: 0 ${theme.spacing.md};
  background-color: ${theme.colors.neutral.gray100};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.neutral.gray50}, ${theme.colors.neutral.gray100});
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border.light};
`;

const Score = styled.div<{ isWinner?: boolean }>`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${({ isWinner }) => isWinner ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${({ isWinner }) => isWinner ? theme.colors.status.success : theme.colors.text.primary};
  flex: 1;
  text-align: center;
  ${({ isWinner }) => isWinner && `
    text-shadow: 0 0 10px ${theme.colors.status.success}40;
  `}
`;

const ScoreInput = styled.input`
  width: 70px;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.lg};
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
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

const MatchesPage = () => {
  const { matches, loading: matchesLoading, error: matchesError, updateMatchScore } = useContext(MatchContext);
  const { teams, loading: teamsLoading } = useContext(TeamContext);
  const { tournaments, loading: tournamentsLoading } = useContext(TournamentContext);
  
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  
  // Filtrer les matchs en fonction des sélections
  useEffect(() => {
    let filtered = [...matches];
    
    if (selectedTournament !== 'all') {
      filtered = filtered.filter(match => match.tournament_id === parseInt(selectedTournament));
    }
    
    if (selectedType !== 'all') {
      const isPrelim = selectedType === 'prelim';
      filtered = filtered.filter(match => match.is_prelim === isPrelim);
    }
    
    setFilteredMatches(filtered);
  }, [matches, selectedTournament, selectedType]);
  
  const handleEditMatch = (match: Match) => {
    setEditingMatch(match.id);
    setScoreA(match.score_a);
    setScoreB(match.score_b);
  };
  
  const handleUpdateScore = async (matchId: number) => {
    await updateMatchScore(matchId, scoreA, scoreB);
    setEditingMatch(null);
  };
  
  const getTeamName = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Équipe inconnue';
  };
  
  const getTournamentName = (tournamentId: number) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    return tournament ? tournament.name : 'Tournoi inconnu';
  };
  
  if (matchesLoading || teamsLoading || tournamentsLoading) {
    return (
      <PageContainer>
        <Header>
          <Title>Matchs</Title>
        </Header>
        <LoadingMessage>Chargement des matchs...</LoadingMessage>
      </PageContainer>
    );
  }
  
  if (matchesError) {
    return (
      <PageContainer>
        <Header>
          <Title>Matchs</Title>
        </Header>
        <ErrorMessage>{matchesError}</ErrorMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header>
        <Title>Matchs</Title>
        <Subtitle>Consultez et gérez tous les matchs de Belote Royale</Subtitle>
      </Header>
      
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="tournamentFilter">Tournoi</FilterLabel>
          <FilterSelect 
            id="tournamentFilter" 
            value={selectedTournament} 
            onChange={(e) => setSelectedTournament(e.target.value)}
          >
            <option value="all">Tous les tournois</option>
            {tournaments.map((tournament: Tournament) => (
              <option key={tournament.id} value={tournament.id.toString()}>
                {tournament.name}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="typeFilter">Type de match</FilterLabel>
          <FilterSelect 
            id="typeFilter" 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="prelim">Préliminaires</option>
            <option value="main">Principaux</option>
          </FilterSelect>
        </FilterGroup>
      </FiltersContainer>
      
      {filteredMatches.length > 0 ? (
        <MatchesGrid>
          {filteredMatches.map((match: Match) => (
            <MatchCard key={match.id}>
              <MatchHeader>
                <TournamentName>{getTournamentName(match.tournament_id)}</TournamentName>
                <MatchType isPrelim={match.is_prelim}>
                  {match.is_prelim ? 'Préliminaire' : 'Principal'}
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
                  <UpdateScoreButton onClick={() => handleEditMatch(match)}>
                    Modifier le score
                  </UpdateScoreButton>
                </>
              )}
            </MatchCard>
          ))}
        </MatchesGrid>
      ) : (
        <EmptyState>
          Aucun match ne correspond aux critères sélectionnés.
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MatchesPage;