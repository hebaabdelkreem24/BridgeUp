import mongoose from "mongoose";
import Graduate from "./Models/graduateModel.js";
import Assessment from "./Models/assessmentModel.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const graduatesData = [
  {
    fullName: "Ahmed Hassan",
    email: "ahmed@test.com",
    password: "12345678",
    phone: "01234567890",
    age: 25,
    gender: "Male",
    university: "Cairo University",
    graduationYear: 2024,
    track: "Frontend",
    assessment: { iqScore: 85, englishScore: 90, technicalScore: 88, status: "Completed" },
  },
  {
    fullName: "Sara Mohamed",
    email: "sara@test.com",
    password: "12345678",
    phone: "01234567891",
    age: 23,
    gender: "Female",
    university: "Ain Shams University",
    graduationYear: 2024,
    track: "Frontend",
    assessment: { iqScore: 92, englishScore: 95, technicalScore: 90, status: "Completed" },
  },
  {
    fullName: "Omar Khaled",
    email: "omar@test.com",
    password: "12345678",
    phone: "01234567892",
    age: 26,
    gender: "Male",
    university: "Alexandria University",
    graduationYear: 2023,
    track: "Backend",
    assessment: { iqScore: 78, englishScore: 80, technicalScore: 85, status: "Completed" },
  },
  {
    fullName: "Nour Ibrahim",
    email: "nour@test.com",
    password: "12345678",
    phone: "01234567893",
    age: 24,
    gender: "Female",
    university: "Mansoura University",
    graduationYear: 2024,
    track: "Backend",
    assessment: { iqScore: 88, englishScore: 85, technicalScore: 92, status: "Completed" },
  },
  {
    fullName: "Youssef Ali",
    email: "youssef@test.com",
    password: "12345678",
    phone: "01234567894",
    age: 25,
    gender: "Male",
    university: "Cairo University",
    graduationYear: 2023,
    track: "Frontend",
    assessment: { iqScore: 70, englishScore: 75, technicalScore: 80, status: "Completed" },
  },
  {
    fullName: "Mariam Tarek",
    email: "mariam@test.com",
    password: "12345678",
    phone: "01234567895",
    age: 22,
    gender: "Female",
    university: "Ain Shams University",
    graduationYear: 2024,
    track: "Frontend",
    assessment: { iqScore: 95, englishScore: 98, technicalScore: 94, status: "Completed" },
  },
  {
    fullName: "Khaled Samir",
    email: "khaled@test.com",
    password: "12345678",
    phone: "01234567896",
    age: 27,
    gender: "Male",
    university: "Zagazig University",
    graduationYear: 2022,
    track: "Backend",
    assessment: { iqScore: 82, englishScore: 78, technicalScore: 88, status: "Completed" },
  },
  {
    fullName: "Laila Ahmed",
    email: "laila@test.com",
    password: "12345678",
    phone: "01234567897",
    age: 23,
    gender: "Female",
    university: "Cairo University",
    graduationYear: 2024,
    track: "Frontend",
    assessment: { iqScore: 90, englishScore: 92, technicalScore: 89, status: "Completed" },
  },
];

const seedGraduates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // امسحي القديم
    await Graduate.deleteMany();
    await Assessment.deleteMany();
    console.log("🗑️ Deleted old data");

    for (const gradData of graduatesData) {
      const { assessment, ...gradInfo } = gradData;

      // إنشاء Graduate
      const graduate = await Graduate.create({
        ...gradInfo,
        role: "graduate",
      });

      // إنشاء Assessment
      await Assessment.create({
        graduate: graduate._id,
        ...assessment,
      });

      console.log(`✅ Created: ${gradInfo.fullName} - IQ:${assessment.iqScore} EN:${assessment.englishScore} Tech:${assessment.technicalScore}`);
    }

    console.log("\n🎉 All graduates seeded successfully!");
    console.log(`Total: ${graduatesData.length} graduates`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedGraduates();