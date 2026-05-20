import { check } from "express-validator";
import { validatorMiddelware } from "../../Middelwares/validatorMiddelware.js";

export const signupGradValidator = [
  check("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Full name cannot exceed 50 characters"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("Please enter a valid phone number"),

  check("age")
    .notEmpty()
    .withMessage("Age is required")
    .isNumeric()
    .withMessage("Age must be a number"),

  check("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Please enter a valid gender"),

  check("university").notEmpty().withMessage("University is required"),

  check("graduationYear")
    .notEmpty()
    .withMessage("Graduation year is required")
    .isNumeric()
    .withMessage("Graduation year must be a number"),

  check("track")
    .notEmpty()
    .withMessage("Track is required")
    .isIn(["Frontend", "Backend"])
    .withMessage("Please enter a valid track"),
  validatorMiddelware,
];

export const signupCompValidator = [
  check("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Company name must be between 3 and 100 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("Please enter a valid phone number"),
  check("industry")
    .notEmpty()
    .withMessage("Industry is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Industry must be between 2 and 50 characters"),
  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  validatorMiddelware,
];

export const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validatorMiddelware,
];

export const forgetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("Email is required"),
  validatorMiddelware,
];

export const verifyResetCodeValidator = [
  check("resetCode").notEmpty().withMessage("Reset code is required"),
  validatorMiddelware,
];

export const resetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("Email is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
  validatorMiddelware,
];
