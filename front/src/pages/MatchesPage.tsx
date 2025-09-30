import { useContext, useState, useEffect } from 'react';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
import { TournamentContext } from '../context/TournamentContext';
import type { Match, Tournament } from '../types/api';
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  FiltersContainer,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  MatchesGrid,
  MatchCard,
  MatchHeader,
  TournamentName,
  MatchType,
  TeamsContainer,
  TeamName,
  VersusText,
  ScoreContainer,
  Score,
  ScoreInput,
  UpdateScoreButton,
  LoadingMessage,
  ErrorMessage,
  EmptyState
} from '../styles/MatchesPage.styles.ts';

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
      if (selectedType === 'prelim') {
        filtered = filtered.filter(match => match.match_type === 'preliminaires');
      } else if (selectedType === 'main') {
        filtered = filtered.filter(match => match.match_type.startsWith('principal_'));
      }
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
                <MatchType isPrelim={match.match_type === 'preliminaires'}>
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