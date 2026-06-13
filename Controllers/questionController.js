import asyncHandler from "express-async-handler";
import {
  uploadQuestionsService,
  getAllQuestionsForAdminService,
  getGroupedQuestionsService,
  getMyExamsService,
  getQuestionsForStudentService,
} from "../Services/questionService.js";

export const uploadQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const count = await uploadQuestionsService(quizId, req.file.buffer);

    res.status(201).json({
      status: "success",
      message: `${count} questions imported successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllQuestionsForAdmin = asyncHandler(async (req, res) => {
  const questions = await getAllQuestionsForAdminService();

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: questions,
  });
});

export const getGroupedQuestions = asyncHandler(async (req, res) => {
  const data = await getGroupedQuestionsService();

  res.status(200).json({
    status: "success",
    data,
  });
});

export const getMyExams = asyncHandler(async (req, res) => {
  const userTrack = req.user.track;

  const quizzes = await getMyExamsService(userTrack);

  res.status(200).json({
    status: "success",
    results: quizzes.length,
    data: quizzes,
  });
});

export const getQuestionsForGraduate = asyncHandler(async (req, res) => {
  const quizId = req.params.quizId;

  const userId = req.user._id; 

  const questions = await getQuestionsForStudentService(quizId, userId);

  res.status(200).json({
    status: "success",
    data: questions,
  });
});