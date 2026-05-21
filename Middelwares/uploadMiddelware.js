import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../utils/apiError.js";

// تأكدي إن مجلد uploads موجود
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        "Invalid file type. Only PDF, JPG, PNG, and DOC/DOCX files are allowed",
        400,
      ),
      false,
    );
  }
};

// Graduate: ملف واحد بس (CV) - max 5MB
export const uploadSingleFile = (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single("cv");

  upload(req, res, (err) => {
    if (err) {
      console.log("=== MULTER ERROR ===", err);
      return next(new ApiError(err.message, 400));
    }
    console.log("=== AFTER MULTER ===", req.body);
    console.log("=== FILE ===", req.file);
    next();
  });
};

// Company: ملفين (commercialRegister + taxCard) - max 10MB each
export const uploadCompanyFiles = (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }).fields([
    { name: "commercialRegister", maxCount: 1 },
    { name: "taxCard", maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log("MULTER ERROR:", err.code, err.message);
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new ApiError(
            "Unexpected file field. Only 'commercialRegister' and 'taxCard' are allowed",
            400,
          ),
        );
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError("File too large. Max size is 10MB", 400));
      }
      return next(new ApiError(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(err);
    }

        // === DEBUG ===
    console.log("=== MULTER SUCCESS ===");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    
    next();
  });
};
