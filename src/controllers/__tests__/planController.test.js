import * as planService from '../../services/planService.js';
import { getAllPlans, getPlanById } from '../planController.js';

describe('planService', () => {
  let res, req, next;
  beforeEach(() => {
    req = {
      params: {},
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('returns all plans with status 200', async () => {
    const mockPlans = [
      { id: 'id1', name: 'Pack' },
      { id: 'id2', name: 'Unlimited' },
    ];
    jest.spyOn(planService, 'getAllPlans').mockResolvedValue(mockPlans);

    await getAllPlans(req, res, next);

    expect(planService.getAllPlans).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPlans);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next with error if service throws', async () => {
    const error = new Error('Failed to fetch plans');
    jest.spyOn(planService, 'getAllPlans').mockRejectedValue(error);

    await getAllPlans(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
  test('returns plan by id with status 200', async () => {
    const mockPlan = { id: 'id1', name: 'Unlimeted' };
    req.params.id = '123';
    jest.spyOn(planService, 'getPlanById').mockResolvedValue(mockPlan);

    await getPlanById(req, res, next);

    expect(planService.getPlanById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPlan);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next with error if service throws', async () => {
    const error = new Error('Plan not found');
    req.params.id = '123';
    jest.spyOn(planService, 'getPlanById').mockRejectedValue(error);

    await getPlanById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
