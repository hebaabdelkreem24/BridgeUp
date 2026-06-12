import Graduate from "../Models/graduateModel.js";
import Assessment from "../Models/assessmentModel.js";
import ExamAttempt from "../Models/examModel.js";
import Company from "../Models/companyModel.js";
import OfferJob from "../Models/offerJobModel.js";

// ─── 1. Track Distribution ──────────────────────────────
export const getTrackDistributionService = async () => {
  const total = await Graduate.countDocuments();
  const frontend = await Graduate.countDocuments({ track: "Frontend" });
  const backend = await Graduate.countDocuments({ track: "Backend" });

  return {
    frontend: total > 0 ? Math.round((frontend / total) * 100) : 0,
    backend: total > 0 ? Math.round((backend / total) * 100) : 0,
    totalGraduates: total,
  };
};

// ─── 2. Average Assessment Scores ───────────────────────
export const getAverageScoresService = async () => {
  const assessments = await Assessment.find({ status: "Completed" });
  const total = assessments.length;

  if (total === 0) {
    return { iq: 0, english: 0, technical: 0, totalAssessments: 0 };
  }

  const iqSum = assessments.reduce((sum, a) => sum + (a.iqScore || 0), 0);
  const englishSum = assessments.reduce((sum, a) => sum + (a.englishScore || 0), 0);
  const technicalSum = assessments.reduce((sum, a) => sum + (a.technicalScore || 0), 0);

  return {
    iq: Math.round(iqSum / total),
    english: Math.round(englishSum / total),
    technical: Math.round(technicalSum / total),
    totalAssessments: total,
  };
};

// ─── 3. Assessment Completion Rate ──────────────────────
export const getCompletionRateService = async () => {
  const graduates = await Graduate.find().select("_id");
  const total = graduates.length;

  const counts = { completed3: 0, completed2: 0, completed1: 0, completed0: 0 };

  for (const grad of graduates) {
    const attempts = await ExamAttempt.countDocuments({ student: grad._id });
    if (attempts >= 3) counts.completed3++;
    else if (attempts === 2) counts.completed2++;
    else if (attempts === 1) counts.completed1++;
    else counts.completed0++;
  }

  return {
    completed3: {
      count: counts.completed3,
      percentage: total > 0 ? Math.round((counts.completed3 / total) * 100) : 0,
    },
    completed2: {
      count: counts.completed2,
      percentage: total > 0 ? Math.round((counts.completed2 / total) * 100) : 0,
    },
    completed1: {
      count: counts.completed1,
      percentage: total > 0 ? Math.round((counts.completed1 / total) * 100) : 0,
    },
    completed0: {
      count: counts.completed0,
      percentage: total > 0 ? Math.round((counts.completed0 / total) * 100) : 0,
    },
    totalGraduates: total,
  };
};

// ─── 4. Most Active Companies ───────────────────────────
export const getMostActiveCompaniesService = async () => {
  const companies = await OfferJob.aggregate([
    { $group: { _id: "$company", offersSent: { $sum: 1 } } },
    { $sort: { offersSent: -1 } },
    { $limit: 5 },
  ]);

  const result = await Promise.all(
    companies.map(async (c) => {
      const company = await Company.findById(c._id).select("companyName");
      return {
        companyName: company?.companyName || "Unknown",
        offersSent: c.offersSent,
      };
    }),
  );

  return result;
};

// ─── 5. Overview (All-in-One) ─────────────────────────
export const getOverviewService = async () => {
  const totalGraduates = await Graduate.countDocuments();
  const activeCompanies = await Company.countDocuments({ isApproved: true });
  const pendingApprovals = await Company.countDocuments({ isApproved: false });

  // Exams today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const examsToday = await ExamAttempt.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Track distribution
  const frontend = await Graduate.countDocuments({ track: "Frontend" });
  const backend = await Graduate.countDocuments({ track: "Backend" });

  // Average scores
  const assessments = await Assessment.find({ status: "Completed" });
  const totalAssessments = assessments.length;
  const avgScores =
    totalAssessments > 0
      ? {
          iq: Math.round(
            assessments.reduce((sum, a) => sum + (a.iqScore || 0), 0) / totalAssessments,
          ),
          english: Math.round(
            assessments.reduce((sum, a) => sum + (a.englishScore || 0), 0) /
              totalAssessments,
          ),
          technical: Math.round(
            assessments.reduce((sum, a) => sum + (a.technicalScore || 0), 0) /
              totalAssessments,
          ),
        }
      : { iq: 0, english: 0, technical: 0 };

  // Completion rate
  const gradIds = await Graduate.find().select("_id");
  const completionCounts = { completed3: 0, completed2: 0, completed1: 0, completed0: 0 };

  for (const grad of gradIds) {
    const attempts = await ExamAttempt.countDocuments({ student: grad._id });
    if (attempts >= 3) completionCounts.completed3++;
    else if (attempts === 2) completionCounts.completed2++;
    else if (attempts === 1) completionCounts.completed1++;
    else completionCounts.completed0++;
  }

  const totalGrads = gradIds.length;

  // Most active companies
  const activeCompaniesList = await OfferJob.aggregate([
    { $group: { _id: "$company", offersSent: { $sum: 1 } } },
    { $sort: { offersSent: -1 } },
    { $limit: 5 },
  ]);

  const mostActive = await Promise.all(
    activeCompaniesList.map(async (c) => {
      const company = await Company.findById(c._id).select("companyName");
      return {
        companyName: company?.companyName || "Unknown",
        offersSent: c.offersSent,
      };
    }),
  );

  return {
    totalGraduates,
    activeCompanies,
    pendingApprovals,
    examsToday,
    trackDistribution: {
      frontend: totalGraduates > 0 ? Math.round((frontend / totalGraduates) * 100) : 0,
      backend: totalGraduates > 0 ? Math.round((backend / totalGraduates) * 100) : 0,
    },
    averageScores: avgScores,
    completionRate: {
      completed3: {
        count: completionCounts.completed3,
        percentage:
          totalGrads > 0 ? Math.round((completionCounts.completed3 / totalGrads) * 100) : 0,
      },
      completed2: {
        count: completionCounts.completed2,
        percentage:
          totalGrads > 0 ? Math.round((completionCounts.completed2 / totalGrads) * 100) : 0,
      },
      completed1: {
        count: completionCounts.completed1,
        percentage:
          totalGrads > 0 ? Math.round((completionCounts.completed1 / totalGrads) * 100) : 0,
      },
      completed0: {
        count: completionCounts.completed0,
        percentage:
          totalGrads > 0 ? Math.round((completionCounts.completed0 / totalGrads) * 100) : 0,
      },
    },
    mostActiveCompanies: mostActive,
  };
};
