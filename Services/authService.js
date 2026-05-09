import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import Graduate from "../models/Graduate.js";
import Company from "../models/Company.js";
import Admin from "../models/Admin.js";

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
