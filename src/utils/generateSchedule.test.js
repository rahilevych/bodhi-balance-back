import { beforeEach, jest } from '@jest/globals';
import { generateWeeklySchedule } from './generateSchedule.js';
import Training from '../models/Training.js';
import ScheduleTemplate from '../models/ScheduleTemplate.js';

jest.mock('../models/Training.js');
jest.mock('../models/ScheduleTemplate.js');
const scheduleTemlateMock = [
  {
    time: '10:30',
    spots_total: 20,
    trainer_id: 'trainer1',
    yogaStyle_id: 'style1',
    price: 15,
    priceId: 'price1',
    duration: 60,
  },
];

describe('generateWeeklySchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('creates trainings for 7 days if there are no trainings for those days', async () => {
    ScheduleTemplate.find.mockResolvedValue(scheduleTemlateMock);
    Training.find.mockResolvedValue([]);
    await generateWeeklySchedule();
    expect(ScheduleTemplate.find).toHaveBeenCalledTimes(7);
    expect(Training.find).toHaveBeenCalledTimes(7);
    expect(Training.create).toHaveBeenCalledTimes(7);
    const arg = Training.create.mock.calls[0][0];
    expect(arg).toHaveProperty('datetime');
    expect(arg.spots_total).toBe(20);
    expect(arg.trainer_id).toBe(scheduleTemlateMock[0].trainer_id);
    expect(arg.yogaStyle_id).toBe(scheduleTemlateMock[0].yogaStyle_id);
    expect(arg.price).toBe(scheduleTemlateMock[0].price);
    expect(arg.priceId).toBe(scheduleTemlateMock[0].priceId);
    expect(arg.duration).toBe(scheduleTemlateMock[0].duration);
  });
  test('skips days if trainig already exists', async () => {
    ScheduleTemplate.find.mockResolvedValue(scheduleTemlateMock);
    Training.find.mockResolvedValue([{ datetime: new Date() }]);
    await generateWeeklySchedule();
    expect(Training.create).not.toHaveBeenCalled();
  });
  test('doesnt create training if there is no template for a day', async () => {
    ScheduleTemplate.find.mockResolvedValue([]);
    Training.find.mockResolvedValue([]);
    await generateWeeklySchedule();
    expect(Training.create).not.toHaveBeenCalled();
  });
  test('handles error', async () => {
    const err = new Error('DB err');
    ScheduleTemplate.find.mockRejectedValue(err);

    await generateWeeklySchedule();
    expect(console.error).toHaveBeenCalledWith(
      'Error generating schedule:',
      err
    );
  });
});
