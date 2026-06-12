import asyncHandler from "express-async-handler";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import Admin from "../Models/adminModel.js";
import Assessment from "../Models/assessmentModel.js";
import { resetPasswordTemplate } from "../utils/emailTemplate.js";
import { generateToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// Helper function to check if email is already taken by any user type
export const isEmailTaken = async (email) => {
  const [graduate, company, admin] = await Promise.all([
    Graduate.findOne({ email }),
    Company.findOne({ email }),
    Admin.findOne({ email }),
  ]);
  return graduate || company || admin;
};

// Middleware to protect routes and authenticate users
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("=== AUTH DEBUG ===");
  console.log("Auth Header:", authHeader);
  console.log("JWT_SECRET from env:", process.env.JWT_SECRET_KEY);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new ApiError("Not authorized, no token", 401));
  }
  // const token = authHeader.split(" ")[1];
const token = authHeader.replace("Bearer", "").trim();

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const [graduate, company, admin] = await Promise.all([
    Graduate.findById(decoded.userId) ,
    Company.findById(decoded.userId),
    Admin.findById(decoded.userId)
  ]);

  const user = graduate || company || admin;
  if (!user) {
    return next(new ApiError("Not authorized, user not found", 401));
  }

  req.user = user;
  next();
});

// Middleware to allow access only to specific roles
export const allowOnly = (...roles) => {
  return (req, res, next) => {

    //   console.log("=== allowOnly DEBUG ===");
    // console.log("req.user:", req.user);
    // console.log("req.user.role:", req.user?.role);
    // console.log("roles allowed:", roles);
    // console.log("includes:", roles.includes(req.user?.role));
    // // === END DEBUG ===

    const userRole = req.user.role?.toLowerCase();
    const normalizedRoles = roles.map(r => r.toLowerCase());
    
    if (!normalizedRoles.includes(userRole)) {
      return next(new ApiError("Forbidden: You don't have permission...", 403));
    }
    next();
  };
};

// Middleware to check if a company is approved by the admin
export const isApprovedCompany = asyncHandler(async (req, res, next) => {
  if (req.user.role === "company" && !req.user.isApproved) {  // ← small c
    return next(
      new ApiError("Your account is pending approval by the admin", 403),
    );
  }
  next();
});

// Service function for signup Graduate
export const graduateSignupService = async (body, file) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    age,
    gender,
    university,
    graduationYear,
    track,
    profilePicture,
    portfolioLink,
    linkedInProfile,
    gitHubProfile,
  } = body;

  const existingUser = await isEmailTaken(email);
  if (existingUser) {
    throw new ApiError("Email already registered", 400);
  }
  if (password !== confirmPassword) {
    throw new ApiError("Confirm password not match password", 400);
  }
  const cvPath = file ? `/uploads/${file.filename}` : null;

  const graduate = await Graduate.create({
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    age,
    gender,
    university,
    graduationYear,
    track,
    profilePicture: profilePicture || null,
    cv: cvPath,
    portfolioLink: portfolioLink || null,
    linkedInProfile: linkedInProfile || null,
    gitHubProfile: gitHubProfile || null,
  });
  const assessment = await Assessment.create({
    graduate: graduate._id,
  });
  console.log("Assessment Created:", assessment);

  const token = generateToken(graduate );  // ✅ small g

  return {
    token,
    user: {
      id: graduate._id,
      fullName: graduate.fullName,
      email: graduate.email,
      phone: graduate.phone,
      age: graduate.age,
      gender: graduate.gender,
      track: graduate.track,
      university: graduate.university,
    },
    assessment,
  };
};

// Service function for signup Company
export const companySignupService = async (body, files) => {
  const {
    companyName,
    email,
    password,
    confirmPassword,
    phone,
    industry,
    description,
  } = body;

  const existingUser = await isEmailTaken(email);
  if (existingUser) {
    throw new ApiError("Email already registered", 400);
  }

  if (!files || !files.commercialRegister || !files.taxCard) {
    throw new ApiError(
      "Please upload both commercial register and tax card",
      400,
    );
  }
  if (password !== confirmPassword) {
    throw new ApiError("Confirm password not match password", 400);
  }
  const commercialRegisterPath = `/uploads/${files.commercialRegister[0].filename}`;
  const taxCardPath = `/uploads/${files.taxCard[0].filename}`;

  const company = await Company.create({
    companyName,
    email,
    password,
    confirmPassword,
    phone,
    industry,
    description: description || "",
    commercialRegister: commercialRegisterPath,
    taxCard: taxCardPath,
    isApproved: false,
  });

  const token = generateToken(company);  // ← NEW + small c

  return {
    token,  // ← NEW
    company: {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      description: company.description,
      industry: company.industry,
      taxCard: taxCardPath,
      commercialRegister: commercialRegisterPath,
      isApproved: company.isApproved,
    },
  };
};

// Service function for login
export const loginService = async (email, password) => {
  try{
      console.log("🔐 loginService called with email:", email);

  const [graduate, company, admin] = await Promise.all([
    Graduate.findOne({ email }).select("+password"),
    Company.findOne({ email }).select("+password"),
    Admin.findOne({ email }).select("+password"),
  ]);

  const user = graduate || company || admin;
  if (!user) throw new ApiError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Invalid email or password", 401);

  let role;
  if (graduate) role = "graduate";      // ← small g
  else if (company) role = "company";   // ← small c
  else if (admin) role = "admin";       // ← small a

  if (role === "company" && !user.isApproved) {  // ← small c
    throw new ApiError("Your account is pending admin approval.", 403);
  }

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user._id,
      name: user.fullName || user.companyName,
      email: user.email,
      phone: user.phone,
      role,
    },
  };
}catch(error){
    if (error instanceof ApiError && error.isOperational) {
    throw error;
  }

  console.error("Error in loginService:", error);
  throw new ApiError("An error occurred during login. Please try again later.", 500);
} 
};




// Service function for sending password reset email
export const forgetPasswordService = async (email) => {
  const [graduate, company] = await Promise.all([
    Graduate.findOne({ email }),
    Company.findOne({ email }),
  ]);

  const user = graduate || company;
  if (!user) throw new ApiError("User not found", 404);

  const role = graduate ? "graduate" : "company";  // ← small

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpiredAt = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const message = resetPasswordTemplate(user.email, resetCode);
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpiredAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    throw new ApiError("Error sending email, please try again later.", 500);
  }

  return true;
};

// Service function for verifying password reset code
export const verifyResetCodeService = async (resetCode) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const [graduate, company] = await Promise.all([
    Graduate.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpiredAt: { $gt: Date.now() },
    }),
    Company.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpiredAt: { $gt: Date.now() },
    }),
  ]);

  const user = graduate || company;
  if (!user) throw new ApiError("Invalid or expired reset code", 400);

  user.passwordResetVerified = true;
  await user.save();
  return true;
};

// Service function for resetting password
export const resetPasswordService = async (email, newPassword) => {
  const [graduate, company] = await Promise.all([
    Graduate.findOne({ email }),
    Company.findOne({ email }),
  ]);

  const user = graduate || company;
  if (!user) throw new ApiError("User not found", 404);

  if (!user.passwordResetVerified) {
    throw new ApiError("Reset code not verified, please verify first", 400);
  }

  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpiredAt = undefined;
  user.passwordResetVerified = undefined;

  await user.save();
  return true;
};

// Function to create a new admin
export const createAdmin = asyncHandler(async (body) => {
  const { name, email, password } = body;

  const admin = await Admin.create({ name, email, password });
  return admin;
});

export const loginAdmin = asyncHandler(async (body) => {
  const { email, password } = body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error("Invalid credentials");
  }
  return admin;
});