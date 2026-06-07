import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;