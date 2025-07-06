import { getAllPlans } from '../../services/planService';
import * as questionService from '../../services/questionService.js';
import { getAllquestions } from '../questionController.js';

describe('questionController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('returns all questions with status 200', async () => {
    const mockQuestions = [
      { id: 'id1', question: 'question1', answer: 'answer1' },
      { id: 'id2', question: 'question2', answer: 'answer2' },
    ];
    jest
      .spyOn(questionService, 'getAllquestions')
      .mockResolvedValue(mockQuestions);

    await getAllquestions(req, res, next);

    expect(questionService.getAllquestions).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockQuestions);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next with error if service throws', async () => {
    const error = new Error('Failed to fetch plans');
    jest.spyOn(questionService, 'getAllquestions').mockRejectedValue(error);

    await getAllquestions(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
