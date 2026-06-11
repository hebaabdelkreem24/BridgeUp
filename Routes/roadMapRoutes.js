import express from "express";

import {
  getRoadmaps,
  createRoadmap,
  getRoadmapById,
  updateRoadmap,
  deleteRoadmap,
} from "../Controllers/roadMapController.js";
import { protect, allowOnly } from "../services/authService.js";

const roadMapRouter = express.Router();

roadMapRouter.get("/", protect, getRoadmaps);
roadMapRouter.post(
  "/create-roadmap",
  protect,
  allowOnly("admin"),
  createRoadmap,
);
roadMapRouter.get("/:id", protect, getRoadmapById);
roadMapRouter
  .route("/:id")
  .put(protect, allowOnly("admin"), updateRoadmap)
  .delete(protect, allowOnly("admin"), deleteRoadmap);

export default roadMapRouter;
