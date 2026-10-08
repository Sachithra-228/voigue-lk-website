import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { imageUpload } from "@/lib/validations/forms";

export const runtime = "nodejs";

/** Identify the real image type from the file's first bytes; the browser-supplied type is not trusted. */
function sniff(bytes: Uint8Array): { type: string; ext: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { type: "image/jpeg", ext: "jpg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { type: "image/png", ext: "png" };
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return { type: "image/webp", ext: "webp" };
  return null;
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Admin-only: stores a photo in the private Blob store and returns the path the site serves it from. */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return fail("Unauthorized", 401);

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "");
  if (!(file instanceof File) || file.size === 0) return fail("Please choose an image", 400);
  if (!(imageUpload.kinds as readonly string[]).includes(kind)) return fail("Invalid upload type", 400);
  if (file.size > imageUpload.maxBytes) return fail("The image is larger than 4 MB. Please choose a smaller one.", 413);

  const detected = sniff(new Uint8Array(await file.slice(0, 12).arrayBuffer()));
  if (!detected) return fail("Please upload a JPG, PNG or WebP image", 415);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Photo upload rejected: BLOB_READ_WRITE_TOKEN is not configured");
    return fail("Photo storage is not set up yet. Please contact the website team.", 503);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) || "photo";
  try {
    const blob = await put(`media/${kind}/${baseName}.${detected.ext}`, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: detected.type
    });
    // blob.pathname is "media/<kind>/<name>"; the site serves it from "/media/<kind>/<name>".
    return NextResponse.json({ src: `/${blob.pathname}` }, { status: 201 });
  } catch (error) {
    console.error("Photo upload failed", error);
    return fail("The photo could not be uploaded. Please try again.", 503);
  }
}
