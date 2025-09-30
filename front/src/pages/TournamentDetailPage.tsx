import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TournamentContext } from '../context/TournamentContext';
import { MatchContext } from '../context/MatchContext';
import { TeamContext } from '../context/TeamContext';
import type { Match, Tournament, TeamTournamentStats } from '../types/api';
import '../styles/TournamentDetailPage.css';

const TournamentDetailPage = () => {
  // Récupération de l'id du tournoi depuis l'URL
  const { id } = useParams<{ id: string }>();
  
  // Récupération des données depuis les contextes
  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useContext(TournamentContext);
  const { matches, loading: matchesLoading, error: matchesError, updateMatchScore } = useContext(MatchContext);
  const { teams, loading: teamsLoading } = useContext(TeamContext);
  
  // Définition des états locaux avec useState
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tournamentMatches, setTournamentMatches] = useState<Match[]>([]);
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [teamStats, setTeamStats] = useState<TeamTournamentStats[]>([]);
  
  // useEffect pour récupérer les données du tournoi
  useEffect(() => {
    if (tournaments.length > 0 && id) {
      const foundTournament = tournaments.find(t => t.id === parseInt(id));
      if (foundTournament) {
        setTournament(foundTournament);
      }
    }
  }, [tournaments, id]);
  
  // useEffect pour récupérer les matchs du tournoi
  useEffect(() => {
    if (matches.length > 0 && id) {
      const filteredMatches = matches.filter(m => m.tournament_id === parseInt(id));
      setTournamentMatches(filteredMatches);
    }
  }, [matches, id]);
  
  // useEffect pour récupérer les statistiques des équipes pour ce tournoi
  useEffect(() => {
    const fetchTeamStats = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/team-tournament-stats/tournament/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        const data = await response.json();
        setTeamStats(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
      }
    };
    
    fetchTeamStats();
  }, [id]);
  
  // Fonction pour gérer le début de l'édition d'un match
  const handleEditMatch = (match: Match) => {
    setEditingMatch(match.id);
    setScoreA(match.score_a);
    setScoreB(match.score_b);
  };
  
  // Fonction asynchrone pour mettre à jour le score d'un match
  const handleUpdateScore = async (matchId: number) => {
    await updateMatchScore(matchId, scoreA, scoreB);
    setEditingMatch(null);
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
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la génération des matchs principaux:', error);
    }
  };
  
  // Fonction utilitaire pour formater une date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Fonction utilitaire pour obtenir le libellé d'un statut
  const getStatusLabel = (status: string) => {
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
      <div className="tournament-detail-page">
        <div className="loading-message">Chargement des données du tournoi...</div>
      </div>
    );
  }
  
  // Rendu conditionnel : affichage d'un message d'erreur
  if (tournamentsError || matchesError) {
    return (
      <div className="tournament-detail-page">
        <Link to="/tournaments" className="back-link">Retour aux tournois</Link>
        <div className="error-message">
          {tournamentsError || matchesError}
        </div>
      </div>
    );
  }
  
  // Rendu conditionnel : si le tournoi n'est pas trouvé
  if (!tournament) {
    return (
      <div className="tournament-detail-page">
        <Link to="/tournaments" className="back-link">Retour aux tournois</Link>
        <div className="error-message">Tournoi non trouvé</div>
      </div>
    );
  }
  
  // Préparation des données pour l'affichage
  const prelimMatches = tournamentMatches.filter(m => m.match_type === 'preliminaires');
  const mainMatches = tournamentMatches.filter(m => m.match_type.startsWith('principal_'));
  
  // Rendu principal du composant
  return (
    <div className="tournament-detail-page">
      <Link to="/tournaments" className="back-link">Retour aux tournois</Link>
      
      <header className="tournament-header">
        <h1 className="tournament-title">{tournament.name}</h1>
        <div className="tournament-info">
          <p className="tournament-date">{formatDate(tournament.date)}</p>
          <span className={`tournament-status ${tournament.status.replace('_', '-')}`}>
            {getStatusLabel(tournament.status)}
          </span>
        </div>
      </header>
      
      <h2 className="section-title">Classement</h2>
      {teamStats.length > 0 ? (
        <table className="rankings-table">
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
            {teamStats
              .sort((a, b) => {
                if (a.wins !== b.wins) return b.wins - a.wins;
                if (a.prelim_points !== b.prelim_points) return b.prelim_points - a.prelim_points;
                return a.losses - b.losses;
              })
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
        </table>
      ) : (
        <p>Aucune statistique disponible pour ce tournoi.</p>
      )}
      
      <h2 className="section-title">
        Matchs préliminaires ({prelimMatches.length})
        <button className="generate-button" onClick={() => generatePrelimMatches(tournament.id)}>
          Générer les matchs préliminaires
        </button>
      </h2>
      {prelimMatches.length > 0 ? (
          <div className="matches-grid">
            {prelimMatches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <span className="match-type prelim">Préliminaire</span>
                </div>
                <div className="teams-container">
                  <div className="team-name">{getTeamName(match.team_a_id)}</div>
                  <div className="versus-text">VS</div>
                  <div className="team-name">{getTeamName(match.team_b_id)}</div>
                </div>
                
                {editingMatch === match.id ? (
                  <>
                    <div className="score-container">
                      <input 
                        className="score-input"
                        type="number" 
                        value={scoreA} 
                        onChange={(e) => setScoreA(parseInt(e.target.value) || 0)} 
                      />
                      <div className="versus-text">-</div>
                      <input 
                        className="score-input"
                        type="number" 
                        value={scoreB} 
                        onChange={(e) => setScoreB(parseInt(e.target.value) || 0)} 
                      />
                    </div>
                    <button className="update-score-button" onClick={() => handleUpdateScore(match.id)}>
                      Mettre à jour
                    </button>
                  </>
                ) : (
                  <>
                    <div className="score-container">
                      <div className={`score ${match.winner_id === match.team_a_id ? 'winner' : ''}`}>
                        {match.score_a}
                      </div>
                      <div className="versus-text">-</div>
                      <div className={`score ${match.winner_id === match.team_b_id ? 'winner' : ''}`}>
                        {match.score_b}
                      </div>
                    </div>
                    {tournament.status === 'in_progress' && (
                      <button className="update-score-button" onClick={() => handleEditMatch(match)}>
                        Modifier le score
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
      ) : (
        <p className="no-data-message">Aucun match préliminaire pour ce tournoi</p>
      )}
      
      <h2 className="section-title">
        Matchs principaux ({mainMatches.length})
        <button className="generate-button" onClick={() => generateMainMatches(tournament.id)}>
          Générer les matchs principaux
        </button>
      </h2>
      {mainMatches.length > 0 ? (
        <div className="matches-grid">
          {mainMatches.map((match: Match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <span className="match-type main">
                  {match.match_type === 'preliminaires' ? 'Préliminaire' : `Principal ${match.match_type.replace('principal_', '')}`}
                </span>
              </div>
              <div className="teams-container">
                <div className="team-name">{getTeamName(match.team_a_id)}</div>
                <div className="versus-text">VS</div>
                <div className="team-name">{getTeamName(match.team_b_id)}</div>
              </div>
              
              {editingMatch === match.id ? (
                <>
                  <div className="score-container">
                    <input 
                      className="score-input"
                      type="number" 
                      value={scoreA} 
                      onChange={(e) => setScoreA(parseInt(e.target.value) || 0)} 
                    />
                    <div className="versus-text">-</div>
                    <input 
                      className="score-input"
                      type="number" 
                      value={scoreB} 
                      onChange={(e) => setScoreB(parseInt(e.target.value) || 0)} 
                    />
                  </div>
                  <button className="update-score-button" onClick={() => handleUpdateScore(match.id)}>
                    Mettre à jour
                  </button>
                </>
              ) : (
                <>
                  <div className="score-container">
                    <div className={`score ${match.winner_id === match.team_a_id ? 'winner' : ''}`}>
                      {match.score_a}
                    </div>
                    <div className="versus-text">-</div>
                    <div className={`score ${match.winner_id === match.team_b_id ? 'winner' : ''}`}>
                      {match.score_b}
                    </div>
                  </div>
                  {tournament.status === 'in_progress' && (
                    <button className="update-score-button" onClick={() => handleEditMatch(match)}>
                      Modifier le score
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-message">Aucun match principal pour ce tournoi</p>
      )}
    </div>
  );
};

export default TournamentDetailPage;