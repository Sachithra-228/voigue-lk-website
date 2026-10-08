import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await requireAdmin();
  // Signed out: pages render the login screen on their own, without the sidebar.
  if (!authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <AdminSidebar />
      <div className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
