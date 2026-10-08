import { assertAdmin } from "@/lib/admin-guard";
import { connectToDatabase } from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";

type Row = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
};

export default async function AdminMessagesPage() {
  await assertAdmin();
  let rows: Row[] = [];
  let error = false;
  try {
    await connectToDatabase();
    rows = JSON.parse(JSON.stringify(await ContactSubmission.find().sort({ createdAt: -1 }).limit(200).lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Messages</h1>
      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : rows.length ? (
        <ul className="mt-8 grid gap-4">
          {rows.map((row) => (
            <li key={row._id} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-lg font-semibold text-ink">
                {row.firstName} {row.lastName}
              </p>
              <p className="mt-1 text-sm text-muted">
                <a className="text-brand-violet hover:underline" href={`mailto:${row.email}`}>
                  {row.email}
                </a>
                {row.phone ? ` · ${row.phone}` : ""}
                {" · "}
                {new Date(row.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink">{row.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-muted">No messages yet.</p>
      )}
    </>
  );
}
