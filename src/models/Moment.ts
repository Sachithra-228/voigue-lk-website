import mongoose, { Schema } from "mongoose";

/** A photo in the "Life around here" carousel on the Life at Voigue page. */
const MomentSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Parties", "Events", "Community"], required: true, index: true },
    image: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default mongoose.models.Moment || mongoose.model("Moment", MomentSchema);
