import Graduate from "../Models/graduateModel.js";
import Company from "../models/companyModel.js";
import apiError from "../utils/apiError.js";

// Service function to get platform statistics
export const getStatsService = async () => {
  const now = new Date();

  const [totalGraduates, activeCompanies, pendingApprovals] = await Promise.all(
    [
      Graduate.countDocuments(),
      Company.countDocuments({ isApproved: true }),
      Company.countDocuments({ isApproved: false }),
    ],
  );

  return {
    totalGraduates,
    activeCompanies,
    pendingApprovals,
  };
};

// Service function to get all graduates with scores + pagination
export const getAllGraduatesService = async (query) => {
  const { page = 1, limit = 20 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const matchStage = {
    createdAt: { $gte: sevenDaysAgo },
  };

  const graduates = await Graduate.aggregate([
    {
      $match: matchStage,
    },

    {
      $sort: { createdAt: -1 },
    },

    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },

    {
      $lookup: {
        from: "assessments",
        localField: "_id",
        foreignField: "graduate",
        as: "assessment",
      },
    },

    {
      $unwind: {
        path: "$assessment",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        fullName: 1,
        track: 1,
        profilePicture: 1,
        email: 1,
        createdAt: 1,

        scores: {
          iq: { $ifNull: ["$assessment.iqScore", 0] },
          english: { $ifNull: ["$assessment.englishScore", 0] },
          technical: { $ifNull: ["$assessment.technicalScore", 0] },
          status: { $ifNull: ["$assessment.status", "Pending"] },
        },
      },
    },
  ]);

  const total = await Graduate.countDocuments(matchStage);

  return {
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    results: graduates.length,
    data: graduates,
  };
};
// Service function to get all Companies for admin dashboard
export const getCompaniesDashboardService = async () => {
  const now = new Date();

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const approvedRecentCompanies = await Company.find({
    isApproved: true,
    createdAt: { $gte: sevenDaysAgo },
  })
    .select("companyName email industry phone createdAt isApproved")
    .sort("-createdAt");

  return {
    approvedRecentCompanies,
    count: approvedRecentCompanies.length,
  };
};

// Service function to get all Graduates for admin dashboard
export const getAllGraduateswithFiltersService = async (query) => {
  const {
    page = 1,
    limit = 20,
    track,
    gender,
    graduationYear,
    minIQ,
    minEnglish,
    minTechnical,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const matchStage = {};

  if (track) matchStage.track = track;
  if (gender) matchStage.gender = gender;
  if (graduationYear) matchStage.graduationYear = Number(graduationYear);

  const graduates = await Graduate.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "assessments",
        localField: "_id",
        foreignField: "graduate",
        as: "assessment",
      },
    },

    {
      $unwind: {
        path: "$assessment",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $match: {
        ...(minIQ && { "assessment.iqScore": { $gte: Number(minIQ) } }),
        ...(minEnglish && {
          "assessment.englishScore": { $gte: Number(minEnglish) },
        }),
        ...(minTechnical && {
          "assessment.technicalScore": { $gte: Number(minTechnical) },
        }),
      },
    },

    { $sort: { createdAt: -1 } },

    { $skip: skip },
    { $limit: Number(limit) },

    {
      $project: {
        fullName: 1,
        track: 1,
        gender: 1,
        graduationYear: 1,
        profilePicture: 1,
        email: 1,
        createdAt: 1,

        scores: {
          iq: { $ifNull: ["$assessment.iqScore", 0] },
          english: { $ifNull: ["$assessment.englishScore", 0] },
          technical: { $ifNull: ["$assessment.technicalScore", 0] },
          status: { $ifNull: ["$assessment.status", "Pending"] },
        },
      },
    },
  ]);

  const total = await Graduate.countDocuments(matchStage);

  return {
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    results: graduates.length,
    data: graduates,
  };
};