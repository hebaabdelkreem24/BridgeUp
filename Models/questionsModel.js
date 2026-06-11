import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  text: { type: String, required: true },
  grade: { type: Number, required: true },
  answers: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const Questions = mongoose.model("Question", questionSchema);

export default Questions;
