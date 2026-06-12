import asyncHandler from "express-async-handler";
import {
  getTrackDistributionService,
  getAverageScoresService,
  getCompletionRateService,
  getMostActiveCompaniesService,
  getOverviewService,
} from "../Services/reportService.js";

// @desc    Get track distribution (Frontend vs Backend)
// @route   GET /api/v1/admin/reports/track-distribution
// @access  Private (Admin)
export const getTrackDistribution = asyncHandler(async (req, res) => {
  const data = await getTrackDistributionService();

  res.status(200).json({
    status: "success",
    data,
  });
});

// @desc    Get average assessment scores
// @route   GET /api/v1/admin/reports/average-scores
// @access  Private (Admin)
export const getAverageScores = asyncHandler(async (req, res) => {
  const data = await getAverageScoresService();

  res.status(200).json({
    status: "success",
    data,
  });
});

// @desc    Get assessment completion rate
// @route   GET /api/v1/admin/reports/completion-rate
// @access  Private (Admin)
export const getCompletionRate = asyncHandler(async (req, res) => {
  const data = await getCompletionRateService();

  res.status(200).json({
    status: "success",
    data,
  });
});

// @desc    Get most active companies
// @route   GET /api/v1/admin/reports/most-active-companies
// @access  Private (Admin)
export const getMostActiveCompanies = asyncHandler(async (req, res) => {
  const data = await getMostActiveCompaniesService();

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

// @desc    Get full overview (all reports in one)
// @route   GET /api/v1/admin/reports/overview
// @access  Private (Admin)
export const getOverview = asyncHandler(async (req, res) => {
  const data = await getOverviewService();

  res.status(200).json({
    status: "success",
    data,
  });
});
