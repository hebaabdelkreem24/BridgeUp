import express from "express";

import { protect, allowOnly } from "../Services/authService.js";
import {
  updateAssessment,
  getAssessment,
} from "../Controllers/assessmentController.js";

import {verifySEB} from "../Middelwares/sebVerifyMiddelware.js"

const assessmentRouter = express.Router();

// Update assessment (Admin only)
assessmentRouter.put(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  updateAssessment,
);
// Get assessment results for a graduate (Admin only)
assessmentRouter.get(
  "/:graduateId",
  protect,
  allowOnly("admin"),
  getAssessment,
);
assessmentRouter.get('/start', protect,allowOnly("graduate"),verifySEB, (req, res) => {
    res.json({ message: 'امتحان شغال من SEB ✅' });
});

assessmentRouter.post('/submit', verifySEB, (req, res) => {
});
export default assessmentRouter;
