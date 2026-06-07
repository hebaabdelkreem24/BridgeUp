import ApiError from "../utils/apiError.js";
import Assessment from "../Models/AssessmentModel.js";
import Graduate from "../Models/graduateModel.js";

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
