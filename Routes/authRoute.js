import express from "express";

import { loginValidator } from "../utils/validators/authValidator.js";
import { login } from "../Controllers/authController.js";



const authRouter = express.Router();


authRouter.post("/login", loginValidator, login);


export default authRouter;