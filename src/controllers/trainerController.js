import * as trainerService from '../services/trainerService.js';

export const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await trainerService.getAllTrainers();
    console.log(trainers);
    res.status(200).json(trainers);
  } catch (error) {
    next(error);
  }
};
