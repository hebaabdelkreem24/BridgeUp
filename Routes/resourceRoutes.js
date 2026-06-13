import express from "express";

import {
  addResource,
  getResourcesByPhaseId,
  getResourceById,
  updateResource,
  deleteResource,
} from "../Controllers/resourceController.js";
import { protect, allowOnly } from "../Services/authService.js";
const resourceRouter = express.Router();

resourceRouter.post("/:phaseId", protect, allowOnly("admin"), addResource);

resourceRouter.get("/phase/:phaseId", getResourcesByPhaseId);

resourceRouter.get("/:resourceId", getResourceById);

resourceRouter
  .route("/:resourceId")
  .put(protect, allowOnly("admin"), updateResource);

resourceRouter
  .route("/:resourceId")
  .delete(protect, allowOnly("admin"), deleteResource);

export default resourceRouter;
