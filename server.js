import express from "express";
import dotenv from "dotenv";
import globalError  from "./Middelwares/errorMiddelware.js";
import {connectDB} from "./config/database.js";

dotenv.config({ path: "./config.env" });




connectDB();

const app = express();

app.use(express.json());


// Global Error Handling Middleware for express
app.use(globalError);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});