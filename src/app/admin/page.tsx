import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Application from "@/models/Application";
import ContactSubmission from "@/models/ContactSubmission";
import Job from "@/models/Job";

function Login({ failed }: { failed: boolean }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_85%_8%,hsl(var(--lilac-deep)),transparent_40%),hsl(var(--paper))] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="relative mx-auto h-12 w-44">
          <Image src="/images/nav_logo_transparent.png" alt="Voigue" fill sizes="176px" className="object-contain" priority />
        </div>
        <form action="/api/auth/login" method="post" className="mt-8 grid gap-5 rounded-3xl border border-line bg-white p-8 shadow-soft">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted">Manage jobs, applications and website content.</p>
          </div>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Email
            <input name="email" type="email" autoComplete="username" className="focus-ring rounded-xl border border-line px-4 py-3 text-sm font-normal" required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Password
            <input name="password" type="password" autoComplete="current-password" className="focus-ring rounded-xl border border-line px-4 py-3 text-sm font-normal" required />
          </label>
          <button className="focus-ring rounded-full bg-brand-violet px-5 py-3 font-semibold text-white transition hover:bg-brand-blue">Sign in</button>
          {failed ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              Invalid credentials, or the admin login isn&apos;t configured on this server.
            </p>
          ) : null}
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
