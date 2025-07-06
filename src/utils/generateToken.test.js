import jwt from 'jsonwebtoken';
import generateToken from './generateToken';

jest.mock('jsonwebtoken');
describe('generateToken', () => {
  test('generates correctly token', () => {
    const fakeToken = 'fakeToken';
    jwt.sign.mockReturnValue(fakeToken);
    process.env.JWT_SECRET = 'mysecretkey';
    const userId = 'userId';
    const token = generateToken(userId);
    expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, 'mysecretkey', {
      expiresIn: '24h',
    });
    expect(token).toBe(fakeToken);
  });
});
