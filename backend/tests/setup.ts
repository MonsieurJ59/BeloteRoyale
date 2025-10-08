// Configuration globale pour les tests
import { setupMockResponses, resetMocks } from './mocks/db.mock';

// Mock du module db.ts
jest.mock('../src/db', () => {
  const { mockPool } = require('./mocks/db.mock');
  return { pool: mockPool };
});

// Avant chaque test, configurer des données de test par défaut
beforeEach(() => {
  setupMockResponses({
    teams: [
      { id: 1, name: 'Team 1', player1: 'Player 1', player2: 'Player 2' },
      { id: 2, name: 'Team 2', player1: 'Player 3', player2: 'Player 4' }
    ],
    tournaments: [
      { id: 1, name: 'Tournament 1', date: '2023-01-01', status: 'upcoming' },
      { id: 2, name: 'Tournament 2', date: '2023-02-01', status: 'in_progress' }
    ],
    matches: [
      { id: 1, tournament_id: 1, team_a_id: 1, team_b_id: 2, score_a: 0, score_b: 0, match_type: 'preliminaires' }
    ]
  });
});

// Après chaque test, réinitialiser les mocks
afterEach(() => {
  resetMocks();
});