import express from "express";
import dotenv from "dotenv";
import globalError from "./Middelwares/errorMiddelware.js";
import { connectDB } from "./config/database.js";
import authRouter from "./Routes/authRoute.js";
dotenv.config({ path: "./config.env" });
import { protect } from "./Middelwares/authMiddelware.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config({ path: "./config.env" });
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

// Connect to MongoDB

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);

// Serve static files from the "uploads" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Error Handling Midleware for express
app.use(globalError);

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

export default app;