import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
import { TournamentContext } from '../context/TournamentContext';
import type { Match, Team, Tournament } from '../types/types';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 5px;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  
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

const TournamentName = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
  background-color: #f9f9fa;
  border-radius: 8px;
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