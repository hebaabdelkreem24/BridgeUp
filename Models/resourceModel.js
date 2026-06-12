import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter resource title"],
      minlength: [3, "Resource title must be at least 3 characters"],
      maxlength: [100, "Resource title must be less than 100 characters"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please enter resource URL"],
    },
    type: {
      type: String,
      enum: ["video", "doc", "article"],
      required: true,
    },
  },
  { timestamps: true }
);

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;