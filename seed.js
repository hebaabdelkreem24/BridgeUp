import mongoose from "mongoose";
<<<<<<< HEAD
// import bcrypt from "bcryptjs";
=======
>>>>>>> heba2
import Graduate from "./Models/graduateModel.js";
import Company from "./Models/companyModel.js";
import Admin from "./Models/adminModel.js";
import dotenv from "dotenv";
<<<<<<< HEAD

=======
>>>>>>> heba2
dotenv.config({ path: ".env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Graduate.deleteMany();
    await Company.deleteMany();
    await Admin.deleteMany();

<<<<<<< HEAD
    // Graduate Test User
    // const gradPassword = await bcrypt.hash("12345678", 12);
=======
>>>>>>> heba2
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

<<<<<<< HEAD
    // Company Test User (Approved)
    // const compPassword = await bcrypt.hash("12345678", 12);
=======
>>>>>>> heba2
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

//     // const plainPassword = "admin123";
// console.log("Admin plain password:", plainPassword);
// console.log("Admin hashed password:", adminPassword);

  // const adminPassword = await bcrypt.hash(plainPassword, 12);
await Admin.create({
  fullName: "Super Admin",
  email: "admin@bridgeup.com",
  password: "admin123",
  role: "Admin",
});

    console.log("✅ Test users created!");
    console.log("--- Test Credentials ---");
    console.log("Graduate: graduate@test.com / 12345678");
    console.log("Company: company@test.com / 12345678");
    console.log("Admin: admin@bridgeup.com / admin123"); 
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedData();