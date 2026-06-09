import express from "express";

import { allowOnly } from "../Services/authService.js";
import * as adminCompanyController  from "../Controllers/adminCompanyController.js";
import * as adminController from "../Controllers/AdminController.js";
import { protect, restrictTo } from "../Middelwares/authMiddelware.js";

const adminRouter = express.Router();
// Companies
adminRouter.get("/companies",adminCompanyController.getAllCompanies);
adminRouter.get("/companies/:id",adminCompanyController.getCompanyprofile);
adminRouter.patch("/companies/:id/approve", adminCompanyController.approveCompany);
adminRouter.patch("/companies/:id/reject", adminCompanyController.rejectCompany);
adminRouter.patch("/companies/:id/star", adminCompanyController.toggleStarCompany);
adminRouter.get("/companies/starred", adminCompanyController.getStarredCompanies);

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
