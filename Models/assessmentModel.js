import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    graduate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Graduate",
      required: true,
    },
    iqScore: {
      type: Number,
      min: [0, "IQ score cannot be negative"],
      max: [100, "IQ score cannot exceed 100"],
      default: 0,
    },
    englishScore: {
      type: Number,
      min: [0, "English score cannot be negative"],
      max: [100, "English score cannot exceed 100"],
      default: 0,
    },
    technicalScore: {
      type: Number,
      min: [0, "Technical score cannot be negative"],
      max: [100, "Technical score cannot exceed 100"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

assessmentSchema.pre(/^find/, function () {
  this.populate({path: "graduate", select: "name email profilePicture track"});
})


const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
