// Mock pour la base de données
export const mockPool = {
  query: jest.fn(),
  getConnection: jest.fn().mockImplementation(() => {
    return {
      beginTransaction: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockImplementation((sql: string, params?: any[]) => {
        // Même logique que pour mockPool.query
        if (sql.includes('INSERT INTO tournaments')) {
          return [{ insertId: 1 }];
        }
        if (sql.includes('INSERT INTO teams')) {
          return [{ insertId: 1 }];
        }
        if (sql.includes('INSERT INTO matches')) {
          return [{ insertId: 1 }];
        }
        if (sql.includes('INSERT INTO team_tournaments')) {
          return [{ insertId: 1 }];
        }
        if (sql.includes('INSERT INTO tournament_match_configs')) {
          return [{ insertId: 1 }];
        }
        if (sql.includes('UPDATE')) {
          return [{ affectedRows: 1 }];
        }
        if (sql.includes('DELETE')) {
          return [{ affectedRows: 1 }];
        }
        return [[]];
      })
    };
  })
};

// Fonction pour configurer les mocks pour différents tests
export const setupMockResponses = (responses: Record<string, any>) => {
  // Configuration pour mockPool.query
  mockPool.query.mockImplementation((sql: string, params?: any[]) => {
    // Requêtes SELECT
    if (sql.includes('SELECT') && sql.includes('FROM teams')) {
      if (sql.includes('WHERE id =')) {
        // Retourner une équipe spécifique
        return [[responses.teams?.[0] || { id: 1, name: 'Team 1', player1: 'Player 1', player2: 'Player 2' }]];
      }
      return [responses.teams || []];
    }
    
    if (sql.includes('SELECT') && sql.includes('FROM tournaments')) {
      if (sql.includes('WHERE id =')) {
        // Retourner un tournoi spécifique
        return [[responses.tournaments?.[0] || { id: 1, name: 'Tournament 1', date: '2023-01-01', status: 'upcoming' }]];
      }
      return [responses.tournaments || []];
    }
    
    if (sql.includes('SELECT') && sql.includes('FROM matches')) {
      if (sql.includes('WHERE id =')) {
        // Retourner un match spécifique
        return [[responses.matches?.[0] || {}]];
      }
      return [responses.matches || []];
    }
    
    // Requêtes INSERT
    if (sql.includes('INSERT INTO teams')) {
      return [responses.insertTeam || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO tournaments')) {
      return [responses.insertTournament || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO matches')) {
      return [responses.insertMatch || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO team_tournaments')) {
      return [responses.insertTeamTournament || { insertId: 1 }];
    }
    
    // Requêtes UPDATE
    if (sql.includes('UPDATE')) {
      return [{ affectedRows: 1 }];
    }
    
    // Requêtes DELETE
    if (sql.includes('DELETE')) {
      return [{ affectedRows: 1 }];
    }
    
    // Vérification des équipes inscrites au tournoi
    if (sql.includes('SELECT team_id FROM team_tournament WHERE tournament_id =') && sql.includes('AND team_id IN')) {
      // Simuler que les deux équipes sont inscrites au tournoi
      return [[{ team_id: params[1] }, { team_id: params[2] }]];
    }
    
    // Vérification des matches par ID
    if (sql.includes('SELECT') && sql.includes('FROM matches') && sql.includes('WHERE id =')) {
      // Retourner un match spécifique pour les requêtes par ID
      // Utiliser le paramètre passé comme ID du match
      const matchId = params[0];
      return [[{ 
        id: matchId, 
        tournament_id: 1, 
        team_a_id: 1, 
        team_b_id: 2, 
        score_a: 0, 
        score_b: 0, 
        match_type: 'preliminaires' 
      }]];
    }
    
    // Ajouter une condition spécifique pour la mise à jour des matches
    if (sql.includes('UPDATE matches SET') && sql.includes('WHERE id =')) {
      // Simuler une mise à jour réussie
      return [{ affectedRows: 1 }];
    }
    
    // Vérification des tournois
    if (sql.includes('SELECT id FROM tournaments WHERE id =')) {
      return [[{ id: params[0] }]];
    }
    
    // Vérification des équipes
    if (sql.includes('SELECT id FROM teams WHERE id IN')) {
      return [[{ id: params[0] }, { id: params[1] }]];
    }
    
    // Par défaut, retourner un tableau vide
    return [[]];
  });
  
  // Mise à jour de la configuration pour getConnection().query
  const connectionMock = mockPool.getConnection();
  connectionMock.query.mockImplementation((sql: string, params?: any[]) => {
    // Même logique que pour mockPool.query
    if (sql.includes('SELECT') && sql.includes('FROM teams')) {
      if (sql.includes('WHERE id =')) {
        return [[responses.teams?.[0] || { id: 1, name: 'Team 1', player1: 'Player 1', player2: 'Player 2' }]];
      }
      return [responses.teams || []];
    }
    
    if (sql.includes('SELECT') && sql.includes('FROM tournaments')) {
      if (sql.includes('WHERE id =')) {
        return [[responses.tournaments?.[0] || { id: 1, name: 'Tournament 1', date: '2023-01-01', status: 'upcoming' }]];
      }
      return [responses.tournaments || []];
    }
    
    if (sql.includes('INSERT INTO tournaments')) {
      return [responses.insertTournament || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO teams')) {
      return [responses.insertTeam || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO matches')) {
      return [responses.insertMatch || { insertId: 1 }];
    }
    
    if (sql.includes('INSERT INTO team_tournaments')) {
      return [responses.insertTeamTournament || { insertId: 1 }];
    }
    
    if (sql.includes('UPDATE')) {
      return [{ affectedRows: 1 }];
    }
    
    return [[]];
  });
};

// Réinitialiser les mocks entre les tests
export const resetMocks = () => {
  mockPool.query.mockReset();
  mockPool.getConnection.mockReset();
  
  // Réinitialiser le mock de getConnection
  mockPool.getConnection.mockImplementation(() => {
    return {
      beginTransaction: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue([[]])
    };
  });
};