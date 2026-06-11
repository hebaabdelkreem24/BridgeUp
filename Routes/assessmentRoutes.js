import express from "express";
import { protect, allowOnly } from "../Services/authService.js";
import {
  updateAssessment,
  getAssessment,
} from "../Controllers/assessmentController.js";

const assessmentRouter = express.Router();

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