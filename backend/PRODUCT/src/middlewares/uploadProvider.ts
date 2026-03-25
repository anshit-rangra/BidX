import upload from './multer.middleware.ts';
import type { Request, Response, NextFunction } from 'express';

let uploadMiddleware = upload.array('images', 5);

export function setUploadMiddleware(middleware: (req: Request, res: Response, next: NextFunction) => void) {
  uploadMiddleware = middleware;
}

export function getUploadMiddleware() {
  return uploadMiddleware;
}
