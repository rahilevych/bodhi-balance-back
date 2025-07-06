import {
  login,
  logoutUser,
  register,
} from '../../controllers/authController.js';
import * as authService from '../../services/authService.js';

describe('register', () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: { username: 'test', password: '1234' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  test('calls authService.registerUser and respond with 201 and data', async () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    };
    const mockData = { message: 'Registration successful', user: { mockUser } };
    jest.spyOn(authService, 'registerUser').mockResolvedValue(mockData);

    await register(req, res, next);

    expect(authService.registerUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(next).not.toHaveBeenCalled();
  });
  test('calls next with error when service throws', async () => {
    const error = new Error('err');
    jest.spyOn(authService, 'registerUser').mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
describe('loginUser', () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: { username: 'user', password: '1111' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });
  test('calls authService.loginUser and give cookie with token and user', async () => {
    const mockToken = 'token';
    const mockUser = { id: '123', username: 'user', password: '123' };

    jest.spyOn(authService, 'loginUser').mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });
    await login(req, res, next);
    expect(authService.loginUser).toHaveBeenCalledWith(req.body);
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      mockToken,
      expect.any(Object)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(next).not.toHaveBeenCalled();
  });
  test('calls next with error when service throws', async () => {
    const error = new Error('err');
    jest.spyOn(authService, 'loginUser').mockRejectedValue(error);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
describe('logoutUser', () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  test('clears cookie and respond with success message', () => {
    logoutUser(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged out successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });
  test('calls next with error if exception thrown', () => {
    const error = new Error('err');
    res.clearCookie.mockImplementation(() => {
      throw error;
    });

    logoutUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
