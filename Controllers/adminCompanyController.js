import Company from "../Models/companyModel.js";
import ApiError from "../utils/apiError.js";
import { createNotification } from "../Services/notificationService.js";

// ─── Get All Companies (with filters) ─────────────────
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

// ─── Get Single Company Profile ───────────────────────
export const getCompanyprofile = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));
  res.status(200).json({ company });
};

// ─── Approve Company + Send Notification ──────────────
export const approveCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  company.isApproved = true;
  await company.save();

  // إرسال notification للشركة
  await createNotification({
    recipient: company._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "account_approved",
    title: "🎉 Account Approved!",
    message: "Your company account has been approved by the admin. You can now access all features.",
  });

  res.status(200).json({ message: "company approved successfully", company });
};

// ─── Reject Company + Send Notification ───────────────
export const rejectCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  company.isApproved = false;
  await company.save();

  // إرسال notification للشركة (BEFORE sending response!)
  await createNotification({
    recipient: company._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "account_rejected",
    title: "❌ Account Rejected",
    message: req.body.reason || "Your company account has been rejected by the admin.",
  });

  // بعت الـ response مرة واحدة بس في الآخر
  res.status(200).json({ message: "company rejected successfully", company });
};

// ─── Toggle Star Company + Send Notification ──────────
export const toggleStarCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  company.isStarred = !company.isStarred;
  await company.save();

  // إرسال notification لو اتعمل star
  if (company.isStarred) {
    await createNotification({
      recipient: company._id,
      recipientRole: "company",
      sender: req.user._id,
      senderRole: "admin",
      type: "general",
      title: "⭐ Starred Company!",
      message: "Congratulations! Your company has been starred by the admin.",
    });
  }

  res.status(200).json({
    message: company.isStarred ? "company starred" : "company unstarred",
    isStarred: company.isStarred,
  });
};

// ─── Get Starred Companies ────────────────────────────
export const getStarredCompanies = async (req, res) => {
  const starredCompanies = await Company.find({ isStarred: true }).select("-password");
  res.status(200).json({
    results: starredCompanies.length,
    starredCompanies,
  });
};