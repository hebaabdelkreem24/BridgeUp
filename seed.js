import mongoose from "mongoose";
import Graduate from "./Models/graduateModel.js";
import Company from "./Models/companyModel.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Graduate.deleteMany();
    await Company.deleteMany();

    await Graduate.create({
      fullName: "Test Graduate",
      email: "graduate@test.com",
      password: "12345678",
      phone: "01234567890",
      age: 25,
      gender: "Female",
      university: "Cairo University",
      graduationYear: 2024,
      track: "Frontend",
      iqScore: 85,
      englishScore: 90,
      technicalScore: 88,
      role: "graduate",
    });

    await Company.create({
      companyName: "Test Company",
      email: "company@test.com",
      password: "12345678",
      phone: "01234567891",
      industry: "IT",
      description: "Test company",
      commercialRegister: "12345",
      taxCard: "67890",
      isApproved: true,
      role: "company",
    });

    console.log("✅ Test users created!");
    console.log("--- Test Credentials ---");
    console.log("Graduate: graduate@test.com / 12345678");
    console.log("Company: company@test.com / 12345678");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedData();