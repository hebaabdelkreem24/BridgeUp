import { check } from "express-validator";
import { validatorMiddelware } from "../../Middelwares/validatorMiddelware.js";

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
