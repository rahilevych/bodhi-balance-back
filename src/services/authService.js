import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User already exist');
    err.statusCode = 400;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  return { message: 'Registration successful', user: { user } };
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
    .exec();
  console.log(user);
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
  return {
    message: 'Login successful',
    user: {
      user,
    },
    token: generateToken(user._id),
  };
};
