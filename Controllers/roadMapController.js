import asyncHandler from "express-async-handler";

import {
  getRoadmapsService,
  createRoadmapService,
  getRoadmapByIdService,
  updateRoadmapService,
  deleteRoadmapService,
} from "../Services/roadMapService.js";

// @desc    Create a new roadmap
// @route   POST /api/v1/roadmaps
// @access  Private (Admin)
export const createRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await createRoadmapService(req.body);

  res.status(201).json({
    status: "success",
    data: roadmap,
  });
});

// @desc    Get all roadmaps with their phases and resources
// @route   GET /api/v1/roadmaps
// @access  Public
export const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await getRoadmapsService();

  res.status(200).json({
    status: "success",
    data: roadmaps,
  });
});

// @desc    Get roadmap by ID
// @route   GET /api/v1/roadmaps/:id
// @access  Public
export const getRoadmapById = asyncHandler(async (req, res) => {
  const roadmap = await getRoadmapByIdService(req.params.id);

  res.status(200).json({
    status: "success",
    data: roadmap,
  });
});

// @desc    Update roadmap by ID
// @route   PUT /api/v1/roadmaps/:id
// @access  Private (Admin)
export const updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await updateRoadmapService(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: roadmap,
  });
});

// @desc    Delete roadmap by ID
// @route   DELETE /api/v1/roadmaps/:id
// @access  Private (Admin)
export const deleteRoadmap = asyncHandler(async (req, res) => {
  await deleteRoadmapService(req.params.id);

  res.status(204).send();
});
