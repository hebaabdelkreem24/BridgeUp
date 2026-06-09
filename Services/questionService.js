import Question from "../Models/questionsModel.js";

export const uploadQuestionsService = async (
  examId,
  fileBuffer
) => {
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
      exam: examId,
      text: columns[0],
      grade: Number(columns[1]),

      answers: [
        {
          text: columns[2],
          isCorrect:
            columns[3].trim().toLowerCase() === "true",
        },
        {
          text: columns[4],
          isCorrect:
            columns[5].trim().toLowerCase() === "true",
        },
        {
          text: columns[6],
          isCorrect:
            columns[7].trim().toLowerCase() === "true",
        },
        {
          text: columns[8],
          isCorrect:
            columns[9].trim().toLowerCase() === "true",
        },
      ],
    });
  }

  await Question.insertMany(questionsToInsert);

  return questionsToInsert.length;
};