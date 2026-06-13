import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../Controllers/notificationController.js";
import { protect } from "../Services/authService.js";

const router = express.Router();

router.use(protect); // أي user مسجل دخول

router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:id/read", markNotificationAsRead);

export default router;