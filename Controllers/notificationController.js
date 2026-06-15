import asyncHandler from "express-async-handler";
import Graduate from "../Models/graduateModel.js";
import { createNotification } from "../Services/notificationService.js";
import {
  getMyNotifications,
  getMyNotificationsFromAdmin,
  getMyPersonalAdminMessages,
  // markAsRead,
  markAllAsRead,
} from "../Services/notificationService.js";

// @desc    Get my notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { notifications, unreadCount } = await getMyNotifications(
    req.user._id,
    req.user.role?.toLowerCase()  // "company" أو "graduate"
  );

  res.status(200).json({
    status: "success",
    unreadCount,
    results: notifications.length,
    data: { notifications },
  });
});

// ─── Company Only: Get My Notifications ────────────────────
export const getCompanyNotifications = asyncHandler(async (req, res) => {
  const { notifications, unreadCount } = await getMyNotifications(
    req.user._id,
    "company"
  );

  res.status(200).json({
    status: "success",
    unreadCount,
    results: notifications.length,
    data: { notifications },
  });
});

// @desc    Mark as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markNotificationAsRead= async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { 
      _id: notificationId, 
      recipient: userId.toString() 
    },
    { isRead: true },
    { new: true }
  );
  
  if (!notification) {
    // Try without recipient check (for debugging)
    const notifExists = await Notification.findById(notificationId);
    if (!notifExists) throw new ApiError("Notification not found", 404);
    
    // If exists but recipient mismatch
    throw new ApiError("You are not authorized to mark this notification as read", 403);
  }
  
  return notification;
};
// @desc    Mark all as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await markAllAsRead(req.user._id, req.user.role);

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});


// ─── Contact Single Graduate ──────────────────────────
export const contactGraduate = asyncHandler(async (req, res, next) => {
  const { message, title } = req.body;
  const { graduateId } = req.params;

  if (!message || message.trim() === "") {
    return next(new ApiError("Message is required", 400));
  }

  const graduate = await Graduate.findById(graduateId);
  if (!graduate) return next(new ApiError("Graduate not found", 404));

  await createNotification({
    recipient: graduate._id,
    recipientRole: "graduate",
    sender: req.user._id,
    senderRole: "admin",
    type: "admin_message",
    title: title || "📩 Message from Admin",
    message: message,
  });

  res.status(200).json({
    status: "success",
    message: "Notification sent successfully to graduate",
    data: {
      graduate: graduate.fullName,
      sentMessage: message,
    },
  });
});

// ─── Contact All Graduates ───────────────────────────
export const contactAllGraduates = asyncHandler(async (req, res, next) => {
  const { message, title } = req.body;

  if (!message || message.trim() === "") {
    return next(new ApiError("Message is required", 400));
  }

  const graduates = await Graduate.find().select("_id fullName");

  if (graduates.length === 0) {
    return next(new ApiError("No graduates found", 404));
  }

  const notifications = [];
  for (const graduate of graduates) {
    const notification = await createNotification({
      recipient: graduate._id,
      recipientRole: "graduate",
      sender: req.user._id,
      senderRole: "admin",
      type: "general",
      title: title || "📩 Message from Admin",
      message: message,
    });
    notifications.push(notification);
  }

  res.status(200).json({
    status: "success",
    message: `Notification sent to ${graduates.length} graduates`,
    data: {
      totalGraduates: graduates.length,
      sentMessage: message,
    },
  });
});

// @desc    Get notifications from admin only (for graduate)
// @route   GET /api/v1/notifications/admin
// @access  Private (Graduate)
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { notifications, unreadCount } = await getMyNotificationsFromAdmin(
    req.user._id
  );

  res.status(200).json({
    status: "success",
    unreadCount,
    results: notifications.length,
    data: { notifications },
  });
});
// @desc    Get personal admin messages only (for graduate)
// @route   GET /api/v1/notifications/admin/personal
// @access  Private (Graduate)
export const getPersonalAdminMessages = asyncHandler(async (req, res) => {
  const { notifications, unreadCount } = await getMyPersonalAdminMessages(
    req.user._id
  );

  res.status(200).json({
    status: "success",
    unreadCount,
    results: notifications.length,
    data: { notifications },
  });
});