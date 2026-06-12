import mongoose from "mongoose";
import dotenv from "dotenv";
import Notification from "./Models/notificationModel.js";

dotenv.config({ path: ".env" });

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // امسح القديم
    await Notification.deleteMany();
    console.log("🗑️ Deleted old notifications");

    // IDs من seed.js
    const companyId = "6a2af67501fe0a3cef3bf760";  // company@test.com
    const graduateId = "6a2af67501fe0a3cef3bf761"; // graduate@test.com
    const adminId = "6a2af67501fe0a3cef3bf762";    // admin@bridgeup.com

    const notifications = [
      // 1. Notification للشركة - Account Approved
      {
        recipient: companyId,
        recipientRole: "company",
        sender: adminId,
        senderRole: "admin",
        type: "account_approved",
        title: "🎉 Account Approved!",
        message: "Your company account has been approved by the admin.",
        isRead: false,
      },
      // 2. Notification للشركة - Offer Accepted
      {
        recipient: companyId,
        recipientRole: "company",
        sender: graduateId,
        senderRole: "graduate",
        type: "offer_accepted",
        title: "✅ Offer Accepted!",
        message: "Ahmed Hassan has accepted your job offer for Frontend Developer.",
        isRead: false,
      },
      // 3. Notification للشركة - Offer Rejected
      {
        recipient: companyId,
        recipientRole: "company",
        sender: graduateId,
        senderRole: "graduate",
        type: "offer_rejected",
        title: "❌ Offer Rejected",
        message: "Sara Mohamed has rejected your job offer.",
        isRead: true,
      },
      // 4. Notification للخريج - New Offer
      {
        recipient: graduateId,
        recipientRole: "graduate",
        sender: companyId,
        senderRole: "company",
        type: "new_offer",
        title: "💼 New Job Offer!",
        message: "You have a new job offer for Frontend Developer from Test Company.",
        isRead: false,
      },
      // 5. Notification للشركة - Starred
      {
        recipient: companyId,
        recipientRole: "company",
        sender: adminId,
        senderRole: "admin",
        type: "general",
        title: "⭐ Starred Company!",
        message: "Congratulations! Your company has been starred by the admin.",
        isRead: false,
      },
    ];

    await Notification.insertMany(notifications);
    console.log("✅ Created 5 test notifications");
    console.log("📊 Summary:");
    console.log("   - Company notifications: 4");
    console.log("   - Graduate notifications: 1");
    console.log("   - Unread: 4");
    console.log("   - Read: 1");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedNotifications();
