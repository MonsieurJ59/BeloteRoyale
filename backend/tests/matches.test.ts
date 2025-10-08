import request from 'supertest';
import { app } from '../src/index';

describe('Matches API', () => {
  it('should return matches list', async () => {
    const response = await request(app).get('/matches');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // On s'attend à 1 match d'après notre mock
  });
});