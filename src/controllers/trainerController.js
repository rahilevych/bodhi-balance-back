import * as trainerService from '../services/trainerService.js';

export const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await trainerService.getAllTrainers();
    res.status(200).json(trainers);
  } catch (error) {
    next(error);
  }
};
