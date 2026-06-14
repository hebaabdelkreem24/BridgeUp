import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  track: {
    type: String,
    default: "",
  },

  description: String,
  duration: String,
  numberOfQuestions: {
    type: Number,
    required: true,
  },
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
