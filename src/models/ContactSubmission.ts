import mongoose, { Schema } from "mongoose";

const ContactSubmissionSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: String,
    message: String,
    status: { type: String, enum: ["New", "Open", "Resolved", "Archived"], default: "New", index: true }
  },
  { timestamps: true }
);

export default mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);
