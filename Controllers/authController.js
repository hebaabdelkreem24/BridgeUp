import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import Graduate from "../models/graduateModel.js";
import Company from "../models/companyModel.js";
import {
  loginService,
  forgetPasswordService,
  verifyResetCodeService,
  resetPasswordService,
} from "../Services/authService.js";
import { generateToken } from "../utils/createToken.js";
import sendEmail from "../utils/sendEmail.js";



// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  const data = await loginService(email, password, role);
  res.status(200).json({
    message: "Login successful",
    ...data,
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1)Get user by email
  const { email, role } = req.body;

  const data = await forgetPasswordService(email, role);
  res.status(200).json({
    message: "Reset code send to your email",
  });
});

// @desc    Verify password reset code
// @route   POST /api/auth/verify-reset-code
// @access  Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode, role } = req.body;
  await verifyResetCodeService(resetCode, role);
  res.status(200).json({
    message: "Reset code verified, you can now reset your password",
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, role } = req.body;
  await resetPasswordService(email, role, newPassword);
  const token = generateToken(user._id, role);
  res.status(200).json({
    message: "Password reset successful",
    token,
  });
});
