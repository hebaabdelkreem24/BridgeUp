import express from "express";
import {
  getAssessmentMe,
  getMyProfile,
  updateMyProfile,
  updateDocumentsAndLinks,
  getMyRoadmap,
  getCompanyDetailsForGraduate,
} from "../Controllers/graduateController.js";
import { protect, allowOnly } from "../Services/authService.js";
import { uploadProfileImage , uploadSingleFile } from "../Middelwares/uploadMiddelware.js";

const graduateRouter = express.Router();

graduateRouter.get(
  "/assessments/me",
  protect,
  // allowOnly("graduate"),
  getAssessmentMe,
);
graduateRouter.get("/me", protect, allowOnly("graduate"), getMyProfile);
graduateRouter.put(
  "/me",
  protect,
  allowOnly("graduate"),
  uploadProfileImage,
  updateMyProfile,
);
graduateRouter.put(
  "/me/documents",
  protect,
  allowOnly("graduate"),
  uploadSingleFile,
  updateDocumentsAndLinks,
);
graduateRouter.get("/company/:companyId", protect, allowOnly("graduate"), getCompanyDetailsForGraduate);
graduateRouter.get("/me/roadmap", protect, allowOnly("graduate"), getMyRoadmap);
export default graduateRouter;
