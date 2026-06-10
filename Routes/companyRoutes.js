import express from "express";
import { companySignup } from "../Controllers/authController.js";
import { uploadCompanyFiles } from "../Middelwares/uploadMiddelware.js";
import{protect , restrictTo} from "../Middelwares/authMiddelware.js";
import {getCompanyProfile,
  updateCompanyProfile,
  getAllGraduates,
  addToShortlist,     
  removeFromShortlist, 
  getShortlisted} from "../Controllers/companyController.js";
const router = express.Router();
router.use(protect, restrictTo("company"));

router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);
router.get("/graduates", getAllGraduates);
router.post("/shortlist/:graduateId", addToShortlist);
router.delete("/shortlist/:graduateId", removeFromShortlist);
router.get("/shortlisted", getShortlisted);

// router.post("/signup",uploadCompanyFiles,companySignUpValidator,companySignup,);

export default router;
