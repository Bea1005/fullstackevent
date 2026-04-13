const { protect, authorize } = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');

describe('Auth Middleware Tests', () => {
  let req, res, next;

  // ✅ Suppress console.error for expected errors
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('protect middleware', () => {
    it('should call next() if valid token is provided', async () => {
      req.headers = { authorization: 'Bearer valid_token' };
      const decodedUser = { id: 'user123', role: 'admin' };
      jwt.verify.mockReturnValue(decodedUser);

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if no token is provided', async () => {
      req.headers = {};

      await protect(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe('Not authorized to access this route');
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers = { authorization: 'Bearer invalid_token' };
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe('Not authorized to access this route');
    });
  });

  describe('authorize middleware', () => {
    it('should call next() if user role is authorized', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin', 'coach');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 403 if user role is not authorized', () => {
      req.user = { role: 'student' };
      const middleware = authorize('admin', 'coach');

      middleware(req, res, next);

      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toContain('not authorized');
      expect(next).not.toHaveBeenCalled();
    });
  });
});