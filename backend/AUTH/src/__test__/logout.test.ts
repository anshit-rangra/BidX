import request from 'supertest';
import { getApp, basePath, resetAllMocks } from './test-utils.js';

let app: any;

beforeAll(async () => {
  app = await getApp();
});

describe('POST /logout', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('clears auth session', async () => {
    const res = await request(app).post(`${basePath}/logout`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);
  });
});
