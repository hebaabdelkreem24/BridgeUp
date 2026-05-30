import express from "express";
import dotenv from "dotenv";
import globalError from "./Middelwares/errorMiddelware.js";
import { connectDB } from "./config/database.js";
import authRouter from "./Routes/authRoute.js";
import { protect } from "./Middelwares/authMiddelware.js";
import { fileURLToPath } from "url";
import path from "path";
import cors from 'cors';
import adminRoutes from "./Routes/adminRoutes.js";
import companyRoutes from "./Routes/companyRoutes.js";
dotenv.config({ path: ".env" });
console.log("JWT_SECRET from env:", process.env.JWT_SECRET_KEY);

const app = express();
// Connect to MongoDB

connectDB();


app.use(cors());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/company", companyRoutes);

// Serve static files from the "uploads" directory

// Global Error Handling Midleware for express
app.use(globalError);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// export default app;
