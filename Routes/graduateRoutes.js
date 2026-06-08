import express from "express";
import {
  getAssessmentMe,
  getMyProfile,
  updateMyProfile,
  updateDocumentsAndLinks,
} from "../Controllers/graduateController.js";
import { protect, allowOnly } from "../Services/authService.js";

const graduateRouter = express.Router();

graduateRouter.get(
  "/assessments/me",
  protect,
  allowOnly("graduate"),
  getAssessmentMe,
);
graduateRouter.get("/me", protect, allowOnly("graduate"), getMyProfile);
graduateRouter.put("/me", protect, allowOnly("graduate"), updateMyProfile);
graduateRouter.put(
  "/me/documents",
  protect,
  allowOnly("graduate"),
  updateDocumentsAndLinks,
);
export default graduateRouter;
