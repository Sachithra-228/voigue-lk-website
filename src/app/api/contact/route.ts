import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendNotification } from "@/lib/email";
import { requireAdmin } from "@/lib/auth";
import { contactSchema } from "@/lib/validations/forms";
import ContactSubmission from "@/models/ContactSubmission";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Honeypot: real visitors never see or fill this field.
  if (body && typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });

  try {
    await connectToDatabase();
    const doc = await ContactSubmission.create(parsed.data);
    try {
      const { firstName, lastName, email, phone, message } = parsed.data;
      await sendNotification(
        "New Voigue.lk enquiry",
        `${firstName} ${lastName} <${email}>${phone ? ` / ${phone}` : ""}\n\n${message}`
      );
    } catch {
      // The enquiry is saved; a failed notification must not fail the visitor's submission.
    }
    return NextResponse.json({ id: doc._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Contact storage is not configured" }, { status: 503 });
  }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const docs = await ContactSubmission.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
