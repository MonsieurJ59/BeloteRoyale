import request from 'supertest';
import { app } from '../src/index';

describe('Teams API', () => {
  it('should return teams list', async () => {
    const response = await request(app).get('/teams');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // On s'attend à 2 équipes d'après notre mock
  });
});