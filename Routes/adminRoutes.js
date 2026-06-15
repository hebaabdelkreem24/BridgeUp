import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import * as adminCompanyController from "../Controllers/adminCompanyController.js";
import * as adminController from "../Controllers/AdminController.js";
import {
  getStats,
  getAllGraduates,
  getAllGraduatesWithFilters,
  getCompaniesDashboardController,  
} from "../Controllers/AdminController.js";

import {
    getAllCompanies,
    getCompanyprofile,
    approveCompany,
    rejectCompany,
    toggleStarCompany,
    getStarredCompanies,
    banCompany,
    deleteCompany,
    contactCompany,
    contactAllCompanies
}from "../Controllers/adminCompanyController.js";

import {
  contactGraduate,
  contactAllGraduates,
} from "../Controllers/notificationController.js";

const router = express.Router(); // Companies
router.use(protect, allowOnly("admin"));

router.get("/companies", adminCompanyController.getAllCompanies);
router.get("/companies/starred", adminCompanyController.getStarredCompanies);
router.get("/companies/:id", adminCompanyController.getCompanyprofile);
router.patch("/companies/:id/approve", adminCompanyController.approveCompany);
router.patch("/companies/:id/reject", adminCompanyController.rejectCompany);
router.patch("/companies/:id/star", adminCompanyController.toggleStarCompany);
router.patch("/companies/:id/ban", banCompany);
router.delete("/companies/:id", deleteCompany);


// ─── NEW: Contact routes ──────────────────────────────
router.post("/companies/:id/contact", contactCompany);
router.post("/companies/contact-all", contactAllCompanies);

// Get platform statistics (Admin only)
router.get("/stats", protect, allowOnly("admin"), getStats);
// Get all graduates with scores + pagination (Admin only)
router.get("/graduates", protect, allowOnly("admin"), getAllGraduates);
// Get companies dashboard data (Admin only)
router.get(
  "/companies-dashboard",
  protect,
  allowOnly("admin"),
  getCompaniesDashboardController,
);
// Get all graduates with filters + pagination (Admin only)
router.get(
  "/all-graduates",
  protect,
  allowOnly("admin"),
  getAllGraduatesWithFilters,
);

// ─── Graduate Contact routes ──────────────────────────
router.post("/graduates/:graduateId/contact", contactGraduate);
router.post("/graduates/contact-all", contactAllGraduates);

export default router;
