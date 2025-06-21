import Plan from '../models/Plan.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import * as stripeService from './stripeService.js';

export const buySubscription = async (userId, planId, type) => {
  const user = await User.findById(userId);
  const plan = await Plan.findById(planId);

  if (!user) throw new Error('User not found');
  if (!plan) throw new Error('Plan not found');
  const isActive = await checkActiveSubsctibtion(user);

  if (isActive) {
    return { message: 'You have already active subscription' };
  }
  const session = await stripeService.createStripeSession(
    plan.priceId,
    userId,
    planId,
    type
  );
  return { url: session.url };
};

const checkActiveSubsctibtion = async (userId) => {
  const now = new Date();

  const activeSubscription = await Subscription.findOne({
    user: userId,
    status: 'active',
    $or: [{ validUntil: { $gt: now } }, { remainingTrainings: { $gt: 0 } }],
  });

  return !!activeSubscription;
};

export const createSubscriptionAfterPayment = async (userId, planId) => {
  const user = await User.findById(userId);
  const plan = await Plan.findById(planId);

  if (!user) throw new Error('User not found');
  if (!plan) throw new Error('Plan not found');

  const now = new Date();

  const subscriptionData = {
    user: user._id,
    type: plan._id,
    status: 'active',
  };

  switch (plan.type) {
    case 'unlimited':
      subscriptionData.validUntil = new Date(
        now.setMonth(now.getMonth() + plan.durationInMonths)
      );
      break;

    case 'pack':
      subscriptionData.remainingTrainings = plan.trainingsCount;
      break;

    default:
      throw new Error('Unknown plan type');
  }

  const subscription = await Subscription.create(subscriptionData);

  user.subscription = subscription._id;
  await user.save();

  return subscription;
};
export const getSubscriptionByUserId = async (userId) => {
  const subscription = await Subscription.findOne({
    user: userId,
    status: 'active',
  }).populate('type');
  return subscription;
};
