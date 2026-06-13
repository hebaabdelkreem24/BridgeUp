import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import {
  updateAssessmentService,
  getAssessmentService,
} from "../Services/assessmentService.js";

// @desc    Update assessment
// @route   PUT /api/assessments/:graduateId
// @access  Private (Admin)
export const updateAssessment = asyncHandler(async (req, res) => {
  const { graduateId } = req.params;
  const assessment = await updateAssessmentService(graduateId, req.body);

  res.status(200).json({
    status: "success",
    data: assessment,
  });
});

// @desc    Get assessment results for a graduate
// @route   GET /api/assessments/:graduateId
// @access  Private (Admin)
export const getAssessment = asyncHandler(async (req, res) => {
  const graduateId = req.params.graduateId.trim();
    console.log("graduateId:", JSON.stringify(graduateId));

  const assessment = await getAssessmentService(graduateId);

  res.status(200).json({
    status: "success",
    data: assessment,
  });
});
