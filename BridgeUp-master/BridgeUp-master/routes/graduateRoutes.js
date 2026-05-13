import express from "express";
import { graduateSignup } from "../controllers/authController.js";
import { graduateSignUpValidator } from "../validators/graduateValidator.js";
import { uploadSingleFile } from "../Midlewares/uploadMidleware.js";

const router = express.Router();

// POST /api/v1/graduates/signup
router.post(
  "/signup",
  uploadSingleFile,  
  graduateSignUpValidator,
  graduateSignup
);

export default router;