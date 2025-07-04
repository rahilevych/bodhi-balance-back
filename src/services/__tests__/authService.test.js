import { registerUser, loginUser } from '../authService';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken.js';

jest.mock('../../models/User.js');
jest.mock('bcrypt');
jest.mock('../../utils/generateToken.js');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers new user', async () => {
    const mockUser = {
      name: 'User',
      email: 'test@gmail.com',
      password: 'hashedpass',
    };
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpass');
    User.create.mockResolvedValue(mockUser);
    const res = await registerUser({
      name: mockUser.name,
      email: mockUser.email,
      password: '12345',
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(bcrypt.hash).toHaveBeenCalledWith('12345', 12);
    expect(User.create).toHaveBeenCalledWith({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    });
    expect(res).toEqual({
      message: 'Registration successful',
      user: { user: mockUser },
    });
  });
  test('throws error if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@gmail.com' });
    await expect(
      registerUser({ name: 'Test', email: 'test@gmail.com', password: '123' })
    ).rejects.toThrow('User already exists');

    expect(User.create).not.toHaveBeenCalled();
  });
  test('logs in user with valid credentials', async () => {
    const mockUser = {
      _id: 'user123',
      name: 'User',
      email: 'test@gmail.com',
      password: 'hashedpass',
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    User.findOne.mockReturnValue(mockUser);
    mockUser.exec.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue('fake-jwt-token');

    const result = await loginUser({
      email: mockUser.email,
      password: '123456',
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedpass');
    expect(generateToken).toHaveBeenCalledWith('user123');
    expect(result).toEqual({
      message: 'Login successful',
      user: mockUser,
      token: 'fake-jwt-token',
    });
  });

  test(' throws error for invalid email', async () => {
    User.findOne.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      loginUser({ email: 'wrong@mail.com', password: '123456' })
    ).rejects.toThrow('Invalid credentials');
  });

  test('throws error for incorrect password', async () => {
    const mockUser = {
      password: 'hashedpass',
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ password: 'hashedpass' }),
    };

    User.findOne.mockReturnValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({ email: 'test@gmail.com', password: 'wrongpass' })
    ).rejects.toThrow('Invalid credentials');
  });
});
