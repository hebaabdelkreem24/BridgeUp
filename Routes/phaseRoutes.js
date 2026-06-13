import express from "express";

import {
  addPhase,
  getPhasesByRoadmapId,
  getPhaseById,
  updatePhase,
  deletePhase,
} from "../Controllers/phaseController.js";

import { allowOnly, protect } from "../Services/authService.js";
const phaseRouter = express.Router();

phaseRouter.post("/:roadmapId", protect, allowOnly("admin"), addPhase);
phaseRouter.get("/:roadmapId/phases", getPhasesByRoadmapId);
phaseRouter.get("/:phaseId", getPhaseById);
phaseRouter.put("/:phaseId", protect, allowOnly("admin"), updatePhase);
phaseRouter.delete("/:phaseId", protect, allowOnly("admin"), deletePhase);

export default phaseRouter;
