import express from "express";

import { contactUsValidator } from "../utils/validators/contactUsValidator.js";
import {
  contactUs,
  getAllContactUs,
  getTodayMessages,
  getMessageById,
  deleteMessage,
  deleteAllMessages,
  getMessagesStats,
} from "../Controllers/contactUsController.js";
import { protect, allowOnly } from "../Services/authService.js";

const contactUsRouter = express.Router();

contactUsRouter.post("/", contactUsValidator, contactUs);
contactUsRouter
  .route("/")
  .get(protect, allowOnly("admin"), getAllContactUs)
  .delete(protect, allowOnly("admin"), deleteAllMessages);
contactUsRouter.get("/today", protect, allowOnly("admin"), getTodayMessages);
contactUsRouter.get("/stats", protect, allowOnly("admin"), getMessagesStats);
contactUsRouter
  .route("/:id")
  .get(protect, allowOnly("admin"), getMessageById)
  .delete(protect, allowOnly("admin"), deleteMessage);
export default contactUsRouter;
