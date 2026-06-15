import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";
import Graduate from "../Models/graduateModel.js";
import {
  getMyProfileService,
  getAssessmentMeService,
  updateMyProfileService,
  updateDocumentsAndLinksService,
  getMyRoadmapService,
} from "../Services/graduateService.js";

// @desc    Get graduate profile
// @route   GET /api/v1/graduates/me
// @access  Private (Graduate only)
export const getMyProfile = asyncHandler(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const profile = await getMyProfileService(req.user._id, baseUrl);

  res.status(200).json({
    status: "success",
    data: profile,
  });
});

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

// @desc    Update graduate profile
// @route   PUT /api/v1/graduates/me
// @access  Private (Graduate only)
export const updateMyProfile = async (req, res, next) => {
  try {
    const graduate = await updateMyProfileService(
      req.user._id,
      req.body,
      req.file
    );

    res.status(200).json({
      status: "success",
      data: graduate,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update graduate documents and links
// @route   PUT /api/v1/graduates/me/documents
// @access  Private (Graduate only)
export const updateDocumentsAndLinks = asyncHandler(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const graduate = await updateDocumentsAndLinksService(
    req.user._id,
    req.body,
    req.file,
    baseUrl,
  );

  res.status(200).json({
    status: "success",
    data: graduate,
  });
});

// @desc    Get roadmap for the authenticated graduate
// @route   GET /api/v1/graduates/me/roadmap
// @access  Private (Graduate only)
export const getMyRoadmap = async (req, res, next) => {
  try {
    const roadmap = await getMyRoadmapService(req.user._id);

    res.status(200).json({
      status: "success",
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};