import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return user;
};
export const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return { message: 'User deleted successfully!' };
};
