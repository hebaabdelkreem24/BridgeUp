import Roadmap from "../Models/roadmapModel.js";
import Phase from "../Models/phaseModel.js";
import Resource from "../Models/resourceModel.js";
import ApiError from "../utils/apiError.js";


export const getRoadmapsService = async () => {
  const roadmaps = await Roadmap.find();

  const roadmapsWithPhases = await Promise.all(
    roadmaps.map(async (roadmap) => {
      const phases = await Phase.find({ roadmap: roadmap._id }).sort("order");

      const phasesWithResources = await Promise.all(
        phases.map(async (phase) => {
          const resources = await Resource.find({ phase: phase._id });

          const docs = resources.filter(
            (resource) => resource.type === "doc"
          ).length;

          const videos = resources.filter(
            (resource) => resource.type === "video"
          ).length;

          return {
            _id: phase._id,
            title: phase.title,
            order: phase.order,
            resources,
            summary: `${docs} docs + ${videos} videos`,
          };
        })
      );

      return {
        _id: roadmap._id,
        track: roadmap.track,
        phases: phasesWithResources,
      };
    })
  );

  return roadmapsWithPhases;
};


export const addPhaseService = async (roadmapId, data) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new ApiError("Roadmap not found", 404);
  }

  return await Phase.create({
    roadmap: roadmapId,
    title: data.title,
    order: data.order,
  });
};

export const updatePhaseService = async (phaseId, data) => {
  const phase = await Phase.findByIdAndUpdate(
    phaseId,
    data,
    { new: true }
  );

  if (!phase) {
    throw new ApiError("Phase not found", 404);
  }

  return phase;
};

export const deletePhaseService = async (phaseId) => {
  const phase = await Phase.findByIdAndDelete(phaseId);

  if (!phase) {
    throw new ApiError("Phase not found", 404);
  }

  await Resource.deleteMany({ phase: phaseId });

  return phase;
};


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

export const updateResourceService = async (resourceId, data) => {
  const resource = await Resource.findByIdAndUpdate(
    resourceId,
    data,
    { new: true }
  );

  if (!resource) {
    throw new ApiError("Resource not found", 404);
  }

  return resource;
};

export const deleteResourceService = async (resourceId) => {
  const resource = await Resource.findByIdAndDelete(resourceId);

  if (!resource) {
    throw new ApiError("Resource not found", 404);
  }

  return resource;
};