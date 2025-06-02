import Question from '../models/Question.js';

export const getAllquestions = async () => {
  const questions = await Question.find({});
  return questions;
};
