import { z } from "zod";

export const setupOptions = ["Remote", "Hybrid", "On-site"] as const;

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(80),
  lastName: z.string().trim().min(1, "Please enter your last name").max(80),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(3000)
});

const baseApplication = {
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email address")
};

/** Application to a listed role. */
export const roleApplicationSchema = z.object({
  ...baseApplication,
  type: z.literal("role"),
  jobId: z.string().min(1),
  jobTitle: z.string().max(200).optional(),
  message: z.string().trim().min(10, "Tell us a little about yourself (at least 10 characters)").max(4000)
});

/** General CV submission. */
export const generalApplicationSchema = z.object({
  ...baseApplication,
  type: z.literal("general"),
  roleInterest: z.string().trim().min(2, "Tell us what kind of role you're interested in").max(200),
  preferredSetup: z.enum(setupOptions, { message: "Please choose a preferred setup" }),
  message: z.string().trim().max(2000).optional().or(z.literal(""))
});

export const applicationSchema = z.discriminatedUnion("type", [roleApplicationSchema, generalApplicationSchema]);

const lines = z.array(z.string().trim().min(1).max(300)).max(20);

/** Admin job form: also used to validate the jobs API. */
export const jobSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  summary: z.string().trim().max(300).optional().or(z.literal("")),
  workSetup: z.enum(setupOptions),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  employmentType: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().max(6000).optional().or(z.literal("")),
  responsibilities: lines.optional(),
  requirements: lines.optional(),
  status: z.enum(["Draft", "Active", "Closed"]),
  featured: z.boolean().optional()
});

export const applicationStatuses = ["New", "Reviewing", "Shortlisted", "Interview", "Rejected", "Hired"] as const;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const cvLimits = {
  maxBytes: 4 * 1024 * 1024,
  extensions: [".pdf", ".doc", ".docx"],
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
};

export type JobInput = z.infer<typeof jobSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
