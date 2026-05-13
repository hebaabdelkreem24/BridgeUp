import { check } from "express-validator";
import { validatorMidleware } from "../Midlewares/validatorMidleware.js";
import Company from "../models/companyModel.js";

export const companySignUpValidator = [
  check("companyName")
    .notEmpty().withMessage("Company name is required")
    .trim()
    .isLength({ min: 2 }).withMessage("Company name is too short"),

  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const exists = await Company.findOne({ email: value });
      if (exists) throw new Error("Email already registered");
    }),

  check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  check("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),

  check("phone")
    .notEmpty().withMessage("Phone is required")
    .isMobilePhone(["ar-EG"]).withMessage("Invalid Egyptian phone"),

  check("industry")
    .notEmpty().withMessage("Industry is required")
    .trim(),

  check("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Max 500 characters"),

  validatorMidleware,
];