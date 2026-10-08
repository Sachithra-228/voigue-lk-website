import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import { connectToDatabase } from "@/lib/mongodb";
import { sendNotification } from "@/lib/email";
import { requireAdmin } from "@/lib/auth";
import { applicationSchema, cvLimits } from "@/lib/validations/forms";
import { site } from "@/lib/content";
import Application from "@/models/Application";

export const runtime = "nodejs";

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function validateCv(file: unknown): file is File {
  return file instanceof File && file.size > 0;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Invalid submission", 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get("website") ?? "").trim()) return NextResponse.json({ ok: true }, { status: 201 });

  const fields = Object.fromEntries(
    [...form.entries()].filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
  const parsed = applicationSchema.safeParse(fields);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid application", 400);

  const cv = form.get("cv");
  if (!validateCv(cv)) return fail("Please attach your CV", 400);
  if (cv.size > cvLimits.maxBytes) return fail("Your CV is larger than 4 MB. Please upload a smaller file.", 413);
  const extension = cv.name.slice(cv.name.lastIndexOf(".")).toLowerCase();
  if (!cvLimits.extensions.includes(extension)) return fail("Please upload your CV as a PDF, DOC or DOCX file.", 415);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Application rejected: BLOB_READ_WRITE_TOKEN is not configured");
    return fail("We couldn't accept applications right now. Please email your CV to careers@voigue.com.", 503);
  }

  const data = parsed.data;
  let pathname: string | undefined;
  try {
    await connectToDatabase();

    const safeName = cv.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
    const blob = await put(`cvs/${data.type}/${safeName}`, cv, {
      access: "private",
      addRandomSuffix: true,
      contentType: cvLimits.mimeTypes.includes(cv.type) ? cv.type : "application/octet-stream"
    });
    pathname = blob.pathname;

    const doc = await Application.create({
      ...data,
      cvUrl: blob.url,
      cvPathname: blob.pathname,
      cvFileName: cv.name
    });

    const subject =
      data.type === "role" ? `New application: ${data.jobTitle || data.jobId}` : "New general CV submission";
    const lines =
      data.type === "role"
        ? [`Role: ${data.jobTitle || data.jobId}`, `Name: ${data.name}`, `Email: ${data.email}`, "", data.message]
        : [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Interested in: ${data.roleInterest}`,
            `Preferred setup: ${data.preferredSetup}`,
            "",
            data.message || "(no additional note)"
          ];
    try {
      await sendNotification(subject, `${lines.join("\n")}\n\nCV: ${cv.name} (open it from the admin dashboard)`, process.env.CAREERS_EMAIL_TO || site.emails.careers);
    } catch {
      // The application is saved; a failed notification must not fail the candidate's submission.
    }

    return NextResponse.json({ id: doc._id }, { status: 201 });
  } catch (error) {
    console.error("Application submission failed", error);
    if (pathname) await del(pathname).catch(() => undefined);
    return fail("We couldn't submit your application right now. Please try again or email careers@voigue.com.", 503);
  }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const docs = await Application.find().sort({ createdAt: -1 }).limit(200).select("-cvUrl").lean();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
