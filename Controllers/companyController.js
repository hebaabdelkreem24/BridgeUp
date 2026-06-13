import asyncHandler from "express-async-handler";
import Company from "../Models/companyModel.js";
import Graduate from "../Models/graduateModel.js";
import Assessment from "../Models/assessmentModel.js";
import Shortlist from "../Models/shortlistcompModel.js";
import ApiError from "../utils/apiError.js";

export const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = req.user;

  const totalGraduates = await Graduate.countDocuments();
  const frontendCount = await Graduate.countDocuments({ track: "Frontend" });
  const backendCount = await Graduate.countDocuments({ track: "Backend" });

  res.status(200).json({
    status: "success",
    data: {
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        companySize: company.companySize,
        description: company.description,
        commercialRegister: company.commercialRegister,
        taxCard: company.taxCard,
        isApproved: company.isApproved,
        isStarred: company.isStarred,
        createdAt: company.createdAt,
      },
      stats: {
        totalGraduates,
        frontendGraduates: frontendCount,
        backendGraduates: backendCount,
      },
    },
  });
});

export const updateCompanyProfile = asyncHandler(async (req, res, next) => {
  const company = req.user;
  const allowedUpdates = [
    "companyName",
    "email",
    "phone",
    "website",
    "location",
    "industry",
    "companySize",
    "description",
  ];
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  const updatedCompany = await Company.findByIdAndUpdate(
    company._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");
  res.status(200).json({
    status: "success",
    data: {
      company: updatedCompany,
    },
  });
});

export const getAllGraduates = asyncHandler(async (req, res) => {
  const {
    track,
    minEnglishScore,
    minTechnicalScore,
    minIQScore,
    gender,
    graduationYear,
  } = req.query;

  const query = {};

  if (track) query.track = track;
  if (gender) query.gender = gender;
  if (graduationYear) query.graduationYear = parseInt(graduationYear);

let graduates = await Graduate.find(query)
    .select("-password -passwordResetCode -passwordResetExpiredAt -passwordResetVerified")
    .sort("-createdAt")
    .lean();

  // Step 3: جلب الـ Assessments
  const graduateIds = graduates.map(g => g._id);

      console.log("=== DEBUG ===");
    console.log("Graduate IDs:", graduateIds);
    console.log("Graduate IDs[0] type:", typeof graduateIds[0]);
    

  const assessments = await Assessment.find({
    graduate: { $in: graduateIds }
  }).lean();


  
  // Step 4: ربط الـ scores بالخريجين
  const assessmentMap = {};
  assessments.forEach(a => {
    const gradId = a.graduate?._id ? String(a.graduate._id) : String(a.graduate);
        assessmentMap[gradId] = a;
  });

  graduates = graduates.map(g => {
    const assessment = assessmentMap[String(g._id)] || {};
    return {
      ...g,
      iqScore: assessment.iqScore || 0,
      englishScore: assessment.englishScore || 0,
      technicalScore: assessment.technicalScore || 0,
      assessmentStatus: assessment.status === "Completed" ? "completed": "pending",
    };
  });

  // Step 5: فلترة بالـ scores
  if (minEnglishScore) {
    graduates = graduates.filter(g => g.englishScore >= parseInt(minEnglishScore));
  }
  if (minTechnicalScore) {
    graduates = graduates.filter(g => g.technicalScore >= parseInt(minTechnicalScore));
  }
  if (minIQScore) {
    graduates = graduates.filter(g => g.iqScore >= parseInt(minIQScore));
  }

  res.status(200).json({
    status: "success",
    results: graduates.length,
    data: { graduates },
  });
});


export const addToShortlist = asyncHandler(async (req, res, next) => {
  const company = req.user._id;
  const { graduateId } = req.params;

  const graduate = await Graduate.findById(graduateId);
  if (!graduate) {
    return next(new ApiError("Graduate not found", 404));
  }
  const shortlist = await Shortlist.create({
    company,
    graduate: graduateId,
  });
  res.status(200).json({
    status: "success",
    data: { shortlist },
  });
});

export const removeFromShortlist = asyncHandler(async (req, res, next) => {
  const company = req.user._id;
  const { graduateId } = req.params;
  const shortlistRemove = await Shortlist.findOneAndDelete({
    company,
    graduate: graduateId,
  });
  if (!shortlistRemove) {
    return next(new ApiError("Graduate not found in shortlist", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Graduate removed from shortlist",
  });
});

export const getShortlisted = asyncHandler(async (req, res) => {
  const company = req.user._id;
  const shortlists = await Shortlist.find({ company })
    .populate("graduate", "-password -passwordResetCode -passwordResetExpiredAt -passwordResetVerified")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: shortlists.length,
    data: { shortlists },
  });
});