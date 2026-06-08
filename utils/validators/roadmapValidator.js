import { check } from "express-validator";

import { validatorMiddelware } from "../Middelwares/validatorMiddelware.js";
import Roadmap from "../../Models/roadmapModel.js";

export const createRoadmapValidator = [
  check("track")
    .notEmpty()
    .withMessage("Track is required")
    .isIn(["Frontend", "Backend"])
    .withMessage("Track must be either Frontend or Backend")
    .custom(async (value) => {
      const roadmap = await Roadmap.findOne({ track: value });
      if (roadmap) {
        throw new Error("Roadmap with this track already exists");
      }
    }),
  validatorMiddelware,
];
