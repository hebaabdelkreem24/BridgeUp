import express from "express";

import { contactUsValidator } from "../utils/validators/contactUsValidator.js";
import {
  contactUs,
  getAllContactUs,
  getTodayMessages,
  getMessageById,
  deleteMessage,
  deleteAllMessages,
} from "../Controllers/contactUsController.js";
import { protect, allowOnly } from "../Services/authService.js";

const contactUsRouter = express.Router();

<<<<<<< HEAD
contactUsRouter.post("/contactUs", contactUsValidator, contactUs);
contactUsRouter.get("/contactUs", protect, allowOnly("admin"), getAllContactUs);
=======
contactUsRouter.post("/", contactUsValidator, contactUs);
contactUsRouter
  .route("/")
  .get(protect, allowOnly("admin"), getAllContactUs)
  .delete(protect, allowOnly("admin"), deleteAllMessages);
contactUsRouter.get("/today", protect, allowOnly("admin"), getTodayMessages);
contactUsRouter
  .route("/:id")
  .get(protect, allowOnly("admin"), getMessageById)
  .delete(protect, allowOnly("admin"), deleteMessage);
>>>>>>> fatma2

export default contactUsRouter;
