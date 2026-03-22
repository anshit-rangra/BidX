import crypto from 'crypto';
import request from 'supertest';
import { getApp, basePath, resetAllMocks, setFindOneWithSelect } from './test-utils.js';

let app: any;

beforeAll(async () => {
  app = await getApp();
});

describe('POST /login', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('fails for unknown user', async () => {
    setFindOneWithSelect(null);

    const res = await request(app)
      .post(`${basePath}/login`)
      .send({ email: 'missing@example.com', password: 'secret123' });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not registered/i);
  });

  test('returns token for valid credentials', async () => {
    const password = 'secret123';
    const hashed = crypto.createHash('sha256').update(password).digest('hex');

    setFindOneWithSelect({ _id: 'user-123', password: hashed } as never);

    const res = await request(app)
      .post(`${basePath}/login`)
      .send({ email: 'john@example.com', password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});
