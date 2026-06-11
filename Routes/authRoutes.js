import express from "express";
import {
  selectRole,
  graduateSignup,
  companySignup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  createAdminController,
  loginAdminController,
} from "../Controllers/authController.js";
import {
  uploadSingleFile,
  uploadCompanyFiles,
} from "../Middelwares/uploadMiddelware.js";
import {
  signupGradValidator,
  signupCompValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator.js";
import { protect, allowOnly } from "../Services/authService.js";

const authRouter = express.Router();

authRouter.post("/select-role", selectRole);

authRouter.post(
  "/signup-grad",
  uploadSingleFile,
  signupGradValidator,
  graduateSignup,
);

authRouter.post(
  "/signup-comp",
  uploadCompanyFiles,
  signupCompValidator,
  companySignup,
);

authRouter.post("/login", loginValidator, login);
authRouter.post("/forgot-password", forgetPasswordValidator, forgotPassword);
authRouter.post("/verify-reset-code", verifyResetCodeValidator, verifyResetCode);
authRouter.post("/reset-password", resetPasswordValidator, resetPassword);

authRouter.post("/", createAdminController);
authRouter.post("/AdminLogin", protect, allowOnly("admin"), loginAdminController);

export default authRouter;