import express from "express";

import {
  graduateSignup,
  graduateLogin,
  companySignup,
  companyLogin,
} from "../Controllers/authController.js";
import { graduateSignUpValidator } from "../utils/validators/graduateValidator.js";
import { companySignUpValidator } from "../utils/validators/companyValidator.js";
import {
  uploadSingleFile,
  uploadCompanyFiles,
} from "../Midlewares/uploadMiddelware.js";

import {
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator.js";
import {
  login,
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "../Controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", loginValidator, login);
authRouter.post("/forgot-password", forgetPasswordValidator, forgotPassword);
authRouter.post(
  "/verify-reset-code",
  verifyResetCodeValidator,
  verifyResetCode,
);
authRouter.post("/reset-password", resetPasswordValidator, resetPassword);

// ========== Graduate Routes ==========
// uploadSingleFile
authRouter.post(
  "/graduate/signup",
  uploadSingleFile,
  graduateSignUpValidator,
  graduateSignup,
);

authRouter.post("/graduate/login", loginValidator, graduateLogin);
// ========== Company Routes ==========
// uploadCompanyFiles
authRouter.post(
  "/company/signup",
  uploadCompanyFiles,
  companySignUpValidator,
  companySignup,
);

authRouter.post("/company/login", loginValidator, companyLogin);

export default authRouter;
