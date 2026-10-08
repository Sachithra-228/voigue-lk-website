import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Application from "@/models/Application";
import ContactSubmission from "@/models/ContactSubmission";
import Job from "@/models/Job";

function Login({ failed }: { failed: boolean }) {
  return (
    <section className="bg-white pt-32">
      <div className="container-x max-w-md py-16">
        <h1 className="text-4xl font-semibold">Admin login</h1>
        <form action="/api/auth/login" method="post" className="mt-8 grid gap-4 rounded-2xl border border-line bg-paper p-6">
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input name="email" type="email" className="focus-ring rounded-xl border border-line px-4 py-3" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input name="password" type="password" className="focus-ring rounded-xl border border-line px-4 py-3" required />
          </label>
          <button className="focus-ring rounded-full bg-ink px-5 py-3 font-semibold text-white">Sign in</button>
          {failed ? <p className="text-sm text-red-700">Invalid credentials or admin environment is not configured.</p> : null}
        </form>
      </div>
    </section>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ login?: string }> }) {
  const params = await searchParams;
  if (!(await requireAdmin())) return <Login failed={params.login === "failed"} />;

  let counts: { label: string; value: number; href: string }[] = [];
  let connected = true;
  try {
    await connectToDatabase();
    const [openJobs, newApplications, newMessages] = await Promise.all([
      Job.countDocuments({ status: "Active" }),
      Application.countDocuments({ status: "New" }),
      ContactSubmission.countDocuments({ status: "New" })
    ]);
    counts = [
      { label: "Open jobs", value: openJobs, href: "/admin/jobs" },
      { label: "New applications", value: newApplications, href: "/admin/applications" },
      { label: "New messages", value: newMessages, href: "/admin/messages" }
    ];
  } catch {
    connected = false;
  }

  return (
    <>
      <h1 className="text-4xl font-semibold">Dashboard</h1>
      {connected ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {counts.map((item) => (
            <Link key={item.label} href={item.href} className="focus-ring rounded-2xl border border-line bg-white p-6 transition hover:shadow-soft">
              <p className="text-4xl font-semibold text-brand-violet">{item.value}</p>
              <p className="mt-2 text-muted">{item.label}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-2xl bg-white p-6 text-muted">The database is not reachable. Check MONGODB_URI.</p>
      )}
    </>
  );
}
