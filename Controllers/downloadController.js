import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ApiError from "../utils/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Download any uploaded file (Public) ─────────────────────
export const downloadFile = (req, res, next) => {
  let filename = req.params.filename;

  // Security: prevent directory traversal attacks
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return next(new ApiError("Invalid filename", 400));
  }

  // Only allow specific file extensions
const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"];
  const ext = path.extname(filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return next(new ApiError("File type not allowed", 400));
  }

  // Use same path as server.js static route
  const filePath = path.join(__dirname, "..", "uploads", filename);
  
// في downloadController.js
console.log("=== DEBUG PATHS ===");
console.log("__dirname:", __dirname);
console.log("process.cwd():", process.cwd());
console.log("filename:", filename);
console.log("filePath:", filePath);
  console.log("Looking for file at:", filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log("File NOT found at:", filePath);
    return next(new ApiError("File not found", 404));
  }

  console.log("File FOUND at:", filePath);

  // Set headers to force download
res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);  const mimeTypes = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    next(new ApiError("Error reading file", 500));
  });
};
