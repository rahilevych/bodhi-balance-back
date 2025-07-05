import YogaStyle from '../../models/YogaStyle.js';

import { getAllStyles } from '../yogaStyleService.js';

jest.mock('../../models/YogaStyle.js');
describe('yogaStyleService', () => {
  test('returns all styles from the database', async () => {
    const mockYogaStyles = [
      {
        _id: '1',
        title: 'Hatha Yoga',
        image: 'https://example.com/images/hatha.jpg',
        duration: 60,
        description: 'A gentle introduction to basic yoga postures.',
        trainer: 'Alice Johnson',
      },
      {
        _id: '2',
        title: 'Vinyasa Flow',
        image: 'https://example.com/images/vinyasa.jpg',
        duration: 75,
        description: 'A dynamic flow linking breath with movement.',
        trainer: 'Mark Smith',
      },
    ];

    YogaStyle.find.mockResolvedValue(mockYogaStyles);

    const result = await getAllStyles();

    expect(YogaStyle.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockYogaStyles);
  });
});
