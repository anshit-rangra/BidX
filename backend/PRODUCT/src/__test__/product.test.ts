import { jest } from '@jest/globals';
import request from 'supertest';
import {
  basePath,
  deletePicMock,
  getApp,
  makeAuthHeader,
  mockProductModel,
  resetAllMocks,
  setCreateResult,
  setFindOneResult,
  setFindResultWithChain,
  setMockFiles,
  uploadPicMock,
} from './test-utils.js';

let app: any;
const authHeader = makeAuthHeader();

beforeAll(async () => {
  app = await getApp();
});

describe('GET /api/product/get', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('returns paginated products', async () => {
    const products = [
      { _id: 'p1', title: 'Item 1' },
      { _id: 'p2', title: 'Item 2' },
    ];

    const { skipMock } = setFindResultWithChain(products);

    const res = await request(app)
      .get(`${basePath}/get`)
      .set('Authorization', authHeader)
      .query({ page: 2, limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/fetched sucessfully/i);
    expect(res.body.products).toEqual(products);
    expect(skipMock).toHaveBeenCalledWith(5); // (page - 1) * limit
  });

  test('responds 404 when no products', async () => {
    setFindResultWithChain(null);

    const res = await request(app)
      .get(`${basePath}/get`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/no products/i);
  });

  test('handles database errors', async () => {
    mockProductModel.find.mockImplementation(() => {
      throw new Error('db down');
    });

    const res = await request(app)
      .get(`${basePath}/get`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/internal server error/i);
  });
});

describe('POST /api/product/post', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('rejects when files are missing', async () => {
    setMockFiles(undefined);

    const res = await request(app)
      .post(`${basePath}/post`)
      .set('Authorization', authHeader)
      .send({ title: 'Item', description: 'Nice item', basePrice: 100 });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/upload images/i);
  });

  test('creates product with uploaded images', async () => {
    uploadPicMock.mockResolvedValue({ url: 'https://img.test/item.jpg', fileId: 'file-1' });
    setMockFiles([
      {
        fieldname: 'images',
        originalname: 'item.jpg',
        filename: 'item.jpg',
        path: '/tmp/item.jpg',
      },
    ]);

    const newProduct = {
      _id: 'prod-123',
      title: 'Item',
      description: 'Nice item',
      images: [{ url: 'https://img.test/item.jpg', id: 'file-1' }],
      basePrice: 100,
      currentPrice: 100,
      creator: 'user-123',
    };

    setCreateResult(newProduct);

    const res = await request(app)
      .post(`${basePath}/post`)
      .set('Authorization', authHeader)
      .send({ title: 'Item', description: 'Nice item', basePrice: 100 });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/created sucessfully/i);
    expect(res.body.product).toMatchObject({ _id: 'prod-123', title: 'Item' });
    expect(uploadPicMock).toHaveBeenCalled();
    expect(mockProductModel.create).toHaveBeenCalledWith({
      title: 'Item',
      description: 'Nice item',
      images: [{ url: 'https://img.test/item.jpg', id: 'file-1' }],
      currentPrice: 100,
      basePrice: 100,
      creator: 'user-123',
    });
  });

  test('returns 500 when upload fails', async () => {
    uploadPicMock.mockRejectedValue(new Error('upload failed'));
    setMockFiles([
      {
        fieldname: 'images',
        originalname: 'item.jpg',
        filename: 'item.jpg',
        path: '/tmp/item.jpg',
      },
    ]);

    const res = await request(app)
      .post(`${basePath}/post`)
      .set('Authorization', authHeader)
      .send({ title: 'Item', description: 'Nice item', basePrice: 100 });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/unable to upload images/i);
  });
});

describe('DELETE /api/product/delete/:id', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  test('rejects when product not owned', async () => {
    setFindOneResult(null);

    const res = await request(app)
      .delete(`${basePath}/delete/prod-999`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/can not delete/i);
  });

  test('deletes owned product and images', async () => {
    const deleteOneMock = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    setFindOneResult({
      _id: 'prod-1',
      creator: 'user-123',
      images: [{ id: 'img-1' }, { id: 'img-2' }],
      deleteOne: deleteOneMock,
    });

    const res = await request(app)
      .delete(`${basePath}/delete/prod-1`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted sucessfully/i);
    expect(deletePicMock).toHaveBeenCalledTimes(2);
    expect(deleteOneMock).toHaveBeenCalled();
  });

  test('handles delete errors', async () => {
    mockProductModel.findOne.mockImplementation(() => {
      throw new Error('db error');
    });

    const res = await request(app)
      .delete(`${basePath}/delete/prod-1`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/internal server error/i);
  });
});
