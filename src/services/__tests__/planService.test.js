import Plan from '../../models/Plan.js';
import { getAllPlans, getPlanById } from '../planService.js';
jest.mock('../../models/Plan.js');
describe('planService', () => {
  test('returns all plans from the database', async () => {
    const mockPlans = [
      {
        _id: '1',
        type: 'pack',
        title: '5 Trainings',
        price: 50,
        priceId: 'price_123',
        description: 'Pack of 5 trainings',
        trainingsCount: 5,
      },
      {
        _id: '2',
        type: 'unlimited',
        title: 'Monthly Unlimited',
        price: 100,
        priceId: 'price_456',
        description: 'Unlimited access for 1 month',
        durationInMonths: 1,
      },
    ];

    Plan.find.mockResolvedValue(mockPlans);

    const result = await getAllPlans();

    expect(Plan.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockPlans);
  });
  test('returns plan by id', async () => {
    const mockPlan = {
      _id: '1',
      type: 'pack',
      title: '5 Trainings',
      price: 50,
      priceId: 'price_123',
      description: 'Pack of 5 trainings',
      trainingsCount: 5,
    };
    Plan.findById.mockResolvedValue(mockPlan);
    const result = await getPlanById(mockPlan._id);
    expect(result).toEqual(mockPlan);
  });
  test('returns err if there is no plan with such id', async () => {
    Plan.findById.mockResolvedValue(null);

    await expect(getPlanById('id')).rejects.toThrow(
      'There is no plan with such id'
    );
  });
});
