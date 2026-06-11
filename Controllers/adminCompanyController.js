import Company from "../Models/companyModel.js";
import ApiError from "../utils/apiError.js";

export const getAllCompanies = async (req, res) => {
  const { status, industry } = req.query;

  let filter = {};

  if (status == "approved") { filter.isApproved = true; }
  if (status == "pending") { filter.isApproved = false; }

  if (industry) {
    filter.industry = industry;
  }

  const companies = await Company.find(filter).select("-password");
  const total = await Company.countDocuments();
  const pendingCount = await Company.countDocuments({ isApproved: false });
  const approvedCount = await Company.countDocuments({ isApproved: true });

  res.status(200).json({
    results: companies.length,
    total,
    pending: pendingCount,
    approved: approvedCount,
    companies,
  });
};

export const getCompanyprofile = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));
  res.status(200).json({ company });
};

export const approveCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));
  company.isApproved = true;
  await company.save();
  res.status(200).json({ message: "company approved successfully", company });
};

export const rejectCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));
  company.isApproved = false;
  await company.save();
  res.status(200).json({ message: "company rejected successfully", company });
};

export const toggleStarCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));
  company.isStarred = !company.isStarred;
  await company.save();
  res.status(200).json({
    message: company.isStarred ? "company starred" : "company unstarred",
    isStarred: company.isStarred,
  });
};

export const getStarredCompanies = async (req, res) => {
  const starredCompanies = await Company.find({ isStarred: true }).select("-password");
  res.status(200).json({
    results: starredCompanies.length,
    starredCompanies,
  });
};