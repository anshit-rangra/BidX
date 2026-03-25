import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__test__/**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
    '^uuid$': '<rootDir>/src/__test__/mocks/uuid.ts',
    '^\.\./models/product\.model(\.ts)?$': '<rootDir>/src/__test__/mocks/product.model.ts',
    '.*/models/product\.model\.ts$': '<rootDir>/src/__test__/mocks/product.model.ts',
    '^\.\./services/imagekit\.service(\.ts)?$': '<rootDir>/src/__test__/mocks/imagekit.service.ts',
    '.*/services/imagekit\.service\.ts$': '<rootDir>/src/__test__/mocks/imagekit.service.ts',
    '^\.\./middlewares/auth\.middleware(\.ts)?$': '<rootDir>/src/__test__/mocks/auth.middleware.ts',
    '^\.\./middlewares/multer\.middleware(\.ts)?$': '<rootDir>/src/__test__/mocks/multer.middleware.ts',
    '.*/middlewares/multer\.middleware\.ts$': '<rootDir>/src/__test__/mocks/multer.middleware.ts',
    '^\.\./validators/zod\.validator(\.ts)?$': '<rootDir>/src/__test__/mocks/zod.validator.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json',
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default config;
