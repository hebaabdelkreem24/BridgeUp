import express from "express";

import { contactUsValidator } from "../utils/validators/contactUsValidator.js";
import { contactUs, getAllContactUs } from "../Controllers/contactUsController.js";
import { protect , allowOnly } from "../Services/authService.js";

const contactUsRouter = express.Router();

contactUsRouter.post("/contactUs", contactUsValidator, contactUs);
contactUsRouter.get("/contactUs", protect, allowOnly("admin"), getAllContactUs);

export default contactUsRouter;
