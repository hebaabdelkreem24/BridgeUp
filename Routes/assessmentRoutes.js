import express from "express";
import { protect, allowOnly } from "../Services/authService.js";
import {
  updateAssessment,
  getAssessment,
  startExam,
  submitExam,
  getMyAttempts,
} from "../Controllers/assessmentController.js";

import { verifySEB } from "../Middelwares/sebVerifyMiddelware.js";

const assessmentRouter = express.Router();

assessmentRouter.get(
  "/start",
  protect,
  allowOnly("graduate"),
  verifySEB,
  startExam
);

assessmentRouter.post(
  "/submit",
  protect,
  allowOnly("graduate"),
  verifySEB,
  submitExam
);

assessmentRouter.get(
  "/my-attempts",
  protect,
  allowOnly("graduate"),
  getMyAttempts
);

assessmentRouter.put(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  updateAssessment
);

assessmentRouter.get(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  getAssessment
);

export default assessmentRouter;