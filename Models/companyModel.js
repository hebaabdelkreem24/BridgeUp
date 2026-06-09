import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
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
    logo: {
      type: String,
      default: "/uploads/defaultCompanyLogo.png",
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
      enum: ["company"],
      default: "company",
    }, isApproved: {
      type: Boolean,
      default: false, // Admin approval required
    },
    isStarred: {
  type: Boolean,
  default: false
},
isBanned: {
  type: Boolean,
  default: false
},
bannedAt: Date,
rejectionReason: String,
    passwordResetCode: String, // For forgot password functionality
    passwordResetExpiredAt: Date, // Expiration time for password reset code
    passwordResetVerified: Boolean, // To check if the reset code is verified
  },
  { timestamps: true },
);
//companySchema.index({ email: 1 });
companySchema.index({ isApproved: 1 });

companySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
