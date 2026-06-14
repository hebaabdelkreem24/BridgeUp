import express from "express";
import {
  createQuiz,
  getAllQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../Controllers/quizController.js";

const quizRouter = express.Router();

// Create Quiz (IQ - English - Technical)
quizRouter.post("/", createQuiz);

// Get all quizzes
quizRouter.get("/", getAllQuiz);

// Get quiz by id
quizRouter
  .route("/:quizId")
  .get(getQuizById)
  .put(updateQuiz)
  .delete(deleteQuiz);

export default quizRouter;
