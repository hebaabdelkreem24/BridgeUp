import asyncHandler from "express-async-handler";
import {
  addResourceService,
  getResourcesByPhaseIdService,
  getResourceByIdService,
  updateResourceService,
  deleteResourceService,
} from "../Services/resourceService.js";

// @desc    Add a resource to a phase
// @route   POST /api/v1/resources/:phaseId
// @access  Private (Admin)
export const addResource = asyncHandler(async (req, res) => {
  const resource = await addResourceService(req.params.phaseId, req.body);

  res.status(201).json({
    status: "success",
    data: resource,
  });
});

// @desc    Get all resources for a given phase ID
// @route   GET /api/v1/resources/phase/:phaseId
// @access  Public
export const getResourcesByPhaseId = asyncHandler(async (req, res) => {
  const resources = await getResourcesByPhaseIdService(req.params.phaseId);

  res.status(200).json({
    status: "success",
    data: resources,
  });
});

// @desc    Get a resource by ID
// @route   GET /api/v1/resources/:resourceId
// @access  Public
export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await getResourceByIdService(req.params.resourceId);

  res.status(200).json({
    status: "success",
    data: resource,
  });
});

// @desc    Update a resource by ID
// @route   PUT /api/v1/resources/:resourceId
// @access  Private (Admin)
export const updateResource = asyncHandler(async (req, res) => {
  const resource = await updateResourceService(req.params.resourceId, req.body);

  res.status(200).json({
    status: "success",
    data: resource,
  });
});

// @desc    Delete a resource by ID
// @route   DELETE /api/v1/resources/:resourceId
// @access  Private (Admin)
export const deleteResource = asyncHandler(async (req, res) => {
  await deleteResourceService(req.params.resourceId);

  res.status(204).send();
});
