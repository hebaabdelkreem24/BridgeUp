import express from "express";
import { companySignup } from "../controllers/authController.js";
import { companySignUpValidator } from "../validators/companyValidator.js";
import { uploadCompanyFiles } from "../Midlewares/uploadMidleware.js";

const router = express.Router();

router.post(
  "/signup",
  uploadCompanyFiles,  // ← هنا
  companySignUpValidator,
  companySignup
);

export default router;