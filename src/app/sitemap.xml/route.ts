import { site } from "@/lib/content";
import { getPosts } from "@/lib/query";

export async function GET() {
  const posts = await getPosts();
  const paths = [
    "",
    "/about",
    "/life-at-voigue",
    "/careers",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
    ...posts.map((item) => `/blog/${item.slug}`)
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `<url><loc>${site.url}${path}</loc></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
