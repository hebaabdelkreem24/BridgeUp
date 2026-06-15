import express from "express";
import { downloadFile } from "../Controllers/downloadController.js";

const router = express.Router();

// Handle both /filename and /uploads/filename patterns
router.get("/:filename", downloadFile);

export default router;