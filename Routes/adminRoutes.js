import express from "express";
<<<<<<< HEAD
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
=======
import { allowOnly, protect } from "../Services/authService.js";
import * as adminCompanyController from "../Controllers/adminCompanyController.js";
import * as adminController from "../Controllers/AdminController.js";

const adminRouter = express.Router();

// Companies
adminRouter.get("/companies", protect, allowOnly("admin"), adminCompanyController.getAllCompanies);
adminRouter.get("/companies/:id", protect, allowOnly("admin"), adminCompanyController.getCompanyprofile);
adminRouter.patch("/companies/:id/approve", protect, allowOnly("admin"), adminCompanyController.approveCompany);
adminRouter.patch("/companies/:id/reject", protect, allowOnly("admin"), adminCompanyController.rejectCompany);
adminRouter.patch("/companies/:id/star", protect, allowOnly("admin"), adminCompanyController.toggleStarCompany);
adminRouter.get("/companies/starred", protect, allowOnly("admin"), adminCompanyController.getStarredCompanies);

// Stats & Graduates
adminRouter.get("/stats", protect, allowOnly("admin"), adminController.getStats);
adminRouter.get("/graduates", protect, allowOnly("admin"), adminController.getAllGraduates);
adminRouter.get("/companies-dashboard", protect, allowOnly("admin"), adminController.getCompaniesDashboardController);
adminRouter.get("/all-graduates", protect, allowOnly("admin"), adminController.getAllGraduatesWithFilters);

export default adminRouter;
>>>>>>> heba2
