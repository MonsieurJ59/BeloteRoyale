import request from 'supertest';
import { app } from '../src/index';

describe('Tournaments API', () => {
  it('should return tournaments list', async () => {
    const response = await request(app).get('/tournaments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // On s'attend à 2 tournois d'après notre mock
  });
});