import { connectToDatabase } from "@/lib/mongodb";
import { fallbackJobs, fallbackMoments, fallbackPosts, fallbackVoices } from "@/lib/content";
import Job from "@/models/Job";
import BlogPost from "@/models/BlogPost";
import Moment from "@/models/Moment";
import Testimonial from "@/models/Testimonial";
import type { PublicJob, PublicMoment, PublicPost, PublicVoice } from "@/types/content";

/*
 * Each getter returns database content when MongoDB is reachable (even if that is an empty list,
 * so the team can take everything down) and only falls back to placeholder content when the
 * database is not configured or unreachable.
 */

function plain<T>(docs: unknown): T {
  return JSON.parse(JSON.stringify(docs)) as T;
}

export async function getJobs(): Promise<PublicJob[]> {
  try {
    await connectToDatabase();
    const docs = await Job.find({ status: "Active" }).sort({ featured: -1, createdAt: -1 }).lean();
    return plain<PublicJob[]>(docs);
  } catch {
    return fallbackJobs;
  }
}

export async function getPosts(): Promise<PublicPost[]> {
  try {
    await connectToDatabase();
    const docs = await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).lean();
    return docs.length ? plain<PublicPost[]>(docs) : fallbackPosts;
  } catch {
    return fallbackPosts;
  }
}

export async function getPost(slug: string): Promise<PublicPost | null> {
  try {
    await connectToDatabase();
    const doc = await BlogPost.findOne({ slug, published: true }).lean();
    return doc ? plain<PublicPost>(doc) : fallbackPosts.find((post) => post.slug === slug) || null;
  } catch {
    return fallbackPosts.find((post) => post.slug === slug) || null;
  }
}

export async function getVoices(): Promise<PublicVoice[]> {
  try {
    await connectToDatabase();
    const docs = await Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
    return plain<PublicVoice[]>(docs);
  } catch {
    return fallbackVoices;
  }
}

export async function getMoments(): Promise<PublicMoment[]> {
  try {
    await connectToDatabase();
    const docs = await Moment.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
    return plain<PublicMoment[]>(docs);
  } catch {
    return fallbackMoments;
  }
}
