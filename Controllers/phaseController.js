import asyncHandler from "express-async-handler";
import {
  addPhaseService,
  getPhasesByRoadmapIdService,
  getPhaseByIdService,
  updatePhaseService,
  deletePhaseService,
} from "../Services/phaseService.js";

// @desc    Add a new phase to a roadmap
// @route   POST /api/v1/roadmaps/:roadmapId/phases
// @access  Private (Admin)
export const addPhase = asyncHandler(async (req, res) => {
  const phase = await addPhaseService(req.params.roadmapId, req.body);

  res.status(201).json({
    status: "success",
    data: phase,
  });
});

// @desc    Get all phases of a roadmap
// @route   GET /api/v1/roadmaps/:roadmapId/phases
// @access  Public
export const getPhasesByRoadmapId = asyncHandler(async (req, res) => {
  const phases = await getPhasesByRoadmapIdService(req.params.roadmapId);

  res.status(200).json({
    status: "success",
    data: phases,
  });
});

// @desc    Get a phase by ID
// @route   GET /api/v1/phases/:phaseId
// @access  Public
export const getPhaseById = asyncHandler(async (req, res) => {
  const phase = await getPhaseByIdService(req.params.phaseId);

  res.status(200).json({
    status: "success",
    data: phase,
  });
});

// @desc    Update a phase
// @route   PUT /api/v1/phases/:phaseId
// @access  Private (Admin)
export const updatePhase = asyncHandler(async (req, res) => {
  const phase = await updatePhaseService(req.params.phaseId, req.body);

  res.status(200).json({
    status: "success",
    data: phase,
  });
});

// @desc    Delete a phase and its associated resources
// @route   DELETE /api/v1/phases/:phaseId
// @access  Private (Admin)
export const deletePhase = asyncHandler(async (req, res) => {
  await deletePhaseService(req.params.phaseId);

  res.status(204).send();
});
