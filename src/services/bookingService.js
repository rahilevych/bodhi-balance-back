import Booking from '../models/Booking.js';
import Subscription from '../models/Subscription.js';
import Training from '../models/Training.js';
import User from '../models/User.js';
import * as stripeService from './stripeService.js';

export const bookTraining = async (userId, trainingId, type) => {
  const user = await User.findById(userId);
  const training = await Training.findById(trainingId);

  if (!user || !training) throw new Error('User or training not found');
  const alreadyBooked = await Booking.exists({
    user: userId,
    training: trainingId,
    status: 'booked',
  });

  if (alreadyBooked) {
    return { message: 'You have already booked this training!' };
  }
  const checkTraining = isTrainingAvailiable(training);
  const checkUser = await canBookTraining(userId);

  if (!checkTraining.allowed) {
    return { message: checkTraining.reason };
  }

  if (!checkUser.allowed) {
    if (checkUser.reason === 'need_payment') {
      const session = await stripeService.createStripeSession(
        training.priceId,
        userId,
        trainingId,
        type
      );
      return { url: session.url };
    } else {
      return { message: 'Cannot book training!' };
    }
  } else {
    const booking = await createBooking(user, training);
    return { booking };
  }
};

export const createBooking = async (user, training) => {
  const booking = await Booking.create({
    user: user._id,
    training: training._id,
    status: 'booked',
  });

  training.spots_taken += 1;
  await training.save();
  user.bookings.push(booking._id);

  const subscription = await Subscription.findOne({
    user: user._id,
    status: 'active',
  });
  if (subscription) {
    const plan = await subscription.populate('type');
    if (plan.type.type === 'pack') {
      subscription.remainingTrainings -= 1;
      if (subscription.remainingTrainings <= 0) {
        subscription.status = 'expired';
      }
      await subscription.save();
    }
  }

  await user.save();
  return booking;
};

const isTrainingAvailiable = (training) => {
  const spotsTaken = training.spots_taken;
  const spotsTotal = training.spots_total;
  const now = new Date();
  if (spotsTaken >= spotsTotal) {
    return { allowed: false, reason: 'All spots are taken' };
  }
  if (new Date(training.datetime) < now) {
    return { allowed: false, reason: 'Booking closed' };
  }
  return { allowed: true };
};

export const canBookTraining = async (userId) => {
  const now = new Date();

  const subscription = await Subscription.findOne({
    user: userId,
    status: 'active',
    $or: [{ validUntil: { $gt: now } }, { remainingTrainings: { $gt: 0 } }],
  }).populate('type');

  if (!subscription) {
    return { allowed: false, reason: 'need_payment' };
  }

  const plan = await subscription.populate('type');

  if (plan.type.type === 'unlimited') {
    if (subscription.validUntil > now) {
      return { allowed: true };
    }
  }

  if (plan.type.type === 'pack') {
    if (subscription.remainingTrainings > 0) {
      return { allowed: true };
    }
  }

  return { allowed: false, reason: 'need_payment' };
};

export const getBookingsByUserId = async (userId) => {
  const bookings = await Booking.find({ user: userId }).populate({
    path: 'training',
    populate: {
      path: 'yogaStyle_id',
      model: 'Style',
    },
  });
  const now = new Date();

  for (const booking of bookings) {
    const trainingDate = new Date(booking.training?.datetime);

    if (trainingDate < now && booking.status === 'booked') {
      booking.status = 'completed';
      await booking.save();
    }
  }
  return bookings;
};
export const createBookingAfterPayment = async (userId, trainingId) => {
  const user = await User.findById(userId);
  const training = await Training.findById(trainingId);

  if (!user || !training) throw new Error('User or training not found');

  return await createBooking(user, training);
};
export const cancelBooking = async (userId, bookingId, trainingId) => {
  const user = await User.findById(userId);
  const booking = await Booking.findById(bookingId);
  const training = await Training.findById(trainingId);
  const now = new Date();
  if (!user || !booking) {
    throw new Error('User or booking not found');
  }
  if (!booking.user.equals(user._id)) {
    throw new Error('Unauthorized: This booking does not belong to the user');
  }
  const bookingDate = new Date(booking.datetime);
  const diffInHours = (bookingDate - now) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return {
      message:
        'You cannot cancel a booking less than 24 hours before the session',
    };
  }
  booking.status = 'cancelled';
  await booking.save();
  training.spots_taken -= 1;
  await training.save();
  return booking;
};
