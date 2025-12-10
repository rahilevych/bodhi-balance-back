import RefreshToken from '../models/RefreshToken.js';
import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.registerUser(
      req.body,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 48 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'Registration successful',
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(
      req.body,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await RefreshToken.deleteOne({ token });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshTokensController = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const { refreshToken, accessToken, userId } =
      await authService.refreshTokens(oldRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 48 * 60 * 60 * 1000,
    });
    res.json({ accessToken, userId });
  } catch (error) {
    next(error);
  }
};
