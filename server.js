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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mountRoutes(app);

app.get("/api/v1/graduates/test", (req, res) => {
  res.send("graduates working");
});

app.use(globalError);
console.log("__dirname:", __dirname);
console.log("process.cwd():", process.cwd());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;