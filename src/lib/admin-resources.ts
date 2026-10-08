import { crudHandlers } from "@/lib/admin-crud";
import { revalidateBlog, revalidateLife } from "@/lib/revalidate";
import { momentSchema, postSchema, voiceSchema } from "@/lib/validations/forms";
import BlogPost from "@/models/BlogPost";
import Moment from "@/models/Moment";
import Testimonial from "@/models/Testimonial";

export const voices = crudHandlers({
  model: Testimonial,
  schema: voiceSchema,
  revalidate: revalidateLife,
  label: "employee voice"
});

export const moments = crudHandlers({
  model: Moment,
  schema: momentSchema,
  revalidate: revalidateLife,
  label: "gallery photo"
});

export const posts = crudHandlers({
  model: BlogPost,
  schema: postSchema,
  revalidate: revalidateBlog,
  label: "blog post",
  // Stamp the publish date the first time a post goes live and keep it on later edits.
  prepare: (data, existing) => ({
    ...data,
    publishedAt: data.published ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt
  })
});
