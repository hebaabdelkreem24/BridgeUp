import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ["IQ", "English", "Technical"],
    required: true,
  },

  track: {
    type: String,
    enum: ["Frontend", "Backend"],
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
