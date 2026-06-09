import { uploadQuestionsService } from "../Services/questionService.js";

export const uploadQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const count = await uploadQuestionsService(
      examId,
      req.file.buffer
    );

    res.status(201).json({
      status: "success",
      message: `${count} questions imported successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};