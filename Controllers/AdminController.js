import asyncHandler from "express-async-handler";
import {
  getStatsService,
  getAllGraduatesService,
  getCompaniesDashboardService,
  getAllGraduateswithFiltersService,
} from "../Services/adminService.js";
import Graduate from "../Models/graduateModel.js";
import Assessment from "../Models/assessmentModel.js";
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
    const baseUrl = `${req.protocol}://${req.get("host")}`;
  const result = await getAllGraduatesService(req.query,baseUrl);

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
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const data = await getAllGraduateswithFiltersService(req.query);

  res.status(200).json({
    status: "success",
    ...data,
  });
});

// @desc    Get single graduate by ID (Admin)
// @route   GET /api/v1/admin/graduates/:id
// @access  Private (Admin)
export const getGraduateById = asyncHandler(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const downloadBase = `${baseUrl}/api/v1/download`;

  const graduate = await Graduate.findById(req.params.id)
    .select("-password -passwordResetCode -passwordResetExpiredAt -passwordResetVerified");

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }

  const gradObj = graduate.toObject();

  // URLs
  if (gradObj.cv && !gradObj.cv.startsWith("http")) {
    gradObj.cv = `${downloadBase}/${gradObj.cv.replace(/^\/uploads\//, '')}`;
  }
  if (gradObj.profilePicture && !gradObj.profilePicture.startsWith("http")) {
    gradObj.profilePicture = `${downloadBase}/${gradObj.profilePicture.replace(/^\/uploads\//, '')}`;
  }

  // Assessment
  const assessment = await Assessment.findOne({ graduate: req.params.id });

  res.status(200).json({
    status: "success",
    data: {
      ...gradObj,
      stats: {
        iqScore: assessment?.iqScore || 0,
        englishScore: assessment?.englishScore || 0,
        technicalScore: assessment?.technicalScore || 0,
        assessmentStatus: assessment?.status || "Pending"
      }
    }
  });
});