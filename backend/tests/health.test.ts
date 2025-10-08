import request from 'supertest';
import { app } from '../src/index';

describe('Health Check API', () => {
  it('should return 200 and ok:true for the health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});