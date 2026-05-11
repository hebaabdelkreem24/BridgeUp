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

]