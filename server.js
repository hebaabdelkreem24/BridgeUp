import express from "express";
import dotenv from "dotenv";
import globalError from "./Middelwares/errorMiddelware.js";
import { connectDB } from "./config/database.js";
import authRouter from "./Routes/authRoute.js";
dotenv.config({ path: "./config.env" });
import userRoutes from "./Routes/userRoutes.js";
import { protect } from "./Midlewares/authMiddelware.js";
import { fileURLToPath } from "url";

dotenv.config({ path: "./config.env" });
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

// Connect to MongoDB

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Serve static files from the "uploads" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is running!" });
});

// Global Error Handling Midleware for express
app.use(globalError);

// Test protected route
app.get("/api/v1/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
