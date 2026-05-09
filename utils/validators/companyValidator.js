import { check } from "express-validator";
import { validatorMiddelware } from "../../Middelwares/validatorMiddelware";

export const companySignupValidator = [
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
  check("commercialRegister")
    .notEmpty()
    .withMessage("Commercial register number is required")
    .isLength({ min: 5, max: 50 })
    .withMessage(
      "Commercial register number must be between 5 and 50 characters",
    ),
  check("taxCard")
    .notEmpty()
    .withMessage("Tax card number is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("Tax card number must be between 5 and 50 characters"),

  validatorMiddelware,
];
