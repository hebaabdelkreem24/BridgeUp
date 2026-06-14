import ApiError from "../utils/apiError.js";
import Quiz from "../Models/quizModel.js";
import Question from "../Models/questionsModel.js";

export const createQuizService = async (data) => {
  return await Quiz.create(data);
};

export const getAllQuizService = async () => {
  return await Quiz.find();
};

export const getQuizByIdService = async (quizId) => {
  return await Question.find({ quiz: quizId }).select("-answers.isCorrect");
};

export const updateQuizService = async (quizId, data) => {
  return await Quiz.findByIdAndUpdate(
    quizId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteQuizService = async (quizId) => {
  return await Quiz.findByIdAndDelete(quizId);
};