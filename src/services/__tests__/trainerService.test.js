import Trainer from '../../models/Trainer';
import { getAllTrainers } from '../trainerService';

jest.mock('../../models/Trainer.js');
describe('trainerService', () => {
  test('returns all trainers from the database', async () => {
    const mockTrainers = [
      {
        _id: '1',
        fullName: 'Emily Carter',
        experience: 5,
        specialization: 'Hatha, Vinyasa',
        about:
          'Emily brings mindfulness and alignment into every class she teaches.',
        photo: 'https://example.com/images/emily.jpg',
      },
      {
        _id: '2',
        fullName: 'David Kim',
        experience: 8,
        specialization: 'Ashtanga, Power Yoga',
        about:
          'David focuses on strength and breath connection in his powerful sessions.',
        photo: 'https://example.com/images/david.jpg',
      },
    ];

    Trainer.find.mockResolvedValue(mockTrainers);

    const result = await getAllTrainers();

    expect(Trainer.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockTrainers);
  });
});
