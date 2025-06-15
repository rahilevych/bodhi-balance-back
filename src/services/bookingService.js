import Booking from '../models/Booking.js';
import Training from '../models/Training.js';
import User from '../models/User.js';
import * as stripeService from './stripeService.js';

export const bookTraining = async (userId, trainingId) => {
  const user = await User.findById(userId);
  const training = await Training.findById(trainingId);

  if (!user || !training) throw new Error('User or training not found');

  const checkTraining = isTrainingAvailiable(training);
  const checkUser = canBookTraining(user);

  if (!checkTraining.allowed) {
    throw new Error('All spots are taken');
  }

  if (!checkUser.allowed) {
    if (checkUser.reason === 'need_payment') {
      const session = await stripeService.createStripeSession(
        training.priceId,
        userId,
        trainingId
      );
      return { url: session.url };
    } else {
      throw new Error('Cannot book training');
    }
  }
  const booking = await createBooking(user, training);
  return { booking };
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
  if (user.subscription?.type === 'pack') {
    user.subscription.remainingTrainings -= 1;
  }
  await user.save();
  return booking;
};
const isTrainingAvailiable = (training) => {
  const spotsTaken = training.spots_taken;
  const spotsTotal = training.spots_total;
  if (spotsTaken >= spotsTotal) {
    return { allowed: false, reason: 'all spots are taken' };
  }
  return { allowed: true };
};
const canBookTraining = (user) => {
  const now = new Date();
  if (!user.subscription) {
    return { allowed: false, reason: 'need_payment' };
  }
  if (user.subscription.type === 'unlimited') {
    if (user.subscription.validUntil > now) {
      return { allowed: true };
    } else {
      return { allowed: false, reason: 'need_payment' };
    }
  }
  if (user.subscription.type === 'pack') {
    if (user.subscription.remainingTrainings > 0) {
      return { allowed: true };
    } else {
      return { allowed: false, reason: 'need_payment' };
    }
  }
  return { allowed: false };
};
