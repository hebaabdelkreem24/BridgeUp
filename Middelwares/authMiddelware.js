import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import Admin from "../Models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError("Not logged in. Please login first", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user;
    if (decoded.role === "graduate") {
      user = await Graduate.findById(decoded.userId);
    } else if (decoded.role === "company") {
      user = await Company.findById(decoded.userId);
    } else if (decoded.role === "admin") {
      user = await Admin.findById(decoded.userId);
    }

    if (!user) {
      return next(new ApiError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError("Invalid or expired token", 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("No permission", 403));
    }
    next();
  };
};