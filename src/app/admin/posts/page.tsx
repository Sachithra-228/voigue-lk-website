import { assertAdmin } from "@/lib/admin-guard";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export default async function AdminPostsPage() {
  await assertAdmin();
  let items: Array<{ _id: string } & Record<string, unknown>> = [];
  let error = false;
  try {
    await connectToDatabase();
    items = JSON.parse(JSON.stringify(await BlogPost.find().sort({ createdAt: -1 }).lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Blog posts</h1>
      <p className="mt-3 text-muted">Articles shown on the Blog. Drafts stay hidden until you publish them.</p>
      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : (
        <div className="mt-6">
          <CollectionManager kind="posts" items={items} />
        </div>
      )}
    </>
  );
}
