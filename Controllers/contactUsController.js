import asyncHandler from "express-async-handler";
import { submitContactUsForm, getAllContactUsEntries } from "../Services/contactUsService.js";

// @desc    Submit Contact Us Form
// @route   POST /api/v1/contactUs
// @access  Public
export const contactUs = asyncHandler(async (req, res, next) => {
  const contactEntry = await submitContactUsForm(req.body);
  res.status(201).json({
    status: "success",
    message: "Your message has been received! We'll get back to you soon.",
    data: contactEntry,
  });
});

// @desc    Get All Contact Us Submissions
// @route   GET /api/v1/contactUs
// @access  Public (Dev side)
export const getAllContactUs = asyncHandler(async (req, res, next) => {
  const entries = await getAllContactUsEntries();
  res.status(200).json({
    status: "success",
    results: entries.length,
    data: entries,
  });
});
