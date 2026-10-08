import Link from "next/link";
import { getPosts } from "@/lib/query";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Blog", "News, stories and ideas from the Voigue team.", "/blog");

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const posts = await getPosts();
  const query = params.q?.toLowerCase() || "";
  const filtered = posts.filter((post) => !query || post.title.toLowerCase().includes(query) || post.excerpt?.toLowerCase().includes(query));

  return (
    <section className="bg-white pt-32">
      <div className="container-x py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-violet">Blog</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Ideas for building better managed global teams.
        </h1>
        <form className="mt-8 max-w-lg">
          <label className="sr-only" htmlFor="q">Search articles</label>
          <input id="q" name="q" placeholder="Search the blog" defaultValue={params.q} className="focus-ring w-full rounded-full border border-line px-5 py-3" />
        </form>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {filtered.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="focus-ring rounded-2xl border border-line bg-paper p-7 transition hover:shadow-soft">
              <p className="text-sm font-semibold text-brand-violet">{post.category}</p>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
        {!filtered.length ? <p className="mt-10 text-muted">No articles match your search.</p> : null}
      </div>
    </section>
  );
}
