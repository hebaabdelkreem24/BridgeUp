import express from "express";
import {protect, allowOnly} from "../Services/authService.js";
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

const router = express.Router();

router.use(protect, allowOnly('admin'));

router.get("/companies", getAllCompanies);
router.get("/companies/starred", getStarredCompanies);
router.get("/companies/:id", getCompanyprofile);
router.patch("/companies/:id/approve", approveCompany);
router.patch("/companies/:id/reject", rejectCompany);
router.patch("/companies/:id/ban", banCompany);
router.patch("/companies/:id/toggle-star", toggleStarCompany);
router.delete("/companies/:id", deleteCompany);

// ─── NEW: Contact routes ──────────────────────────────
router.post("/companies/:id/contact", contactCompany);
router.post("/companies/contact-all", contactAllCompanies);

export default router;