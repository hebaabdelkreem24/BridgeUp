import express from "express";

import {
  selectRole,
  graduateSignup,
  companySignup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
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

const authRouter = express.Router();

authRouter.post("/select-role", selectRole);
// ========== Graduate Routes ==========
// uploadSingleFile
authRouter.post(
  "/signup-grad",
  uploadSingleFile,
  signupGradValidator,
  graduateSignup,
);

// ========== Company Routes ==========
// uploadCompanyFiles
authRouter.post(
  "/signup-comp",
  uploadCompanyFiles,
  signupCompValidator,
  companySignup,
);

authRouter.post("/login", loginValidator, login);

authRouter.post("/forgot-password", forgetPasswordValidator, forgotPassword);

authRouter.post(
  "/verify-reset-code",
  verifyResetCodeValidator,
  verifyResetCode,
);

authRouter.post("/reset-password", resetPasswordValidator, resetPassword);

export default authRouter;
