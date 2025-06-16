import * as planService from '../services/planService.js';

export const getAllPlans = async (req, res, next) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};
export const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await planService.getPlanById(id);
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};
