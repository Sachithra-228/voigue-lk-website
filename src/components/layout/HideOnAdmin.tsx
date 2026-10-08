"use client";

import { usePathname } from "next/navigation";

/** Hides the public site chrome (e.g. the footer) inside the admin area, which has its own layout. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith("/admin") ? null : <>{children}</>;
}
