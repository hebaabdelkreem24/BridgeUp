import ApiError from "../utils/apiError.js";
import Quiz from "../Models/quizModel.js";
import Question from "../Models/questionsModel.js";

export const createQuizService = async (data) => {
  return await Quiz.create(data);
};

export const getAllQuizService = async () => {
  return await Quiz.find();
};

export const getQuizByIdService = async (id) => {
  return await Question.find({ quiz: quizId }).select("-answers.isCorrect");
};
