import Question from '../../models/Question.js';
import { getAllquestions } from '../questionService.js';

jest.mock('../../models/Question.js');
describe('questionService', () => {
  test('returns all questions from the database', async () => {
    const mockQuestions = [
      {
        question: 'What styles of yoga do you offer?',
        answer: 'We offer Hatha, Vinyasa, and Ashtanga yoga classes.',
      },
      {
        question: 'Do I need prior experience to join the class?',
        answer:
          'No, our classes are suitable for all levels, including beginners.',
      },
    ];

    Question.find.mockResolvedValue(mockQuestions);

    const result = await getAllquestions();

    expect(Question.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockQuestions);
  });
});
