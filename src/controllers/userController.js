import * as userService from '../services/userService.js';
export const updateUser = async (req, res, next) => {
  const { data } = req.body;
  try {
    const updatedUser = await userService.updateUser(req.params.id, data);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
