import * as scheduleService from '../services/scheduleService.js';

export const getAllTrainingsForDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const trainings = await scheduleService.getTrainingForDate(date);
    res.status(200).json(trainings);
  } catch (error) {
    next(error);
  }
};
