import ExamAttempt from "../Models/examModel.js";
import Question from "../Models/questionsModel.js";

export const submitExamService = async (quizId, studentId, userAnswers) => {
  
  const questions = await Question.find({ quiz: quizId });

  console.log(questions.map(q => ({
  q: q._id,
  answers: q.answers.map(a => a._id)
})));
  const questionMap = new Map(
    questions.map((q) => [q._id.toString(), q])
  );

  let totalScore = 0;

  const formattedAnswers = userAnswers.map((userAnswer) => {
    const question = questionMap.get(userAnswer.questionId);

    if (!question) {
      return {
        questionId: userAnswer.questionId,
        answerId: userAnswer.answerId,
        selectedAnswer: userAnswer.selectedAnswer || null,
        isCorrect: false,
        grade: 0,
      };
    }

    const selected = question.answers.find(
      (a) => a._id.toString() === userAnswer.answerId
    );

    const isCorrect = selected?.isCorrect || false;

    const grade = isCorrect ? question.grade : 0;

    if (isCorrect) totalScore += question.grade;

    return {
      questionId: question._id,
      answerId: userAnswer.answerId,
      selectedAnswer: selected?.text || null,
      isCorrect,
      grade,
    };
  });

  return await ExamAttempt.create({
    student: studentId,
    quiz: quizId,
    answers: formattedAnswers,
    totalScore,
    status: "submitted",
  });
};
