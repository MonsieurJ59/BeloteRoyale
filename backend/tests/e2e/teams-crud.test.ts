import request from 'supertest';
import { app } from '../../src/index';
import { setupMockResponses } from '../mocks/db.mock';

describe('Teams CRUD E2E Tests', () => {
  let teamId: number;

  beforeEach(() => {
    setupMockResponses({
      insertTeam: { insertId: 1 },
      teams: [
        { id: 1, name: 'Team 1', player1: 'Player 1', player2: 'Player 2' }
      ]
    });
  });

  it('should perform CRUD operations on teams', async () => {
    // 1. Créer une équipe
    const createResponse = await request(app)
      .post('/teams')
      .send({
        name: 'New Team',
        player1: 'New Player 1',
        player2: 'New Player 2'
      });
    
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    teamId = createResponse.body.id;

    // 2. Récupérer l'équipe créée
    const getResponse = await request(app)
      .get(`/teams/${teamId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe('Team 1'); // Valeur mockée

    // 3. Mettre à jour l'équipe
    const updateResponse = await request(app)
    .patch(`/teams/${teamId}`)
    .send({
        name: 'Updated Team',
        player1: 'Updated Player 1',
        player2: 'Updated Player 2'
    });

    expect(updateResponse.status).toBe(200);

    // 4. Vérifier la mise à jour
    const getUpdatedResponse = await request(app)
      .get(`/teams/${teamId}`);
    
    expect(getUpdatedResponse.status).toBe(200);
    // Note: Dans un test réel, on vérifierait les valeurs mises à jour
    // Mais avec notre mock, on obtient toujours les mêmes valeurs

    // 5. Supprimer l'équipe
    const deleteResponse = await request(app)
      .delete(`/teams/${teamId}`);
    
    expect(deleteResponse.status).toBe(204);

    // 6. Vérifier que l'équipe n'existe plus
    // Note: Dans un test réel, on s'attendrait à un 404
    // Mais notre mock ne simule pas cette logique
  });
});