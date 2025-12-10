import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate({
        path: 'bookings',
        populate: { path: 'training', model: 'Training' },
      })
      .populate('subscription')
      .exec();

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
