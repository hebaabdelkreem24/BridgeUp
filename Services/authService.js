import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import Admin from "../Models/adminModel.js";
import { resetPasswordTemplate } from "../utils/emailTemplate.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Middleware to protect routes and authenticate users
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !req.headers.authorization.startsWith("Bearer")) {
    return next(new ApiError("Not authorized, no token", 401));
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // Get user from role based on the decoded token
  let user;
  if (decoded.role === "Graduate") {
    user = await Graduate.findById(decoded.userId).select("-password");
  } else if (decoded.role === "Company") {
    user = await Company.findById(decoded.userId).select("-password");
  } else if (decoded.role === "Admin") {
    user = await Admin.findById(decoded.userId).select("-password");
  }
  if (!user) {
    return next(new ApiError("Not authorized, user not found", 401));
  }
  req.user = user;
  next();
});

// Middleware to allow access only to specific roles
export const allowOnly = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          "Forbidden: You don't have permission to access this resource",
          403,
        ),
      );
    }
    next();
  };
};

// Middleware to check if a company is approved by the admin
export const isApprovedCompany = asyncHandler(async (req, res, next) => {
  if (req.user.role === "Company" && !req.user.isApproved) {
    return next(
      new ApiError("Your account is pending approval by the admin", 403),
    );
  }
  next();
});

// Service function for login
export const loginService = asyncHandler(async (email, password, role) => {
  let user;
  if (role === "Graduate") {
    user = await Graduate.findOne({ email });
  } else if (role === "Company") {
    user = await Company.findOne({ businessEmail: email });
  } else if (role === "Admin") {
    user = await Admin.findOne({ email });
  } else {
    return next(new ApiError("Invalid role", 400));
  }
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = generateToken(user._id, role);
  return {
    token,
    user: {
      id: user._id,
      name: user.fullName || user.companyName,
      role,
    },
  };
});

// Service function for sending password reset email
export const forgetPasswordService = asyncHandler(async (email, role) => {
  let user;
  if (role === "Graduate") {
    user = await Graduate.findOne({ email });
  } else if (role === "Company") {
    user = await Company.findOne({ businessEmail: email });
  }
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // 2)If user exist, Generate reset random digits and save it in db
  // generate code for 6 digit
  const resedCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resedCode)
    .digest("hex");
  // Save hashed password reset code in db
  user.passwordResetCode = hashedResetCode;
  // add expiration time for password reset code (10 min)
  user.passwordResetExpiredAt = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false; // reset the verified status
  await user.save();
  // 2)Send the reset code via email
  const message = resetPasswordTemplate(user.email, resedCode);
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    user.passwordResetCode = undefined;
    user.passwordResetExpiredAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError(
        "There was an error sending the email. Please try again later.",
        500,
      ),
    );
  }
  return true;
});

// Service function for verifying password reset code
export const verifyResetCodeService = asyncHandler(async (role, resetCode) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resedCode)
    .digest("hex");
  let user;
  if (role === "Graduate") {
    user = await Graduate.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpiredAt: { $gt: Date.now() },
    });
  } else if (role === "Company") {
    user = await Company.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpiredAt: { $gt: Date.now() },
    });
  } else {
    return next(new ApiError("Invalid role", 400));
  }
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  return true;
});

// Service function for resetting password
export const resetPasswordService = asyncHandler(
  async (email, role, newPassword) => {
    let user;
    if (role === "Graduate") {
      user = await Graduate.findOne({ email });
    } else if (role === "Company") {
      user = await Company.findOne({ businessEmail: email });
    } else {
      return next(new ApiError("Invalid role", 400));
    }
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    if (!user.passwordResetVerified) {
      return next(
        new ApiError("No reset code found, please request a new one", 400),
      );
    }
    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpiredAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return true;
  },
);
