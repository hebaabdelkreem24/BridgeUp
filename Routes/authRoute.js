import express from "express";

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

export default authRouter;
