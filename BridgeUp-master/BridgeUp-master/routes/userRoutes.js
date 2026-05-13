import express from "express";
import { protect, restrictTo } from "../Midlewares/authMidleware.js";

const router = express.Router();

// Protected route - any logged in user
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// Admin only
router.get("/all-users", protect, restrictTo("Admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin access granted",
  });
});

// Graduate only
router.get("/graduate-dashboard", protect, restrictTo("Graduate"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Graduate dashboard",
    data: { user: req.user },
  });
});

// Company only (must be approved)
router.get("/company-dashboard", protect, restrictTo("Company"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Company dashboard",
    data: { user: req.user },
  });
});

export default router;