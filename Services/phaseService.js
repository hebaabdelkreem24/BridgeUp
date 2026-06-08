import Phase from "../Models/phaseModel.js";
import Roadmap from "../Models/roadmapModel.js";
import Resource from "../Models/resourceModel.js";
import ApiError from "../utils/apiError.js";


// Service to add a new phase to a roadmap
export const addPhaseService = async (roadmapId, data) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new ApiError("Roadmap not found", 404);
  }

  const lastPhase = await Phase.findOne({ roadmap: roadmapId })
    .sort({ order: -1 });

  const nextOrder = lastPhase ? lastPhase.order + 1 : 1;

  const phase = await Phase.create({
    roadmap: roadmapId,
    title: data.title,
    order: nextOrder,
  });

  return phase;
};

// Service to get all phases of a roadmap
export const getPhasesByRoadmapIdService = async (roadmapId) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new ApiError("Roadmap not found", 404);
  }
  const phases = await Phase.find({ roadmap: roadmapId }).sort("order");

  return phases;
};

// Service to get a phase by ID
export const getPhaseByIdService = async (phaseId) => {
  const phase = await Phase.findById(phaseId);

  if (!phase) {
    throw new ApiError("Phase not found", 404);
  }
  return phase;
};

// Service to update a phase
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

// Service to delete a phase and its associated resources
export const deletePhaseService = async (phaseId) => {
  const phase = await Phase.findByIdAndDelete(phaseId);

  if (!phase) {
    throw new ApiError("Phase not found", 404);
  }

  await Resource.deleteMany({ phase: phaseId });

  return phase;
};
