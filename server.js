import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import globalError from "./Middelwares/errorMiddelware.js";
import { connectDB } from "./config/database.js";
import { mountRoutes } from "./Routes/indexRoutes.js";

dotenv.config({ path: ".env" });

console.log("JWT_SECRET from env:", process.env.JWT_SECRET_KEY);
connectDB();

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes
mountRoutes(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Error Handling Middleware
app.use(globalError);

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;