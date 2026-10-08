import { assertAdmin } from "@/lib/admin-guard";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { connectToDatabase } from "@/lib/mongodb";
import Moment from "@/models/Moment";

export default async function AdminMomentsPage() {
  await assertAdmin();
  let items: Array<{ _id: string } & Record<string, unknown>> = [];
  let error = false;
  try {
    await connectToDatabase();
    items = JSON.parse(JSON.stringify(await Moment.find().sort({ order: 1, createdAt: -1 }).lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Life around here</h1>
      <p className="mt-3 text-muted">Photos in the Life at Voigue gallery, filtered by category. Changes appear within seconds.</p>
      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : (
        <div className="mt-6">
          <CollectionManager kind="moments" items={items} />
        </div>
      )}
    </>
  );
}
