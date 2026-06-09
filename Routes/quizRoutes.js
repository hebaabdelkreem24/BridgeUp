import express from "express";
import {
    createQuiz,
    getAllQuiz,
  getQuizById
} from "../Controllers/quizController.js";


const quizRouter = express.Router();

// Create Quiz (IQ - English - Technical)
quizRouter.post("/", createQuiz);

// Get all quizzes
quizRouter.get("/", getAllQuiz);

// Get quiz by id
quizRouter.get("/:id", getQuizById);

export default quizRouter;
