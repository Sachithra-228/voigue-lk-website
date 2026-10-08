import { assertAdmin } from "@/lib/admin-guard";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { setupDot } from "@/lib/content";
import Job from "@/models/Job";

type Row = { _id: string; title: string; workSetup?: string; status: string; location?: string };

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Draft: "bg-amber-100 text-amber-800",
  Closed: "bg-slate-200 text-slate-700"
};

export default async function AdminJobsPage() {
  await assertAdmin();
  let jobs: Row[] = [];
  let error = false;
  try {
    await connectToDatabase();
    jobs = JSON.parse(JSON.stringify(await Job.find().sort({ updatedAt: -1 }).lean()));
  } catch {
    error = true;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">Jobs</h1>
        <Link href="/admin/jobs/new" className="focus-ring rounded-full bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue">
          Add job
        </Link>
      </div>
      <p className="mt-3 text-muted">Active jobs appear on the Home and Careers pages as soon as you save.</p>

      {error ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      ) : jobs.length ? (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {jobs.map((job) => (
            <li key={job._id}>
              <Link href={`/admin/jobs/${job._id}`} className="focus-ring flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-paper">
                <span>
                  <span className="block font-semibold text-ink">{job.title}</span>
                  <span className="mt-1 inline-flex items-center gap-2 text-sm text-muted">
                    <span className={`h-2 w-2 rounded-full ${setupDot(job.workSetup)}`} aria-hidden />
                    {job.workSetup} {job.location ? `· ${job.location}` : ""}
                  </span>
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[job.status] ?? ""}`}>{job.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-muted">No jobs yet. Add your first vacancy.</p>
      )}
    </>
  );
}
