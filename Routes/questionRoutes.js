import express from "express";
import {
   uploadQuestions,
   getAllQuestionsForAdmin,
   getGroupedQuestions,
   getMyExams,
   getQuestionsForGraduate,
   deleteQuestion,
 } from "../Controllers/questionController.js";

import upload from "../Middelwares/uploadQuizFileMiddelware.js";
import { protect, allowOnly } from "../Services/authService.js";
const questionRouter = express.Router();

questionRouter.post(
  "/upload/:quizId",
  protect,
  allowOnly("admin"),
  upload.single("file"),
  uploadQuestions,
);

questionRouter.get(
  "/questions-admin",
  protect,
  allowOnly("admin"),
  getAllQuestionsForAdmin,
);

questionRouter.get(
  "/grouped-questions",
  protect,
  allowOnly("admin"),
  getGroupedQuestions,
);

questionRouter.get("/my-exams", protect, allowOnly("graduate"), getMyExams);

questionRouter.get(
   "/questions-graduate/:quizId",
   protect,
   allowOnly("graduate"),
   getQuestionsForGraduate,
 );

questionRouter.delete(
   "/:questionId",
   protect,
   allowOnly("admin"),
   deleteQuestion,
 );

export default questionRouter;
