import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import { submitExam } from "../Controllers/examController.js";

const examRouter = express.Router();

examRouter.post("/:quizId/submit", protect, allowOnly("graduate"), submitExam);

export default examRouter;
