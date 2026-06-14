import asyncHandler from "express-async-handler";

import {
  createQuizService,
  getAllQuizService,
  getQuizByIdService,
  updateQuizService,
  deleteQuizService,
} from "../Services/quizServices.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await createQuizService(req.body);

    res.status(201).json({
      status: "success",
      data: quiz,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getAllQuiz = async (req, res) => {
  try {
    const quiz = await getAllQuizService();

    res.status(200).json({
      status: "success",
      results: quiz.length,
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await getQuizByIdService(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        status: "fail",
        message: "Exam not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await updateQuizService(req.params.quizId, req.body);

    if (!quiz) {
      return res.status(404).json({
        status: "fail",
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await deleteQuizService(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        status: "fail",
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
