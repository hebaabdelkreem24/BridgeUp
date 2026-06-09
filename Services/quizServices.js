import ApiError from "../utils/ApiError.js";
import Quiz from "../Models/quizModel.js";

export const createQuizService = async (data) => {
  return await Quiz.create(data);
};

export const getAllQuizService = async () => {
  return await Quiz.find();
};

export const getQuizByIdService = async (id) => {
  return await Quiz.findById(id);
};
