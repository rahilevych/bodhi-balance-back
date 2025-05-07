import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
