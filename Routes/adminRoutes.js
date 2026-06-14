import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import * as adminCompanyController from "../Controllers/adminCompanyController.js";
import * as adminController from "../Controllers/AdminController.js";
import {
  getStats,
  getAllGraduates,
  getAllGraduatesWithFilters,
  getCompaniesDashboardController,

    getAllCompanies,
    getCompanyprofile,
  getStarredCompanies,
  approveCompany,
    rejectCompany,
    toggleStarCompany,
    banCompany,
    deleteCompany,
    contactCompany,
    contactAllCompanies
} from "../Controllers/AdminController.js";

const router = express.Router();// Companies
router.use(protect, allowOnly('admin'));

router.get("/companies", adminCompanyController.getAllCompanies);
router.get("/companies/:id", adminCompanyController.getCompanyprofile);
router.patch("/companies/:id/approve", adminCompanyController.approveCompany);
router.patch("/companies/:id/reject", adminCompanyController.rejectCompany);
router.patch("/companies/:id/star", adminCompanyController.toggleStarCompany);
router.get("/companies/starred", adminCompanyController.getStarredCompanies);
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
router.get("/companies-dashboard", protect,allowOnly("admin"),getCompaniesDashboardController);
// Get all graduates with filters + pagination (Admin only)
router.get("/all-graduates",protect,allowOnly("admin"),getAllGraduatesWithFilters);

export default router;
