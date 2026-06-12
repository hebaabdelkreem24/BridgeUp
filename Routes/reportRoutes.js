import express from "express";
import {
  getTrackDistribution,
  getAverageScores,
  getCompletionRate,
  getMostActiveCompanies,
  getOverview,
} from "../Controllers/reportController.js";
import { protect, allowOnly } from "../Services/authService.js";

const reportRouter = express.Router();

reportRouter.use(protect, allowOnly("admin"));

reportRouter.get("/track-distribution", getTrackDistribution);
reportRouter.get("/average-scores", getAverageScores);
reportRouter.get("/completion-rate", getCompletionRate);
reportRouter.get("/most-active-companies", getMostActiveCompanies);
reportRouter.get("/overview", getOverview);

export default reportRouter;
