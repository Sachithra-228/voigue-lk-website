import { get } from "@vercel/blob";

export const runtime = "nodejs";

const notFound = () => new Response("Not found", { status: 404 });

/**
 * Public route that serves photos uploaded through the admin. It only ever reads pathnames under
 * "media/", so private files in the same store (such as CVs under "cvs/") can never be reached here.
 */
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (!path.length || path.some((segment) => !segment || segment === "." || segment === "..")) return notFound();

  try {
    const result = await get(`media/${path.join("/")}`, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.blob.contentType.startsWith("image/")) return notFound();

    return new Response(result.stream, {
      headers: {
        "content-type": result.blob.contentType,
        // File names carry a random suffix, so a given URL never changes.
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff"
      }
    });
  } catch {
    return notFound();
  }
}
