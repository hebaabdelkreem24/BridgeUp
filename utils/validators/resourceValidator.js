import { check } from "express-validator";

import { validatorMiddelware } from "../Middelwares/validatorMiddelware.js";

export const createResourceValidator = [
  check("phase")
    .notEmpty()
    .withMessage("Phase is required")
    .isMongoId()
    .withMessage("Invalid phase ID"),
  check("title")
    .notEmpty()
    .withMessage("Resource title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Resource title must be between 3 and 100 characters"),
  check("url")
    .notEmpty()
    .withMessage("Resource URL is required")
    .isURL()
    .withMessage("Invalid URL format"),
  check("type")
    .notEmpty()
    .withMessage("Resource type is required")
    .isIn(["video", "doc", "article"])
    .withMessage("Resource type must be either video, doc, or article"),
  validatorMiddelware,
];
