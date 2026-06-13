import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";
import Graduate from "../Models/graduateModel.js";
import Question from "../Models/questionsModel.js";
import Quiz from "../Models/quizModel.js"
import ExamAttempt from "../Models/examModel.js"

// Service function to update assessment results for a graduate
export const updateAssessmentService = async (graduateId, data) => {
  const graduate = await Graduate.findById(graduateId);

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }
  data.status = "Completed";
  const assessment = await Assessment.findOneAndUpdate(
    { graduate: graduateId },
    data,
    { new: true },
  );

  if (!assessment) {
    throw new ApiError("Assessment not found", 404);
  }

  return assessment;
};

// Service function to get assessment results for a graduate
export const getAssessmentService = async (graduateId) => {
  const assessment = await Assessment.findOne({ graduate: graduateId });

  if (!assessment) {
    throw new ApiError("Assessment not found", 404);
  }

  return assessment;
};

export const submitExamService = async (quizId, answers, studentId) => {
  const questions = await Question.find({ quiz: quizId });

  let totalScore = 0;
  const gradedAnswers = answers.map((ans) => {
    const question = questions.find((q) => q._id.toString() === ans.questionId);
    if (!question) return { ...ans, isCorrect: false, grade: 0 };

    const correctAnswer = question.answers.find((a) => a.isCorrect);
    const isCorrect = correctAnswer?._id.toString() === ans.answerId;
    const grade = isCorrect ? question.grade : 0;
    totalScore += grade;

    return {
      questionId: ans.questionId,
      answerId: ans.answerId,
      isCorrect,
      grade,
      allAnswers: question.answers.map((a) => ({
        _id: a._id,
        text: a.text,
        isCorrect: a.isCorrect,
      })),
    };
  });

  await ExamAttempt.create({
    student: studentId,
    quiz: quizId,
    answers: gradedAnswers,
    totalScore,
    status: "submitted",
  });

  const quiz = await Quiz.findById(quizId);
  const scoreField =
    quiz.title === "IQ"
      ? "iqScore"
      : quiz.title === "English"
        ? "englishScore"
        : "technicalScore";

  const updatedAssessment = await Assessment.findOneAndUpdate(
    { graduate: studentId },
    { [scoreField]: totalScore },
    { new: true },
  );

  if (
    updatedAssessment.iqScore > 0 &&
    updatedAssessment.englishScore > 0 &&
    updatedAssessment.technicalScore > 0
  ) {
    await Assessment.findOneAndUpdate(
      { graduate: studentId },
      { status: "Completed" },
    );
  }

  return { totalScore, gradedAnswers };
};