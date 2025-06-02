import * as questionService from '../services/questionService.js';

export const getAllquestions = async (req, res, next) => {
  try {
    const questions = await questionService.getAllquestions();
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};
