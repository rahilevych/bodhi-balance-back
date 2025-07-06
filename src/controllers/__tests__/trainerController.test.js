import * as trainerService from '../../services/trainerService.js';
import { getAllTrainers } from '../trainerController';

describe('trainerController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('returns all trainers with status 200', async () => {
    const mockTrainers = [{ id: 'trainer1' }, { id: 'trainer2' }];
    jest
      .spyOn(trainerService, 'getAllTrainers')
      .mockResolvedValue(mockTrainers);

    await getAllTrainers(req, res, next);

    expect(trainerService.getAllTrainers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTrainers);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next with error if service throws', async () => {
    const error = new Error('err');
    jest.spyOn(trainerService, 'getAllTrainers').mockRejectedValue(error);

    await getAllTrainers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
