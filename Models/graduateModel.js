import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Please enter your email"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },

    age: {
      type: Number,
      required: [true, "Please enter your age"],
    },

    gender: {
      type: String,
      required: [true, "Please enter your gender"],
      enum: ["Male", "Female"],
    },

    university: {
      type: String,
      required: [true, "Please enter your university"],
    },

    graduationYear: {
      type: Number,
      required: [true, "Please enter your graduation year"],
    },

    track: {
      type: String,
      required: [true, "Please enter your track"],
      enum: ["Frontend", "Backend"],
    },
    role: {
      type: String,
      default: "Graduate",
    },
    cv: String,
    gitHubProfile: String,
    linkedInProfile: String,
    portfolioLink: String,
    passwordResetCode: String, // For forgot password functionality
    passwordResetExpiredAt: Date, // Expiration time for password reset code
    passwordResetVerified: Boolean, // To check if the reset code is verified
  },
  { timestamps: true },
);

const Graduate = mongoose.model("Graduate", graduateSchema);

export default Graduate;
