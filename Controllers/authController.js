import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import { generateToken } from "../utils/generateToken.js";
import {
  isEmailTaken,
  graduateSignupService,
  companySignupService,
  loginService,
  forgetPasswordService,
  verifyResetCodeService,
  resetPasswordService,
} from "../Services/authService.js";

// @desc    Select Role
// @route   POST /api/auth/select-role
// @access  Public
export const selectRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return next(new ApiError("Please select a valid role", 400));
  }

  // Convert to capitalize (graduate → Graduate, COMPANY → Company)
  const normalizedRole =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  if (!["Graduate", "Company"].includes(normalizedRole)) {
    return next(
      new ApiError("Please select a valid role: 'graduate' or 'company'", 400),
    );
  }

  res.status(200).json({ status: "success", role: normalizedRole });
});

// @desc    Signup Graduate
// @route   POST /api/auth/signup-grad
// @access  Public
export const graduateSignup = asyncHandler(async (req, res, next) => {
  const data = await graduateSignupService(req.body, req.file);
  res.status(201).json({
    status: "success",
    message: "Account created successfully! Welcome to BridgeUp.",
    ...data,
  });
});

// @desc    Signup Company
// @route   POST /api/auth/signup-comp
// @access  Public
export const companySignup = asyncHandler(async (req, res, next) => {
    console.log("📥 Controller received:");
  console.log("Controller - req.files:", req.files);
  console.log("Controller - req.body:", req.body);
  const data = await companySignupService(req.body, req.files);
  res.status(201).json({
    status: "success",
    message: "Account created! Pending admin approval (24-48 hours).",
    ...data,
  });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  res.status(200).json({
    message: "Login successful",
    ...data,
  });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  await forgetPasswordService(email);
  res.status(200).json({ message: "Reset code sent to your email" });
});

// @desc    Verify Reset Code
// @route   POST /api/auth/verify-reset-code
// @access  Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  await verifyResetCodeService(resetCode);
  res.status(200).json({
    message: "Reset code verified, you can now reset your password",
  });
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  await resetPasswordService(email, newPassword);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully, you can now log in with your new password",
  });
});
