import Plan from '../models/Plan.js';

export const getAllPlans = async () => {
  const plans = await Plan.find({});
  return plans;
};
export const getPlanById = async (id) => {
  const plan = await Plan.findById(id);
  if (!plan) {
    const error = new Error('There is no plan with such id');
    error.statusCode = 404;
    throw error;
  }
  return plan;
};
