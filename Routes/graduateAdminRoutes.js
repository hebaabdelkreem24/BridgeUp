// Routes/graduateAdminRoutes.js
import express from "express";
import { protect, allowOnly } from "../Services/authService.js";
import {
  contactGraduate,
  contactAllGraduates,
} from "../Controllers/notificationController.js";

const router = express.Router();

router.use(protect, allowOnly("admin"));

router.post("/graduates/:graduateId/contact", contactGraduate);
router.post("/graduates/contact-all", contactAllGraduates);

export default router;