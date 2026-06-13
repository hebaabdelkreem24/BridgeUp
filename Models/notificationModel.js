import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // المستقبل (اللي هيشوف الـ notification)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientRole",
    },
    recipientRole: {
      type: String,
      enum: ["company", "graduate"],
      required: true,
    },
    
    // المرسل (اللي بعت الـ notification)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderRole",
    },
    senderRole: {
      type: String,
      enum: ["admin", "company", "graduate"],
      required: true,
    },
    
    // نوع الـ notification
    type: {
      type: String,
      enum: [
        "account_approved",      // admin → company
        "account_rejected",      // admin → company
        "new_offer",             // company → graduate
        "offer_accepted",        // graduate → company
        "offer_rejected",  
        "general"      // graduate → company
      ],
      required: true,
    },
    
    // عنوان الرسالة
    title: {
      type: String,
      required: true,
    },
    
    // محتوى الرسالة
    message: {
      type: String,
      required: true,
    },
    
    // هل اتقرأت؟
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;