import Roadmap from "../Models/roadMapModel.js";
import Phase from "../Models/phaseModel.js";
import Resource from "../Models/resourceModel.js";
import ApiError from "../utils/apiError.js";

// Only admin can create roadmap. Phases and resources are created via their respective endpoints
export const createRoadmapService = async (data) => {
  const roadmap = await Roadmap.create({
    track: data.track,
  });

  return roadmap;
};

// Get all roadmaps with their phases and resources
export const getRoadmapsService = async () => {
  const roadmaps = await Roadmap.find();

  const roadmapsWithPhases = await Promise.all(
    roadmaps.map(async (roadmap) => {
      const phases = await Phase.find({ roadmap: roadmap._id }).sort("order");

      const phasesWithResources = await Promise.all(
        phases.map(async (phase) => {
          const resources = await Resource.find({ phase: phase._id });

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
    }),
  );

  return roadmapsWithPhases;
};

// Get roadmap by ID with its phases and resources
export const getRoadmapByIdService = async (id) => {
  const roadmap = await Roadmap.findById(id);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const phases = await Phase.find({ roadmap: roadmap._id }).sort("order");

  const phasesWithResources = await Promise.all(
    phases.map(async (phase) => {
      const resources = await Resource.find({ phase: phase._id });

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

// Only admin can update roadmap track. Phases and resources are updated via their respective endpoints
export const updateRoadmapService = async (id, data) => {
  const roadmap = await Roadmap.findById(id);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  roadmap.track = data.track || roadmap.track;
  await roadmap.save();

  return roadmap;
};

// When a roadmap is deleted, we need to delete all its phases and resources as well
export const deleteRoadmapService = async (id) => {
  const roadmap = await Roadmap.findById(id);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const phases = await Phase.find({ roadmap: id });

  const phaseIds = phases.map((p) => p._id);

  await Resource.deleteMany({
    phase: { $in: phaseIds },
  });

  await Phase.deleteMany({ roadmap: id });

  await Roadmap.findByIdAndDelete(id);

  return;
};
