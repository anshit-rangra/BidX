// @ts-ignore jest globals provided by ts-jest
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Basic user doc shape used across mocks
export type UserDoc = {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  profile?: { profilePic: string; profilePicId?: string };
  money?: number;
};

// Jest mocks shared across tests
export const mockUserModel = {
  findOne: jest.fn<() => Promise<UserDoc | null>>(),
  create: jest.fn<() => Promise<UserDoc>>(),
  findOneAndUpdate: jest.fn<() => Promise<UserDoc>>(),
};

export const uploadPicMock = jest.fn<() => Promise<{ url: string; fileId: string }>>();
export const publishToQueueMock = jest.fn<() => Promise<void> | void>();

// Lazily mock modules and import app after mocks are registered
const appPromise = (async () => {
  await jest.unstable_mockModule('dotenv', () => ({
    __esModule: true,
    config: () => ({}),
  }));

  await jest.unstable_mockModule('../config/google.config.ts', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      name: 'google',
      authenticate: jest.fn(),
    })),
  }));

  await jest.unstable_mockModule('../models/user.model.ts', () => ({
    __esModule: true,
    default: mockUserModel,
  }));

  await jest.unstable_mockModule('../services/imagekit.service.ts', () => ({
    __esModule: true,
    uploadPic: uploadPicMock,
  }));

  await jest.unstable_mockModule('../broker/broker.ts', () => ({
    __esModule: true,
    publishToQueue: publishToQueueMock,
    connectMQ: jest.fn(),
  }));

  await jest.unstable_mockModule('../middlewares/multer.middleware.ts', () => ({
    __esModule: true,
    default: {
      single: () => (req: any, res: any, next: () => void) => next(),
    },
  }));

  await jest.unstable_mockModule('../middlewares/auth.middleware.ts', () => ({
    __esModule: true,
    default: (req: any, res: any, next: () => void) => {
      req.user = { _id: 'user-123' };
      next();
    },
  }));

  const { default: app } = await import('../app.ts');
  return app;
})();

export const basePath = '/api/auth';

export async function getApp() {
  return appPromise;
}

export function createAccessToken(userId: string) {
  return jwt.sign({ _id: userId, token: 'access' }, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  });
}

export function resetAllMocks() {
  jest.clearAllMocks();
  mockUserModel.findOne.mockReset();
  mockUserModel.create.mockReset();
  mockUserModel.findOneAndUpdate.mockReset();
  uploadPicMock.mockReset();
  publishToQueueMock.mockReset();
}

export function setFindOneResult(result: UserDoc | null) {
  mockUserModel.findOne.mockResolvedValue(result);
}

export function setFindOneWithSelect(result: UserDoc | null) {
  mockUserModel.findOne.mockImplementation(() => ({
    select: jest.fn().mockResolvedValue(result as never),
  }) as any);
}
