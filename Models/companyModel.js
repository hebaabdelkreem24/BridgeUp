import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please enter your company name"],
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
      minLength: [6, "Password must be at least 6 characters long"],
    },

    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },

    industry: {
      type: String,
      required: [true, "Please enter your industry"],
    },

    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    // Required Documents
    commercialRegister: {
      type: String,
      required: [true, "Please enter your commercial register number"],
    },
    taxCard: {
      type: String,
      required: [true, "Please enter your tax card number"],
    },
    // Meta
    role: {
      type: String,
      default: "Company",
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval required
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
