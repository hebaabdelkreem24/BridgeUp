import { check } from "express-validator";
import { validatorMidleware } from "../Midlewares/validatorMidleware.js";

export const loginValidator = [
  check("email").notEmpty().isEmail().normalizeEmail(),
  check("password").notEmpty().isLength({ min: 6 }),
  validatorMidleware,
];