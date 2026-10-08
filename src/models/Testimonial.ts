import mongoose, { Schema } from "mongoose";

/** Employee voices shown on the Life at Voigue page. */
const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: String,
    quote: { type: String, required: true },
    image: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
