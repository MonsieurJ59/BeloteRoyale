// Mock pour la base de données
export const mockPool = {
  query: jest.fn()
};

// Fonction pour configurer les mocks pour différents tests
export const setupMockResponses = (responses: Record<string, any>) => {
  mockPool.query.mockImplementation((sql: string) => {
    // Simplification : on vérifie juste si la requête contient certains mots-clés
    if (sql.includes('FROM teams')) {
      return [responses.teams || []];
    }
    if (sql.includes('FROM tournaments')) {
      return [responses.tournaments || []];
    }
    if (sql.includes('FROM matches')) {
      return [responses.matches || []];
    }
    // Par défaut, retourner un tableau vide
    return [[]];
  });
};

// Réinitialiser les mocks entre les tests
export const resetMocks = () => {
  mockPool.query.mockReset();
};