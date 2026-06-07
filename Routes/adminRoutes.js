import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import {
  getStats,
  getAllGraduates,
  getCompaniesDashboardController,
  getAllGraduatesWithFilters,
} from "../Controllers/adminController.js";

const adminRouter = express.Router();

// Get platform statistics (Admin only)
adminRouter.get("/stats", protect, allowOnly("Admin"), getStats);
// Get all graduates with scores + pagination (Admin only)
adminRouter.get("/graduates", protect, allowOnly("Admin"), getAllGraduates);
// Get companies dashboard data (Admin only)
adminRouter.get(
  "/companies-dashboard",
  protect,
  allowOnly("Admin"),
  getCompaniesDashboardController,
);
// Get all graduates with filters + pagination (Admin only)
adminRouter.get(
  "/all-graduates",
  protect,
  allowOnly("Admin"),
  getAllGraduatesWithFilters,
);

export default adminRouter;
