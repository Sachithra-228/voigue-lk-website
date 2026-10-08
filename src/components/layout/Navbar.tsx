"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, site } from "@/lib/content";

/** Pages that open with a dark full-bleed hero, so the nav starts transparent with light text. */
const darkHeroPaths = ["/", "/about", "/life-at-voigue", "/careers"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const [scrolled, setScrolled] = useState(false);

  // The mobile menu closes itself whenever the route changes.
  const open = menu.open && menu.path === pathname;
  const setOpen = (next: boolean) => setMenu({ open: next, path: pathname });
  const overHero = darkHeroPaths.includes(pathname);
  const solid = scrolled || open || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu((current) => ({ ...current, open: false }));
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  // The admin area has its own sidebar layout.
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition ${
          solid ? "border-b border-line bg-white/95 shadow-sm backdrop-blur" : "bg-transparent"
        }`}
      >
        <nav className="container-x flex h-20 items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="focus-ring relative flex h-12 w-40 items-center" aria-label="Voigue home">
            <Image
              src={solid ? "/images/nav_logo_transparent.png" : "/images/nav_logo_light.png"}
              alt="Voigue"
              fill
              priority
              className="object-contain object-left"
              sizes="160px"
            />
          </Link>
          <div className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`focus-ring relative py-2 text-sm font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-current after:transition-transform ${
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  } ${solid ? "text-ink hover:text-brand-violet" : "text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-brand-violet hover:text-brand-violet lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-white pt-20 text-ink lg:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_6%,hsl(var(--lilac-deep)),transparent_38%)]" />
          <div className="container-x relative flex min-h-full flex-col justify-between py-8">
            <div className="grid">
              {navItems.map((item, index) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring group flex min-h-16 items-center justify-between border-b border-line py-4 transition ${
                      active ? "text-brand-violet" : "text-ink hover:text-brand-violet"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-7 text-xs font-semibold text-brand-violet">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-3xl font-semibold leading-none">{item.label}</span>
                    </span>
                    <ArrowRight size={20} className="transition group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-sm text-muted">
              <p>{site.brandLine}</p>
              <a className="mt-3 block font-medium text-ink" href={`mailto:${site.emails.careers}`}>
                {site.emails.careers}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
