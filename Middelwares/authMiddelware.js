import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";
import Admin from "../Models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError("Not logged in. Please login first", 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded); // <-- ضيف ده

    // 3) Find user by id & role
    let user;
    if (decoded.role === "graduate") {
      user = await Graduate.findById(decoded.userId);
    } else if (decoded.role === "company") {
      user = await Company.findById(decoded.userId);
    } else if (decoded.role === "admin") {
      user = await Admin.findById(decoded.userId);
    }
    console.log("👤 Found user:", !!user, "Role:", decoded.role);

    if (!user) {
      return next(new ApiError("User no longer exists", 401));
    }

    // 4) Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError("Invalid or expired token", 401));
  }
};

// Role restriction
export const restrictTo = (...roles) => {
  return (req, res, next) => {
  const userRole = req.user.role?.toLowerCase();
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("No permission", 403));
    }
    next();
  };
};
