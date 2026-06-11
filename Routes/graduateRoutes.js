import express from "express";
import { getAssessmentMe } from "../Controllers/graduateController.js";
import { protect, allowOnly } from "../Services/authService.js";

const graduateRouter = express.Router();

graduateRouter.get("/assessments/me", protect, getAssessmentMe);

export default graduateRouter;
