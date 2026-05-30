import express from "express";
import {protect, restrictTo} from "../Middelwares/authMiddelware.js";
import {
    getAllCompanies,
    getCompanyprofile,
    approveCompany,
    rejectCompany,
    toggleStarCompany,
    getStarredCompanies
}from "../Controllers/adminCompanyController.js";

const router = express.Router();

router.use(protect, restrictTo('Admin'));

router.get("/companies",getAllCompanies);
router.get("/companies/starred", getStarredCompanies);
router.get("/companies/:id",getCompanyprofile);
router.patch("/companies/:id/approve", approveCompany);
router.patch("/companies/:id/reject", rejectCompany);
router.patch("/companies/:id/toggle-star", toggleStarCompany);

export default router;