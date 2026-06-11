import express from "express";
<<<<<<< HEAD
import {protect ,restrictTo} from "../Middelwares/authMiddelware.js";
import { 
  getCompanyProfile,
  updateCompanyProfile
=======
import { protect, allowOnly } from "../Services/authService.js";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getAllGraduates,
  addToShortlist,
  removeFromShortlist,
  getShortlisted,
>>>>>>> heba2
} from "../Controllers/companyController.js";

const router = express.Router();

<<<<<<< HEAD
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
=======
router.use(protect, allowOnly("company"));
>>>>>>> heba2

router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);
router.get("/graduates", getAllGraduates);
router.post("/shortlist/:graduateId", addToShortlist);
router.delete("/shortlist/:graduateId", removeFromShortlist);
router.get("/shortlisted", getShortlisted);

export default router;