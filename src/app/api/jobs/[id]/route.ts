import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { jobSchema } from "@/lib/validations/forms";
import { revalidateCareers } from "@/lib/revalidate";
import Job from "@/models/Job";

type Ctx = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(_: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  try {
    await connectToDatabase();
    const doc = await Job.findById(id).lean();
    return doc ? NextResponse.json(doc) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  const parsed = jobSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid job" }, { status: 400 });

  const { id } = await params;
  try {
    await connectToDatabase();
    const doc = await Job.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateCareers();
    return NextResponse.json(doc);
  } catch (error) {
    const duplicate = (error as { code?: number }).code === 11000;
    return NextResponse.json(
      { error: duplicate ? "Another job already uses this slug" : "Could not update job" },
      { status: duplicate ? 409 : 400 }
    );
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  try {
    await connectToDatabase();
    await Job.findByIdAndDelete(id);
    revalidateCareers();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete job" }, { status: 400 });
  }
}
