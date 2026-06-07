import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";

// Get assessment results for a graduate
export const getAssessmentMeService = async (graduateId) => { 
    const assessment = await Assessment.findOne({ graduate: graduateId });
    if (!assessment) {
        throw new ApiError("Assessment not found", 404);
    }
    return assessment;
};