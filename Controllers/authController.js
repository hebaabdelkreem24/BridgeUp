import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../utils/apiError.js";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import { generateToken } from "../utils/generateToken.js";

import {
  loginService,
  forgetPasswordService,
  verifyResetCodeService,
  resetPasswordService,
} from "../Services/authService.js";


// @desc    Select Role (Grad,Comp)
// @route   POST /api/auth/select-role
// @access  Public
export const selectRole = asyncHandler(async (req, res, next) => {
  // export const selectRole = asyncHandler(async (req, res, next) => {
  //   const { role } = req.body;
  
  //   if (!role || !["graduate", "company"].includes(role)) {
  //     return next(new ApiError("Please select a valid role: 'graduate' or 'company'", 400));
  //   }
  
  //   // لو عايز تحفظ الـ role مؤقتًا في الكوكي عشان الخطوة الجاية
  //   res.cookie("selectedRole", role, {
  //     httpOnly: true,
  //     maxAge: 60 * 60 * 1000, // ساعة
  //   });
  
  //   res.status(200).json({
  //     status: "success",
  //     message: "Role selected",
  //     role,
  //   });
  // });
  const { role } = req.body;
  if (!role || !["graduate", "company"].includes(role)) {
    return next(new ApiError("Please select a valid role", 400));
  }

  res.status(200).json({ status: "success", role });
});

// @desc    SignUp  Graduate
// @route   POST /api/auth/signup-grad
// @access  Public
export const graduateSignup = asyncHandler    ( async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      age,
      gender,
      university,
      graduationYear,
      track,
      portfolioLink,
      linkedInProfile,
      gitHubProfile,
    } = req.body;

    // 1) Check if email already exists
    const existingGraduate = await Graduate.findOne({ email });
    if (existingGraduate) {
      return next(new ApiError("Email already registered", 400));
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3) Handle CV upload
    const cvPath = req.file ? `/uploads/${req.file.filename}` : null;

    // 4) Create graduate
    const graduate = await Graduate.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      university,
      graduationYear,
      track,
      cv: cvPath,
      portfolioLink: portfolioLink || null,
      linkedInProfile: linkedInProfile || null,
      gitHubProfile: gitHubProfile || null,
    });

    // 5) Generate JWT token
    const user = await resetPasswordService(email, role, newPassword);

    const token = generateToken(graduate._id, graduate.role);

    // 6) Send response
    res.status(201).json({
      status: "success",
      message: "Account created successfully! Welcome to BridgeUp.",
      token,
      data: {
        user: {
          id: graduate._id,
          fullName: graduate.fullName,
          email: graduate.email,
          role: graduate.role,
          track: graduate.track,
          university: graduate.university,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});


// @desc    Signup  Company
// @route   POST /api/auth/signup-comp
// @access  Public
export const companySignup = asyncHandler(  async (req, res, next) => {
  try {
    const { companyName, email, password, phone, industry, description } =
      req.body;

    // 1) Check if email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return next(new ApiError("Email already registered", 400));
    }

    // 2) Check if files were uploaded
    if (!req.files || !req.files.commercialRegister || !req.files.taxCard) {
      return next(
        new ApiError(
          "Please upload both commercial register and tax card documents",
          400,
        ),
      );
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4) Handle file uploads
    const commercialRegisterPath = `/uploads/${req.files.commercialRegister[0].filename}`;
    const taxCardPath = `/uploads/${req.files.taxCard[0].filename}`;

    // 5) Create company (pending approval)
    const company = await Company.create({
      companyName,
      email,
      password: hashedPassword,
      phone,
      industry,
      description: description || "",
      commercialRegister: commercialRegisterPath,
      taxCard: taxCardPath,
      isApproved: false,
    });

    // 6) Send response (NO token until approved by admin)
    res.status(201).json({
      status: "success",
      message:
        "Account created successfully! Your account is pending admin approval. You will receive an email once approved (typically within 24-48 hours).",
      data: {
        company: {
          id: company._id,
          companyName: company.companyName,
          email: company.email,
          industry: company.industry,
          isApproved: company.isApproved,
          createdAt: company.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

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

