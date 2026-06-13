import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema(
  {
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter phase title"],
      minlength: [3, "Phase title must be at least 3 characters"],
      maxlength: [100, "Phase title must be less than 100 characters"],
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const Phase = mongoose.models.Phase || mongoose.model("Phase", phaseSchema);
export default Phase;