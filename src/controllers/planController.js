import * as planService from '../services/planService.js';

export const getAllPlans = async (req, res, next) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};
