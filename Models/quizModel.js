import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ["IQ", "English", "Frontend","Backend"],
    required: true,
  },
  description: String,
  duration: String,
  numberOfTime: Number,
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
