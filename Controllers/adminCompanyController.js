import Company from "../Models/companyModel.js";
import ApiError from "../utils/apiError.js";
import { createNotification } from "../Services/notificationService.js";

// ─── Get All Companies (with filters) ─────────────────
export const getAllCompanies = async (req, res) => {
  const { status, industry } = req.query;

  let filter = {};

  if (status == "approved" || status == "all" || !status) { filter.isApproved = true; }
  if (status == "pending") { filter.isApproved = false; }

  if (industry) {
    filter.industry = industry;
  }

  const companies = await Company.find(filter).select("-password");
  const total = await Company.countDocuments();
  const pendingCount = await Company.countDocuments({ isApproved: false });
  const approvedCount = await Company.countDocuments({ isApproved: true });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const downloadBase = `${baseUrl}/api/v1/download`;

  const companiesWithUrls = companies.map(company => {
    const c = company.toObject();

    if (c.logo && !c.logo.startsWith("http")) {
      c.logo = `${downloadBase}/${c.logo.replace(/^\/uploads\//, '')}`;
    }
    
    if (c.commercialRegister && !c.commercialRegister.startsWith("http")) {
      c.commercialRegister = `${downloadBase}/${c.commercialRegister.replace(/^\/uploads\//, '')}`;
    }
    
    if (c.taxCard && !c.taxCard.startsWith("http")) {
      c.taxCard = `${downloadBase}/${c.taxCard.replace(/^\/uploads\//, '')}`;
    }

    return c;
  });

  res.status(200).json({
    results: companies.length,
    total,
    pending: pendingCount,
    approved: approvedCount,
    companies: companiesWithUrls,
  });
};

// ─── Get Single Company Profile ───────────────────────
export const getCompanyprofile = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const downloadBase = `${baseUrl}/api/v1/download`;
  const c = company.toObject();

  if (c.logo && !c.logo.startsWith("http")) {
  c.logo = `${downloadBase}/${c.logo.replace(/^\/uploads\//, '')}`;
}

if (c.commercialRegister && !c.commercialRegister.startsWith("http")) {
  c.commercialRegister = `${downloadBase}/${c.commercialRegister.replace(/^\/uploads\//, '')}`;
}

if (c.taxCard && !c.taxCard.startsWith("http")) {
  c.taxCard = `${downloadBase}/${c.taxCard.replace(/^\/uploads\//, '')}`;
}

  res.status(200).json({ company: c });
};

// ─── Approve Company + Send Notification ──────────────
export const approveCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  company.isApproved = true;
  await company.save();

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

// ─── Reject Company + DELETE from DB ───────────────
export const rejectCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company) return next(new ApiError("Company not Found", 404));

  await createNotification({
    recipient: company._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "account_rejected",
    title: "❌ Account Rejected",
    message: req.body.reason || "Your company account has been rejected and deleted by the admin.",
  });

  await Company.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "company rejected and deleted successfully" });
};

// ─── Ban Company + DELETE from DB ───────────────────
export const banCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company) return next(new ApiError("Company not Found", 404));

  await createNotification({
    recipient: company._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "account_rejected",
    title: "🚫 Account Banned",
    message: req.body.reason || "Your company account has been banned and deleted by the admin.",
  });

  await Company.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "company banned and deleted successfully" });
};

// ─── Toggle Star Company + Send Notification ──────────
export const toggleStarCompany = async (req, res, next) => {
  const company = await Company.findById(req.params.id).select("-password");
  if (!company) return next(new ApiError("Company not Found", 404));

  company.isStarred = !company.isStarred;
  await company.save();

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

// ─── Delete Company (Manual Delete) ───────────────────
export const deleteCompany = async (req, res, next) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) return next(new ApiError("Company not Found", 404));

  res.status(200).json({ message: "company deleted successfully" });
};

// ─── Contact Single Company (Send Notification) ─────
export const contactCompany = async (req, res, next) => {
  const { message, title } = req.body;

  if (!message || message.trim() === "") {
    return next(new ApiError("Message is required", 400));
  }

  const company = await Company.findById(req.params.id);
  if (!company) return next(new ApiError("Company not Found", 404));

  await createNotification({
    recipient: company._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "general",
    title: title || "📩 Message from Admin",
    message: message,
  });

  res.status(200).json({
    status: "success",
    message: "Notification sent successfully to company",
    data: {
      company: company.companyName,
      sentMessage: message,
    },
  });
};

// ─── Contact All Approved Companies (Send Notification) ─
export const contactAllCompanies = async (req, res, next) => {
  const { message, title } = req.body;

  if (!message || message.trim() === "") {
    return next(new ApiError("Message is required", 400));
  }

  const companies = await Company.find({ isApproved: true }).select("_id companyName");

  if (companies.length === 0) {
    return next(new ApiError("No approved companies found", 404));
  }

  const notifications = [];
  for (const company of companies) {
    const notification = await createNotification({
      recipient: company._id,
      recipientRole: "company",
      sender: req.user._id,
      senderRole: "admin",
      type: "general",
      title: title || "📩 Message from Admin",
      message: message,
    });
    notifications.push(notification);
  }

  res.status(200).json({
    status: "success",
    message: `Notification sent to ${companies.length} companies`,
    data: {
      totalCompanies: companies.length,
      sentMessage: message,
    },
  });
};