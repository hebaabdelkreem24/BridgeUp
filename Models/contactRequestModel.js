import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  graduate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Graduate",
    required: true,
  },
  jobTitle: {
    type: String,
    required: [true, "Please enter the job title"],
    trim: true,
  },
}, { timestamps: true });

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);
export default ContactRequest;