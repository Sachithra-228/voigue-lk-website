import { assertAdmin } from "@/lib/admin-guard";
import { ApplicationStatus } from "@/components/admin/ApplicationStatus";
import { connectToDatabase } from "@/lib/mongodb";
import Application from "@/models/Application";

type Row = {
  _id: string;
  type?: "role" | "general";
  name: string;
  email: string;
  jobTitle?: string;
  roleInterest?: string;
  preferredSetup?: string;
  message?: string;
  cvFileName?: string;
  cvPathname?: string;
  status: string;
  createdAt: string;
};

export default async function AdminApplicationsPage() {
  await assertAdmin();
  let rows: Row[] = [];
  let error = false;
  try {
    await connectToDatabase();
    rows = JSON.parse(JSON.stringify(await Application.find().sort({ createdAt: -1 }).limit(200).select("-cvUrl").lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Applications</h1>
      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : rows.length ? (
        <ul className="mt-8 grid gap-4">
          {rows.map((row) => (
            <li key={row._id} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-ink">{row.name}</p>
                  <a className="text-sm text-brand-violet hover:underline" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                </div>
                <ApplicationStatus id={row._id} status={row.status} />
              </div>
              <p className="mt-3 text-sm text-muted">
                {row.type === "general"
                  ? `General CV · ${row.roleInterest} · ${row.preferredSetup}`
                  : `Applied for ${row.jobTitle ?? "a listed role"}`}
                {" · "}
                {new Date(row.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              {row.message ? <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink">{row.message}</p> : null}
              {row.cvPathname ? (
                <a
                  href={`/api/applications/${row._id}/cv`}
                  className="focus-ring mt-4 inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-paper"
                >
                  Download CV{row.cvFileName ? ` (${row.cvFileName})` : ""}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-muted">No applications yet.</p>
      )}
    </>
  );
}
