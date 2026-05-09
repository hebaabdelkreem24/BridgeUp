import { check } from "express-validator";
import { validatorMiddelware } from "../../Middelwares/validatorMiddelware";


export const graduateSignUpValidator = [
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
  
  check("university")
    .notEmpty()
        .withMessage("University is required"),
  
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