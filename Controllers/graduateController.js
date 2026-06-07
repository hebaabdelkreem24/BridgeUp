import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";
import Graduate from "../Models/graduateModel.js";


// @desc    Get assessment results for the authenticated graduate
// @route   GET /api/v1/assessments/me
// @access  Private (Graduate only)
export const getAssessmentMe = asyncHandler(async (req, res, next) => {
  const assessment = await Assessment.findOne({ graduate: req.user._id });
  if (!assessment) {
    return next(new ApiError("Assessment not found", 404));
  }
  res.status(200).json({
    success: true,
    data: assessment,
  });
});
