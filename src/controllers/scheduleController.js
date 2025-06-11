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

export const getTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const training = await scheduleService.getTraining(id);
    res.status(200).json(training);
  } catch (error) {
    next(error);
  }
};
