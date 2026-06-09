import express from "express";
import {
  uploadQuestions,
} from "../Controllers/questionController.js";

import upload from "../Middelwares/uploadQuizFileMiddelware.js";

const questionRouter = express.Router();

questionRouter.post(
  "/upload/:quizId",
  upload.single("file"),
  uploadQuestions
);

export default questionRouter;
