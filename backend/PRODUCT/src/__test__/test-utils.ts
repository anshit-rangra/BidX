// @ts-ignore jest globals provided by ts-jest
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { mockProductModel } from './mocks/productModelInstance.ts';
import { uploadPicMock, deletePicMock } from './mocks/imagekitInstance.ts';
import { setProductModel } from '../models/productModelProvider.ts';
import { setImagekitMocks } from '../services/imagekitProvider.ts';
import { setUploadMiddleware } from '../middlewares/uploadProvider.ts';
export { uploadPicMock, deletePicMock } from './mocks/imagekitInstance.ts';
export { mockProductModel } from './mocks/productModelInstance.ts';

const defaultFiles = [
  {
    fieldname: 'images',
    originalname: 'item.jpg',
    filename: 'item.jpg',
    path: '/tmp/item.jpg',
  },
];

let currentFiles: any[] | undefined = [...defaultFiles];

function setFindResult(result: any) {
  const skipMock = jest.fn<() => Promise<any>>().mockResolvedValue(result);
  const sortMock = jest.fn<() => any>().mockReturnValue({ skip: skipMock });
  mockProductModel.find.mockReturnValue({ sort: sortMock });
  return { skipMock, sortMock };
}

export function setFindOneResult(result: any) {
  mockProductModel.findOne.mockResolvedValue(result);
}

export function setCreateResult(result: any) {
  mockProductModel.create.mockResolvedValue(result);
}

export function setFindResultWithChain(result: any) {
  return setFindResult(result);
}

export function setMockFiles(files: any[] | undefined) {
  currentFiles = files;
  try {
    // Keep the standalone multer mock in sync
    const { __setFiles } = require('./mocks/multer.middleware.ts');
    __setFiles(files);
  } catch (err) {
    /* no-op when module not loaded yet */
  }
}

export const basePath = '/api/product';

const appPromise = (async () => {
  setProductModel(mockProductModel);
  setImagekitMocks({ uploadPic: uploadPicMock, deletePic: deletePicMock });
  setUploadMiddleware((req: any, _res: any, next: () => void) => {
    req.files = currentFiles;
    next();
  });
  await jest.unstable_mockModule('dotenv', () => ({
    __esModule: true,
    config: () => ({}),
  }));

  await jest.unstable_mockModule('../models/product.model', () => ({
    __esModule: true,
    default: mockProductModel,
  }));

  await jest.unstable_mockModule('../models/product.model.ts', () => ({
    __esModule: true,
    default: mockProductModel,
  }));

  await jest.unstable_mockModule('../services/imagekit.service', () => ({
    __esModule: true,
    uploadPic: uploadPicMock,
    deletePic: deletePicMock,
  }));

  await jest.unstable_mockModule('../services/imagekit.service.ts', () => ({
    __esModule: true,
    uploadPic: uploadPicMock,
    deletePic: deletePicMock,
  }));

  await jest.unstable_mockModule('../middlewares/multer.middleware', () => ({
    __esModule: true,
    default: {
      array: () => (req: any, _res: any, next: () => void) => {
        req.files = currentFiles;
        next();
      },
    },
  }));

  await jest.unstable_mockModule('../middlewares/multer.middleware.ts', () => ({
    __esModule: true,
    default: {
      array: () => (req: any, _res: any, next: () => void) => {
        req.files = currentFiles;
        next();
      },
    },
  }));

  await jest.unstable_mockModule('uuid', () => ({
    __esModule: true,
    v4: jest.fn(() => 'mock-uuid'),
  }));

  await jest.unstable_mockModule('../middlewares/auth.middleware', () => ({
    __esModule: true,
    default: (req: any, _res: any, next: () => void) => {
      req.user = { _id: 'user-123' };
      next();
    },
  }));

  await jest.unstable_mockModule('../middlewares/auth.middleware.ts', () => ({
    __esModule: true,
    default: (req: any, _res: any, next: () => void) => {
      req.user = { _id: 'user-123' };
      next();
    },
  }));

  await jest.unstable_mockModule('../validators/zod.validator', () => ({
    __esModule: true,
    default: (_req: any, _res: any, next: () => void) => next(),
  }));

  await jest.unstable_mockModule('../validators/zod.validator.ts', () => ({
    __esModule: true,
    default: (_req: any, _res: any, next: () => void) => next(),
  }));

  const { default: app } = await import('../app.ts');
  return app;
})();

export async function getApp() {
  return appPromise;
}

export function resetAllMocks() {
  jest.clearAllMocks();
  mockProductModel.find.mockReset();
  mockProductModel.create.mockReset();
  mockProductModel.findOne.mockReset();
  uploadPicMock.mockReset();
  deletePicMock.mockReset();
  setMockFiles([...defaultFiles]);
}

export function makeAuthHeader(userId = 'user-123') {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET as string);
  return `Bearer ${token}`;
}
