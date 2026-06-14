import Question from "../Models/questionsModel.js";
import Quiz from "../Models/quizModel.js";
import Graduate from "../Models/graduateModel.js";

export const uploadQuestionsService = async (quizId, fileBuffer) => {
  const csvData = fileBuffer.toString("utf-8");

  const rows = csvData
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  const questions = rows.slice(1);

  const questionsToInsert = [];

  for (const row of questions) {
    const columns = row.split(",");

    questionsToInsert.push({
      quiz: quizId,
      text: columns[0],
      grade: Number(columns[1]),

      answers: [
        {
          text: columns[2],
          isCorrect: columns[3].trim().toLowerCase() === "true",
        },
        {
          text: columns[4],
          isCorrect: columns[5].trim().toLowerCase() === "true",
        },
        {
          text: columns[6],
          isCorrect: columns[7].trim().toLowerCase() === "true",
        },
        {
          text: columns[8],
          isCorrect: columns[9].trim().toLowerCase() === "true",
        },
      ],
    });
  }

  await Question.insertMany(questionsToInsert);

  return questionsToInsert.length;
};

export const getAllQuestionsForAdminService = async () => {
  return await Question.find().populate("quiz");
};

export const getGroupedQuestionsService = async () => {
  const quizzes = await Quiz.find();

  const data = await Promise.all(
    quizzes.map(async (quiz) => {
      const questions = await Question.find({ quiz: quiz._id });

      return {
        quiz,
        questions,
      };
    }),
  );

  return data;
};

export const getMyExamsService = async (userTrack) => {
  return await Quiz.find({
    $or: [
      { title: { $in: ["IQ", "English"] } },
      { title: "Technical", track: userTrack },
    ],
  });
};

export const getQuestionsForStudentService = async (quizId, userId) => {
   const user = await Graduate.findById(userId);

   if (!user) throw new Error("User not found");

   const quiz = await Quiz.findById(quizId);

   if (!quiz) throw new Error("Quiz not found");

   if (quiz.title === "Technical" && quiz.track !== user.track) {
     throw new Error("Not allowed to access this quiz");
   }

   const questions = await Question.find({ quiz: quizId });

   return questions.map((q) => ({
     _id: q._id,
     text: q.text,
     grade: q.grade,
     answers: q.answers.map((a) => ({
       _id: a._id,
       text: a.text,
     })),
   }));
 };

export const deleteQuestionService = async (questionId) => {
   const deletedQuestion = await Question.findByIdAndDelete(questionId);

   if (!deletedQuestion) {
     throw new Error("Question not found");
   }

   return deletedQuestion;
};
