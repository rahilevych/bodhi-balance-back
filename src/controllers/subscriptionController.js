import * as subscriptionService from '../services/subscriptionService.js';
export const buySubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, type } = req.body;
    const result = await subscriptionService.buySubscription(
      userId,
      productId,
      type
    );

    if (result?.url) {
      return res.status(200).json({ url: result.url });
    }
    if (result?.message) {
      return res.status(403).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};
export const getSubscriptionByUserId = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const subscription = await subscriptionService.getSubscriptionByUserId(
      userId
    );
    console.log(subscription);
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};
