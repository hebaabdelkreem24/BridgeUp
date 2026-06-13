import express from "express";
import { protect, allowOnly } from "../Services/authService.js";
import {
  updateAssessment,
  getAssessment,
  startExam,
  submitExam,
} from "../Controllers/assessmentController.js";

import { verifySEB } from "../Middelwares/sebVerifyMiddelware.js";

const assessmentRouter = express.Router();
assessmentRouter.get(
  "/start",
  protect,
  allowOnly("graduate"),
  verifySEB,
  startExam,
);

assessmentRouter.post(
  "/submit",
  protect,
  allowOnly("graduate"),
  verifySEB,
  submitExam,
);

assessmentRouter.put(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  updateAssessment,
);

assessmentRouter.get(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  getAssessment,
);

export default assessmentRouter;
