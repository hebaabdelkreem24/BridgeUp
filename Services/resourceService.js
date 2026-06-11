import Resource from "../Models/resourceModel.js";
import Phase from "../Models/phaseModel.js";
import ApiError from "../utils/apiError.js";

// Only admin can add resource to a phase
export const addResourceService = async (phaseId, data) => {
  const phase = await Phase.findById(phaseId);

  if (!phase) {
    throw new ApiError("Phase not found", 404);
  }

  return await Resource.create({
    phase: phaseId,
    title: data.title,
    url: data.url,
    type: data.type,
  });
};

// Get all resources for a given phase ID
export const getResourcesByPhaseIdService = async (phaseId) => {
  const resources = await Resource.find({ phase: phaseId });
  return resources;
};

// Get resource by ID
export const getResourceByIdService = async (resourceId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError("Resource not found", 404);
  }
  return resource;
};

// Only admin can update resource
export const updateResourceService = async (resourceId, data) => {
  const resource = await Resource.findByIdAndUpdate(resourceId, data, {
    new: true,
  });

  if (!resource) {
    throw new ApiError("Resource not found", 404);
  }

  return resource;
};

// Only admin can delete resource
export const deleteResourceService = async (resourceId) => {
  const resource = await Resource.findByIdAndDelete(resourceId);

  if (!resource) {
    throw new ApiError("Resource not found", 404);
  }

  return resource;
};
