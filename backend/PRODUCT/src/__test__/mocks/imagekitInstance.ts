import { jest } from '@jest/globals';

export const uploadPicMock = jest.fn<() => Promise<{ url: string; fileId: string }>>();
export const deletePicMock = jest.fn<() => Promise<void> | void>();
