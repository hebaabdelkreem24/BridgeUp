import asyncHandler from "express-async-handler";
import {
  getMyNotifications,
  markAsRead,
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

export const markAsRead = async (notificationId, userId) => {
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