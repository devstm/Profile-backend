import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, server } from '../server';

describe('Health Routes', () => {
  afterAll(() => {
    server.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('message', 'Server is healthy');
    });
  });
});
