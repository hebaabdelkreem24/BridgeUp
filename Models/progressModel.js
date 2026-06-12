import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  graduate: { type: mongoose.Schema.Types.ObjectId, ref: "Graduate", required: true },
  track: { type: String, enum: ["Frontend", "Backend"], required: true },
  completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  lastUpdated: { type: Date, default: Date.now },
});

progressSchema.index({ graduate: 1, track: 1 }, { unique: true });

const progressModel = mongoose.models.progress || mongoose.model("progress", progressSchema);
export default progressModel;