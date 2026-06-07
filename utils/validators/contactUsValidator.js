import { check } from "express-validator";
import { validatorMiddelware } from "../../Middelwares/validatorMiddelware.js";
import ContactUs from "../../Models/contactUsModel.js";

export const contactUsValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .isLength({ max: 30 })
    .withMessage("First name cannot exceed 30 characters"),
  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long")
    .isLength({ max: 30 })
    .withMessage("Last name cannot exceed 30 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const contactEntry = await ContactUs.findOne({ email: value });
      if (contactEntry) {
        throw new Error("Email is already in use");
      }
    }),
  check("message")
    .notEmpty()
    .withMessage("Message is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long")
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
  validatorMiddelware,
];
