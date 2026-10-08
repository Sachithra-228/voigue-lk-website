import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema(
  {
    type: { type: String, enum: ["role", "general"], default: "role", index: true },
    jobId: { type: Schema.Types.Mixed, index: true },
    jobTitle: String,
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    message: String,
    roleInterest: String,
    preferredSetup: { type: String, enum: ["Remote", "Hybrid", "On-site"] },
    cvUrl: String,
    cvPathname: String,
    cvFileName: String,
    status: {
      type: String,
      enum: ["New", "Reviewing", "Shortlisted", "Interview", "Rejected", "Hired"],
      default: "New",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
