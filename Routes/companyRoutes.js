import express from "express";
import { protect, allowOnly, isApprovedCompany } from "../Services/authService.js";
import { companySignup } from "../Controllers/authController.js";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getAllGraduates,
  addToShortlist,
  removeFromShortlist,
  getShortlisted,
  getGraduateProfileForCompany
} from "../Controllers/companyController.js";
import {
  getCompanyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../Controllers/notificationController.js";

const router = express.Router();

router.use(protect, allowOnly("company"), isApprovedCompany);

// Company profile routes
router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);

// Graduate routes
router.get("/graduates", getAllGraduates);

// Shortlist routes
router.post("/shortlist/:graduateId", addToShortlist);
router.delete("/shortlist/:graduateId", removeFromShortlist);
router.get("/shortlisted", getShortlisted);

// Notification
router.get("/notifications", getCompanyNotifications);
router.patch("/notifications/read-all", markAllNotificationsAsRead);
router.patch("/notifications/:id/read", markNotificationAsRead);

// Get single graduate profile for company
router.get("/graduates/:graduateId", protect, allowOnly("company"), isApprovedCompany, getGraduateProfileForCompany);

export default router;