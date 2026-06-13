import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Roadmap =
  mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
