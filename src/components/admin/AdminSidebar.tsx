"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Quote,
  X,
  type LucideIcon
} from "lucide-react";
import { clsx } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const groups: { label?: string; items: NavItem[] }[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    label: "Recruitment",
    items: [
      { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
      { href: "/admin/applications", label: "Applications", icon: FileText }
    ]
  },
  { label: "Enquiries", items: [{ href: "/admin/messages", label: "Messages", icon: Mail }] },
  {
    label: "Website content",
    items: [
      { href: "/admin/voices", label: "Employee Voices", icon: Quote },
      { href: "/admin/moments", label: "Life around here", icon: Images },
      { href: "/admin/posts", label: "Blog", icon: Newspaper }
    ]
  }
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="focus-ring relative mx-5 mt-6 block h-10 w-36" aria-label="Admin dashboard">
        <Image src="/images/nav_logo_transparent.png" alt="Voigue" fill sizes="144px" className="object-contain object-left" />
      </Link>
      <p className="mx-5 mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Admin</p>

      <nav aria-label="Admin" className="mt-6 flex-1 overflow-y-auto px-3">
        {groups.map((group, index) => (
          <div key={group.label ?? index} className={index ? "mt-6" : undefined}>
            {group.label ? (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{group.label}</p>
            ) : null}
            <ul className="grid gap-1">
              {group.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        active ? "bg-brand-violet text-white shadow-sm" : "text-ink hover:bg-lilac"
                      )}
                    >
                      <item.icon size={18} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="grid gap-1 border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-lilac"
        >
          <ExternalLink size={18} aria-hidden /> View website
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-red-50 hover:text-red-700">
            <LogOut size={18} aria-hidden /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  // The mobile drawer closes itself whenever the route changes.
  const [drawer, setDrawer] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const open = drawer.open && drawer.path === pathname;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer((current) => ({ ...current, open: false }));
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div>
      {/* Phone / tablet: top bar with a menu button */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="focus-ring relative block h-9 w-32" aria-label="Admin dashboard">
          <Image src="/images/nav_logo_transparent.png" alt="Voigue" fill sizes="128px" className="object-contain object-left" />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setDrawer({ open: true, path: pathname })}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white"
        >
          <Menu size={20} />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawer({ open: false, path: pathname })} aria-hidden />
          <div className="relative h-full w-72 max-w-[85%] bg-white shadow-2xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawer({ open: false, path: pathname })}
              className="focus-ring absolute right-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-lilac"
            >
              <X size={20} />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setDrawer({ open: false, path: pathname })} />
          </div>
        </div>
      ) : null}

      {/* Desktop: fixed sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-white lg:block">
        <SidebarContent pathname={pathname} />
      </aside>
    </div>
  );
}
