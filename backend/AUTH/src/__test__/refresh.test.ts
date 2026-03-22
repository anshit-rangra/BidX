import request from 'supertest';
import { getApp, basePath, createAccessToken, resetAllMocks, setFindOneResult } from './test-utils.js';

let app: any;

beforeAll(async () => {
  app = await getApp();
});

describe('GET /refresh', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('issues new tokens when authenticated', async () => {
    const user = { _id: 'user-123' };
    setFindOneResult(user as any);

    const accessToken = createAccessToken(user._id);

    const res = await request(app)
      .get(`${basePath}/refresh`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});
