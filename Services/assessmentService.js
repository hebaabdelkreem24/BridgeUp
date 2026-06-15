import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";
import Graduate from "../Models/graduateModel.js";
import Question from "../Models/questionsModel.js";
import Quiz from "../Models/quizModel.js";
import ExamAttempt from "../Models/examModel.js";

// Update assessment results for a graduate
export const updateAssessmentService = async (graduateId, data) => {
  const graduate = await Graduate.findById(graduateId);

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }

  data.status = "Completed";

  const assessment = await Assessment.findOneAndUpdate(
    { graduate: graduateId },
    data,
    { new: true }
  );

  if (!assessment) {
    throw new ApiError("Assessment not found", 404);
  }

  return assessment;
};

// Get assessment results for a graduate
export const getAssessmentService = async (graduateId) => {
  const assessment = await Assessment.findOne({ graduate: graduateId });

  if (!assessment) {
    throw new ApiError("Assessment not found", 404);
  }

  return assessment;
};

// Submit exam + calculate correct/wrong + prevent repeated attempts
export const submitExamService = async (quizId, answers, studentId) => {
  const oldAttempt = await ExamAttempt.findOne({
    student: studentId,
    quiz: quizId,
  });

  if (oldAttempt) {
    throw new ApiError("You already submitted this exam before", 400);
  }

  const questions = await Question.find({ quiz: quizId });

  if (!questions || questions.length === 0) {
    throw new ApiError("No questions found for this exam", 404);
  }

  let totalScore = 0;

  const gradedAnswers = answers.map((ans) => {
    const question = questions.find(
      (q) => q._id.toString() === ans.questionId
    );

    if (!question) {
      return {
        ...ans,
        isCorrect: false,
        grade: 0,
      };
    }

    const correctAnswer = question.answers.find((a) => a.isCorrect);

    const isCorrect =
      correctAnswer?._id.toString() === ans.answerId.toString();

    const grade = isCorrect ? question.grade : 0;

    totalScore += grade;

    return {
      questionId: ans.questionId,
      answerId: ans.answerId,
      correctAnswerId: correctAnswer?._id,
      isCorrect,
      grade,
      allAnswers: question.answers.map((a) => ({
        _id: a._id,
        text: a.text,
        isCorrect: a.isCorrect,
      })),
    };
  });

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    throw new ApiError("Quiz not found", 404);
  }

  await ExamAttempt.create({
    student: studentId,
    quiz: quizId,
    answers: gradedAnswers,
    totalScore,
    status: "submitted",
  });

  const title = quiz.title?.toLowerCase();

  const scoreField =
    title?.includes("iq")
      ? "iqScore"
      : title?.includes("english")
      ? "englishScore"
      : "technicalScore";

  let assessment = await Assessment.findOne({ graduate: studentId });

  if (!assessment) {
    assessment = await Assessment.create({
      graduate: studentId,
      iqScore: 0,
      englishScore: 0,
      technicalScore: 0,
      status: "Pending",
    });
  }

  assessment[scoreField] = totalScore;

  if (
    assessment.iqScore > 0 &&
    assessment.englishScore > 0 &&
    assessment.technicalScore > 0
  ) {
    assessment.status = "Completed";
  }

  await assessment.save();

  return {
    totalScore,
    gradedAnswers,
    scoreField,
  };
};