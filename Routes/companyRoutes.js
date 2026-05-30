import express from "express";
import {protect ,restrictTo} from "../Middelwares/authMiddelware.js";
import { 
  getCompanyProfile,
  updateCompanyProfile
} from "../Controllers/companyController.js";

const router = express.Router();

// ========== Company Profile (بعد الـ Login) ==========
router.get(
  "/profile",
  protect,
  restrictTo("Company"),
  getCompanyProfile
);
router.put(
  "/profile",
  protect,
  restrictTo("Company"),
  updateCompanyProfile
);

export default router;
