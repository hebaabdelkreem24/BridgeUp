import express from "express";
import { companySignup } from "../Controllers/authController.js";
import { companySignUpValidator } from "../utils/validators/companyValidator.js";
import { uploadCompanyFiles } from "../Midlewares/uploadMiddelware.js";

const router = express.Router();

router.post(
  "/signup",
  uploadCompanyFiles, // ← هنا
  companySignUpValidator,
  companySignup,
);

export default router;
