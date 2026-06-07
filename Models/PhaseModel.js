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
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Phase = mongoose.model("Phase", phaseSchema);
export default Phase;