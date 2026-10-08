import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { fallbackJobs } from "@/lib/content";
import { jobSchema } from "@/lib/validations/forms";
import { revalidateCareers } from "@/lib/revalidate";
import Job from "@/models/Job";

export async function GET() {
  try {
    await connectToDatabase();
    const docs = await Job.find({ status: "Active" }).sort({ featured: -1, createdAt: -1 }).lean();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json(fallbackJobs);
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = jobSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid job" }, { status: 400 });

  try {
    await connectToDatabase();
    const doc = await Job.create(parsed.data);
    revalidateCareers();
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    const duplicate = (error as { code?: number }).code === 11000;
    return NextResponse.json(
      { error: duplicate ? "Another job already uses this slug" : "Could not create job" },
      { status: duplicate ? 409 : 400 }
    );
  }
}
