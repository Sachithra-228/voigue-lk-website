import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Application from "@/models/Application";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Admin-only: streams a candidate's CV out of the private blob store. */
export async function GET(_: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await connectToDatabase();
    const application = await Application.findById(id).select("cvPathname cvFileName").lean<{
      cvPathname?: string;
      cvFileName?: string;
    }>();
    if (!application?.cvPathname) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const result = await get(application.cvPathname, { access: "private" });
    if (!result || result.statusCode !== 200) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fileName = (application.cvFileName || "cv").replace(/[^a-zA-Z0-9._-]+/g, "_");
    return new Response(result.stream, {
      headers: {
        "content-type": result.blob.contentType,
        "content-disposition": `attachment; filename="${fileName}"`,
        "cache-control": "private, no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "Could not load CV" }, { status: 503 });
  }
}
