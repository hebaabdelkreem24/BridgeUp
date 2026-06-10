import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Offer must belong to a company"],
    },

    graduate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Graduate",
      required: [true, "Offer must be sent to a graduate"],
    },

    position: {
      type: String,
      required: [true, "Please enter the job position"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Please enter a message for the graduate"],
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent a company from sending duplicate offers to the same graduate
offerSchema.index({ company: 1, graduate: 1 }, { unique: true });

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);

export default Offer;