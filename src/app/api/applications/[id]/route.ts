import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { applicationStatuses } from "@/lib/validations/forms";
import Application from "@/models/Application";

type Ctx = { params: Promise<{ id: string }> };

/** Admin-only: update an application's review status. */
export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = z.object({ status: z.enum(applicationStatuses) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { id } = await params;
  try {
    await connectToDatabase();
    const doc = await Application.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true }).select("status");
    return doc ? NextResponse.json({ status: doc.status }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not update application" }, { status: 400 });
  }
}
