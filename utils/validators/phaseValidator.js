import { check } from "express-validator";

import { validatorMiddelware } from "../Middelwares/validatorMiddelware.js";

export const createPhaseValidator = [
  check("roadmap")
    .notEmpty()
    .withMessage("Roadmap is required")
    .isMongoId()
    .withMessage("Invalid roadmap ID"),
  check("title")
    .notEmpty()
    .withMessage("Phase title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Phase title must be between 3 and 100 characters"),
  check("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
  validatorMiddelware,
];
