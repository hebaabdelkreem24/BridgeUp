import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAdminNotifications,
  getPersonalAdminMessages,
} from "../Controllers/notificationController.js";
import { protect, allowOnly } from "../Services/authService.js";  // ← أضيفي allowOnly

const router = express.Router();

router.use(protect); // أي user مسجل دخول

router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:id/read", markNotificationAsRead);
// Get admin notifications only
router.get("/admin", protect, allowOnly("graduate"), getAdminNotifications);
// GET /api/v1/notifications/admin/personal
router.get("/admin/personal", protect, allowOnly("graduate"), getPersonalAdminMessages);
export default router;