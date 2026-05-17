import express from "express";
import { graduateSignup } from "../Controllers/authController.js";
import { graduateSignUpValidator } from "../utils/validators/graduateValidator.js";
import { uploadSingleFile } from "../Middelwares/uploadMiddelware.js";

const router = express.Router();

// POST /api/v1/graduates/signup
router.post(
  "/signup",
  uploadSingleFile,
  graduateSignUpValidator,
  graduateSignup,
);

export default router;
