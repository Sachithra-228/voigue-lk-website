import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/messages", label: "Messages" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await requireAdmin();
  if (!authed) return <>{children}</>;

  return (
    <div className="min-h-[70svh] bg-paper pt-28">
      <div className="container-x pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <nav aria-label="Admin" className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/logout" method="post">
            <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">Sign out</button>
          </form>
        </div>
        <div className="pt-10">{children}</div>
      </div>
    </div>
  );
}
