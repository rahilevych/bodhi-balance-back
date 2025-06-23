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

export const deleteUser = async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  try {
    const result = await userService.deleteUser(userId);
    return res.status(200).json(result.message);
  } catch (error) {
    next(error);
  }
};
