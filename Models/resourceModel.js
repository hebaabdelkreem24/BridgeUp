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

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;