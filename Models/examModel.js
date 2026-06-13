import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },

  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  selectedAnswer: {
    type: String,
  },

  isCorrect: {
    type: Boolean,
    default: false,
  },

  grade: {
    type: Number,
    default: 0,
  },
});

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Graduate",
      required: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    answers: [answerSchema],

    totalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["submitted"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);