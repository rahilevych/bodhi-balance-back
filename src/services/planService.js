import Plan from '../models/Plan.js';

export const getAllPlans = async () => {
  const plans = await Plan.find({});
  return plans;
};
