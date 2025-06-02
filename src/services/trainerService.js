import Trainer from '../models/Trainer.js';

export const getAllTrainers = async () => {
  const trainers = await Trainer.find({});
  return trainers;
};
