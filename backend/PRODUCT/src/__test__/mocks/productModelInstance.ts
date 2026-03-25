import { jest } from '@jest/globals';

export const mockProductModel: any = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
};
