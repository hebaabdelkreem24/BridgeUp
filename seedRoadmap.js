import mongoose from "mongoose";
import dotenv from "dotenv";
import Roadmap from "./Models/roadmapModel.js";

dotenv.config({ path: "./.env" });

const frontendTopics = [
  { title: "HTML", order: 1 },
  { title: "CSS", order: 2 },
  { title: "JavaScript", order: 3 },
  { title: "React", order: 4 },
  { title: "State Management (Redux)", order: 5 },
  { title: "Performance Optimization", order: 6 },
];

const backendTopics = [
  { title: "Node.js Basics", order: 1 },
  { title: "Express.js", order: 2 },
  { title: "REST APIs", order: 3 },
  { title: "MongoDB", order: 4 },
  { title: "Authentication (JWT)", order: 5 },
  { title: "Deployment", order: 6 },
];

const seedRoadmap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Roadmap.deleteMany();
    await Roadmap.create([
      { track: "Frontend", topics: frontendTopics },
      { track: "Backend", topics: backendTopics },
    ]);
    console.log("Roadmap seeded successfully");
  } catch (error) {
    console.error("Error seeding roadmap:", error);
  } finally {
    process.exit();
  }
};

seedRoadmap();