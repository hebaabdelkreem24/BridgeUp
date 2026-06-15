import ApiError from "../utils/apiError.js";
import Assessment from "../Models/assessmentModel.js";
import Graduate from "../Models/graduateModel.js";
import Roadmap from "../Models/roadmapModel.js";
import Phase from "../Models/PhaseModel.js";
import Resource from "../Models/resourceModel.js";

// Get graduate profile
export const getMyProfileService = async (graduateId, baseUrl) => {
  const graduate = await Graduate.findById(graduateId).select(
    "-password -passwordResetCode -passwordResetExpiredAt -passwordResetVerified"
  );

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }

  // Convert to object and add download links for files
  const gradObj = graduate.toObject();
  const downloadBase = baseUrl ? `${baseUrl}/api/v1/download` : "";

  if (gradObj.cv && !gradObj.cv.startsWith("http")) {
    gradObj.cv = `${downloadBase}${gradObj.cv}`;
  }
  if (gradObj.profilePicture && !gradObj.profilePicture.startsWith("http")) {
    gradObj.profilePicture = `${downloadBase}${gradObj.profilePicture}`;
  }

  return gradObj;
};

// Get assessment results for a graduate
export const getAssessmentMeService = async (graduateId) => { 
    const assessment = await Assessment.findOne({ graduate: graduateId });
    if (!assessment) {
        throw new ApiError("Assessment not found", 404);
    }
    return assessment;
};

// Update graduate profile
export const updateMyProfileService = async (graduateId, data) => {
  const graduate = await Graduate.findByIdAndUpdate(
    graduateId,
    {
      fullName: data.fullName,
      phone: data.phone,
      age: data.age,
      university: data.university,
      graduationYear: data.graduationYear,
      profilePicture,
    },
    { new: true, runValidators: true }
  );

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }

  return graduate;
};

// Update graduate documents and links
export const updateDocumentsAndLinksService = async (
  graduateId,
  data,
  file,
  baseUrl
) => {
  const graduate = await Graduate.findById(graduateId);

  if (!graduate) {
    throw new ApiError("Graduate not found", 404);
  }

  if (file) {
    graduate.cv = `/uploads/${file.filename}`;
  }

  if (data.portfolioLink !== undefined) {
    graduate.portfolioLink = data.portfolioLink;
  }

  if (data.linkedInProfile !== undefined) {
    graduate.linkedInProfile = data.linkedInProfile;
  }

  if (data.gitHubProfile !== undefined) {
    graduate.gitHubProfile = data.gitHubProfile;
  }

  await graduate.save();

  // Convert to object and add download links
  const gradObj = graduate.toObject();
  const downloadBase = baseUrl ? `${baseUrl}/api/v1/download` : "";

  if (gradObj.cv && !gradObj.cv.startsWith("http")) {
    gradObj.cv = `${downloadBase}${gradObj.cv}`;
  }
  if (gradObj.profilePicture && !gradObj.profilePicture.startsWith("http")) {
    gradObj.profilePicture = `${downloadBase}${gradObj.profilePicture}`;
  }

  return gradObj;
};

// Get graduate roadmap
export const getMyRoadmapService = async (graduateId) => {
  const graduate = await Graduate.findById(graduateId);

  if (!graduate) {
    throw new Error("Graduate not found");
  }

  const roadmap = await Roadmap.findOne({
    track: graduate.track,
  });

  if (!roadmap) {
    throw new Error(
      `No roadmap found for track: ${graduate.track}`,
    );
  }

  const phases = await Phase.find({
    roadmap: roadmap._id,
  }).sort("order");

  const phasesWithResources = await Promise.all(
    phases.map(async (phase) => {
      const resources = await Resource.find({
        phase: phase._id,
      });

      const docs = resources.filter(
        (resource) => resource.type === "doc",
      ).length;

      const videos = resources.filter(
        (resource) => resource.type === "video",
      ).length;

      return {
        _id: phase._id,
        title: phase.title,
        order: phase.order,
        resources,
        summary: `${docs} docs + ${videos} videos`,
      };
    }),
  );

  return {
    _id: roadmap._id,
    track: roadmap.track,
    phases: phasesWithResources,
  };
};