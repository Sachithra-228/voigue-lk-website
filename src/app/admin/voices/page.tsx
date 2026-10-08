import { assertAdmin } from "@/lib/admin-guard";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export default async function AdminVoicesPage() {
  await assertAdmin();
  let items: Array<{ _id: string } & Record<string, unknown>> = [];
  let error = false;
  try {
    await connectToDatabase();
    items = JSON.parse(JSON.stringify(await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Employee Voices</h1>
      <p className="mt-3 text-muted">Shown in the Employee Voices carousel on the Life at Voigue page. Changes appear within seconds.</p>
      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : (
        <div className="mt-6">
          <CollectionManager kind="voices" items={items} />
        </div>
      )}
    </>
  );
}
