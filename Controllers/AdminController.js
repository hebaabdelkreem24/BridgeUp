import asyncHandler from "express-async-handler";
import {
  getStatsService,
  getAllGraduatesService,
  getCompaniesDashboardService,
  getAllGraduateswithFiltersService,
} from "../Services/adminService.js";

// @desc    Get platform statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
export const getStats = asyncHandler(async (req, res) => {
  const data = await getStatsService();

  res.status(200).json({
    status: "success",
    data,
  });
});

// @desc    Get all graduates with scores + pagination
// @route   GET /api/v1/admin/graduates
// @access  Private (Admin only)
export const getAllGraduates = asyncHandler(async (req, res) => {
  const result = await getAllGraduatesService(req.query);

  res.status(200).json({
    status: "success",
    ...result,
  });
});

//  @desc    Get companies dashboard data
//  @route   GET /api/v1/admin/companies-dashboard
//  @access  Private (Admin only)
export const getCompaniesDashboardController = async (req, res, next) => {
  try {
    const data = await getCompaniesDashboardService();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all graduates with filters + pagination
// @route   GET /api/v1/admin/all-graduates
// @access  Private (Admin only)
export const getAllGraduatesWithFilters = asyncHandler(async (req, res) => {
  const data = await getAllGraduateswithFiltersService(req.query);

  res.status(200).json({
    status: "success",
    ...data,
  });
});
