import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      enum: ["Frontend", "Backend"],
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Roadmap =
  mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
