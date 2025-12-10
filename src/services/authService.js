import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../error/ApiError.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: '10m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: '48h',
  });
  return { accessToken, refreshToken };
};
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  const { accessToken, refreshToken } = generateTokens(user._id);
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  return {
    message: 'Registration successful',
    user,
    accessToken,
    refreshToken,
  };
};
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .populate({
      path: 'bookings',
      populate: {
        path: 'training',
        model: 'Training',
      },
    })
    .populate('subscription')
    .exec();
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  const { accessToken, refreshToken } = generateTokens(user._id);
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  return {
    message: 'Login successful',
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw new ApiError('No refresh token provided', 400);

  const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
  if (!storedToken) throw new ApiError('Invalid refresh token', 401);
  let decodedRefresh;
  try {
    decodedRefresh = jwt.verify(
      oldRefreshToken,
      process.env.JWT_SECRET_REFRESH,
    );
  } catch (error) {
    await RefreshToken.deleteOne({ token: oldRefreshToken });
    throw new ApiError('Expired refresh token', 401);
  }
  const { accessToken, refreshToken } = generateTokens(decodedRefresh.userId);

  await RefreshToken.deleteOne({ token: oldRefreshToken });
  await RefreshToken.create({
    token: refreshToken,
    userId: decodedRefresh.userId,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });
  return { accessToken, refreshToken, userId: decodedRefresh.userId };
};
