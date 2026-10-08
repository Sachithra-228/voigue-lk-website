import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: String,
    workSetup: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Remote" },
    department: String,
    location: String,
    employmentType: String,
    description: String,
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    salaryRange: String,
    status: { type: String, enum: ["Draft", "Active", "Closed"], default: "Draft", index: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
