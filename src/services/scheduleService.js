import Schedule from '../models/Schedule.js';

export const getTrainingForDate = async (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const trainings = await Schedule.find({
    date: { $gte: start, $lte: end },
  });

  return trainings;
};
