import asyncHandler from "express-async-handler";
import {
  submitContactUsForm,
  getAllContactUsEntries,
  getTodayMessagesService,
  getMessageByIdService,
  deleteMessageService,
  deleteAllMessagesService,
  getMessagesStatsService,
} from "../Services/contactUsService.js";

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
// @access  Private (Admin only)
export const getAllContactUs = asyncHandler(async (req, res, next) => {
  const entries = await getAllContactUsEntries();
  res.status(200).json({
    status: "success",
    results: entries.length,
    data: entries,
  });
});

// @desc    Get Today's Contact Us Messages
// @route   GET /api/v1/contactUs/today
// @access  Private (Admin only)
export const getTodayMessages = asyncHandler(async (req, res, next) => {
  const messages = await getTodayMessagesService();
  res.status(200).json({
    status: "success",
    results: messages.length,
    data: messages,
  });
});

// @desc    Get a Contact Us Message by ID
// @route   GET /api/v1/contactUs/:id
// @access  Private (Admin only)
export const getMessageById = asyncHandler(async (req, res) => {
  const message = await getMessageByIdService(req.params.id);

  res.status(200).json({
    status: "success",
    data: message,
  });
});

// @desc    Delete a Contact Us Message by ID
// @route   DELETE /api/v1/contactUs/:id
// @access  Private (Admin only)
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const deletedMessage = await deleteMessageService(req.params.id);
  res.status(204).send();
});

// @desc    Delete All Contact Us Messages
// @route   DELETE /api/v1/contactUs
// @access  Private (Admin only)
export const deleteAllMessages = asyncHandler(async (req, res, next) => {
  const result = await deleteAllMessagesService();
  res.status(200).json({
    status: "success",
    message: `${result.deletedCount} messages deleted successfully`,
  });
});


// @desc    Get Contact Us Messages Statistics
// @route   GET /api/v1/contactUs/stats
// @access  Private (Admin only)
export const getMessagesStats = async (req, res, next) => {
  try {
    const stats = await getMessagesStatsService();

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};