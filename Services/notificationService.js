import Notification from "../Models/notificationModel.js";
import ApiError from "../utils/apiError.js";


// إنشاء notification
export const createNotification = async (data) => {
  const notification = await Notification.create(data);
  return notification;
};

// جلب notifications للـ user
export const getMyNotifications = async (userId, role) => {
  const normalizedRole = role.toLowerCase(); // "company" أو "graduate"
  const notifications = await Notification.find({
    recipient: userId,
    recipientRole: normalizedRole,
  }).sort("-createdAt");

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    recipientRole: role,
    isRead: false,
  });

  return { notifications, unreadCount };
};

// تحديد كـ مقروء
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new ApiError("Notification not found", 404);
  return notification;
};

// تحديد الكل كـ مقروء
export const markAllAsRead = async (userId, role) => {
  const normalizedRole = role?.toLowerCase();
  await Notification.updateMany(
    { recipient: userId, recipientRole: normalizedRole, isRead: false },    { isRead: true }
  );
  return true;
};