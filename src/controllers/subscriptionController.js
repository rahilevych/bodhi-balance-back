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

    return res.status(201).json({
      message: result.message,
      subscription: result.message,
    });
  } catch (error) {
    next(error);
  }
};
