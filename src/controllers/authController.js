import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    console.log('token', token);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      path: '/',
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const logoutUser = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
