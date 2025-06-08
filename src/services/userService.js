import User from '../models/User.js';

export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return user;
};
