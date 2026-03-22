import request from 'supertest';
import { getApp, basePath, resetAllMocks } from './test-utils.js';

let app: any;

beforeAll(async () => {
  app = await getApp();
});

describe('GET /api/auth', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('responds with hello message', async () => {
    const res = await request(app).get(`${basePath}/`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello world' });
  });
});
