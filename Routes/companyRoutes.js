import express from "express";
import { protect, allowOnly } from "../Services/authService.js";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getAllGraduates,
  addToShortlist,
  removeFromShortlist,
  getShortlisted,
} from "../Controllers/companyController.js";

const router = express.Router();

router.use(protect, allowOnly("company"));

router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);
router.get("/graduates", getAllGraduates);
router.post("/shortlist/:graduateId", addToShortlist);
router.delete("/shortlist/:graduateId", removeFromShortlist);
router.get("/shortlisted", getShortlisted);

export default router;