import express from "express";
import {graduateSignup,graduateLogin,
  companySignup,companyLogin,
} from "../controllers/authController.js";
import { graduateSignUpValidator } from "../validators/graduateValidator.js";
import { companySignUpValidator } from "../validators/companyValidator.js";
import { uploadSingleFile, uploadCompanyFiles } from "../Midlewares/uploadMidleware.js";
import { loginValidator } from "../validators/loginValidator.js";
const router = express.Router();

// ========== Graduate Routes ==========
// uploadSingleFile
router.post(
  "/graduate/signup", 
  uploadSingleFile,           
  graduateSignUpValidator,    
  graduateSignup              
);

router.post("/graduate/login", loginValidator, graduateLogin);
// ========== Company Routes ==========
// uploadCompanyFiles 
router.post(
  "/company/signup",
  uploadCompanyFiles,
  companySignUpValidator,         
  companySignup               
);


router.post("/company/login", loginValidator, companyLogin); 


export default router;