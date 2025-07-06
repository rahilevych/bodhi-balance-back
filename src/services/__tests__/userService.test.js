import User from '../../models/User.js';
import { deleteUser, updateUser } from '../userService.js';
jest.mock('../../models/User.js');
const mockUser = {
  id: '123',
  name: 'Anna Becker',
  email: 'anna@example.com',
  password: 'hashedpass1',
  role: 'user',
  address: 'Berlin, Germany',
  phone: '+49 1235478',
  subscription: null,
  bookings: [],
};
describe('userService', () => {
  test('updates user if found', async () => {
    User.findByIdAndUpdate.mockResolvedValue(mockUser);
    const result = await updateUser(mockUser.id, mockUser);
    expect(result).toEqual(mockUser);
  });
  test('throws an err if user not found', async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);

    await expect(updateUser(mockUser.id, mockUser)).rejects.toThrow(
      'User with ID 123 not found'
    );
  });
  test('deletes user and returns a message', async () => {
    User.findByIdAndDelete.mockResolvedValue(mockUser);
    const result = await deleteUser(mockUser.id);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual({ message: 'User deleted successfully!' });
  });
  test('throws an err if user not found', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    await expect(deleteUser(mockUser.id)).rejects.toThrow('User not found');
  });
});
