import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import {
  getStats,
  getAllGraduates,
  getCompaniesDashboardController,
  getAllGraduatesWithFilters,
} from "../Controllers/AdminController.js";

const adminRouter = express.Router();

// Get platform statistics (Admin only)
adminRouter.get("/stats", protect, allowOnly("admin"), getStats);
// Get all graduates with scores + pagination (Admin only)
adminRouter.get("/graduates", protect, allowOnly("admin"), getAllGraduates);
// Get companies dashboard data (Admin only)
adminRouter.get(
  "/companies-dashboard",
  protect,
  allowOnly("admin"),
  getCompaniesDashboardController,
);
// Get all graduates with filters + pagination (Admin only)
adminRouter.get(
  "/all-graduates",
  protect,
  allowOnly("admin"),
  getAllGraduatesWithFilters,
);

export default adminRouter;
