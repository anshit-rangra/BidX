export default function authMock(req: any, _res: any, next: () => void) {
  req.user = { _id: 'user-123' };
  next();
}
