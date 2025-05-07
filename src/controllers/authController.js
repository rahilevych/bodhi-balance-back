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
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
