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
import {
  sendOffer,
  getMySentOffers,
  deleteOffer,
  getOfferStats,  // ← جديد
} from "../Controllers/offerJobController.js";
import {
  getCompanyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../Controllers/notificationController.js";

const router = express.Router();

router.use(protect, allowOnly("company"));
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
// Offer routes
router.post("/offers", sendOffer);           // POST Contact offer
router.get("/offers/sent", getMySentOffers);  // GET sent offer
router.get("/offers/stats", getOfferStats);   // GET comp-Offer Stats
router.delete("/offers/:id", deleteOffer);  

export default router;