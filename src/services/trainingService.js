import Training from '../models/Training.js';

export const getTrainingForDate = async (date) => {
  const day = new Date(date);
  const year = day.getUTCFullYear();
  const month = day.getUTCMonth();
  const dayOfMonth = day.getUTCDate();

  const start = new Date(Date.UTC(year, month, dayOfMonth, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, dayOfMonth, 23, 59, 59, 999));

  const trainings = await Training.find({
    datetime: { $gte: start.toISOString(), $lte: end.toISOString() },
  })
    .populate('trainer_id', 'fullName')
    .populate('yogaStyle_id', 'title duration');
  return trainings;
};

export const getTraining = async (id) => {
  const training = await Training.findById(id)
    .populate('trainer_id')
    .populate('yogaStyle_id');
  if (!training) {
    const error = new Error('There is no training with such id');
    error.statusCode = 404;
    throw error;
  }
  return training;
};
