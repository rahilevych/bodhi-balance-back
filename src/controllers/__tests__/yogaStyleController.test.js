import * as yogaStyleService from '../../services/yogaStyleService.js';
import { getAllStyles } from '../yogaStyleController.js';

describe('trainerController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('returns all styles with status 200', async () => {
    const mockStyles = [{ id: 'style1' }, { id: 'style2' }];
    jest.spyOn(yogaStyleService, 'getAllStyles').mockResolvedValue(mockStyles);

    await getAllStyles(req, res, next);

    expect(yogaStyleService.getAllStyles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStyles);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next with error if service throws', async () => {
    const error = new Error('err');
    jest.spyOn(yogaStyleService, 'getAllStyles').mockRejectedValue(error);

    await getAllStyles(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
