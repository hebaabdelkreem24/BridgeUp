import asyncHandler from "express-async-handler";
import { submitExamService } from "../Services/examServices.js"


export const submitExam = asyncHandler(async (req, res) => {
  const quizId = req.params.quizId;
  const studentId = req.user._id;
  const userAnswers = req.body.answers;

  const result = await submitExamService(
    quizId,
    studentId,
    userAnswers
  );

  res.status(200).json({
    status: "success",
    data: result,
  });
});