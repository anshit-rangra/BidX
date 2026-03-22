import request from 'supertest';
import {
  getApp,
  basePath,
  mockUserModel,
  uploadPicMock,
  publishToQueueMock,
  resetAllMocks,
  setFindOneResult,
} from './test-utils.js';

let app: any;

beforeAll(async () => {
  app = await getApp();
});

describe('POST /register/user', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('rejects duplicate email', async () => {
    setFindOneResult({ _id: 'existing-user' } as any);

    const res = await request(app)
      .post(`${basePath}/register/user`)
      .send({ name: 'Jane', email: 'jane@example.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
    expect(mockUserModel.create).not.toHaveBeenCalled();
  });

  test('creates user and enqueues notification', async () => {
    setFindOneResult(null);
    uploadPicMock.mockResolvedValue({ url: 'https://img.test/profile.jpg', fileId: 'file123' });

    const newUser = {
      _id: 'user-123',
      name: 'John',
      email: 'john@example.com',
      password: 'hashed',
      profile: { profilePic: 'https://img.test/profile.jpg', profilePicId: 'file123' },
      money: 0,
    };

    mockUserModel.create.mockResolvedValue(newUser as any);

    const res = await request(app)
      .post(`${basePath}/register/user`)
      .send({ name: 'John', email: 'john@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/New user created/i);
    expect(res.body.token).toBeTruthy();
    expect(publishToQueueMock).toHaveBeenCalledWith(
      'AUTH_NOTIFICATION.USER_CREATED',
      { name: newUser.name, email: newUser.email },
    );
  });
});
