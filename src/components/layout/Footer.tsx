import Link from "next/link";
import Image from "next/image";
import { Facebook, Globe, Instagram, Linkedin, Music2, Phone } from "lucide-react";
import { footerQuickLinks, openRolesHref, site } from "@/lib/content";

const socialIcons = {
  LinkedIn: Linkedin,
  Instagram,
  Facebook,
  TikTok: Music2
} as const;

const heading = "text-sm font-semibold text-white after:mt-3 after:block after:h-px after:w-6 after:bg-white/40";
const linkClass = "text-sm text-white/70 transition hover:text-white";

export function Footer() {
  const { australia, sriLanka } = site.locations;

  return (
    <footer className="px-3 pb-3 pt-10 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,hsl(278_63%_16%),hsl(266_58%_26%))] text-white">
        {/* Slot for the supplied Voigue wave artwork (do not recreate it here). */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-violet/30 blur-3xl" aria-hidden />

        <div className="container-x relative grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr_1fr_1.4fr_0.8fr] lg:py-16">
          <div>
            <Link href="/" className="focus-ring relative block h-12 w-36" aria-label="Voigue home">
              <Image src="/images/nav_logo_light.png" alt="Voigue" fill className="object-contain object-left" sizes="144px" />
            </Link>
            <p className="mt-5 max-w-[16rem] text-sm leading-6 text-white/70">{site.brandLine}</p>
            <div className="mt-6 grid gap-2 text-sm text-white/80">
              <a className="inline-flex items-center gap-2 transition hover:text-white" href={`tel:${site.phones.sriLanka.replace(/\s/g, "")}`}>
                <Phone size={15} /> {site.phones.sriLanka}
              </a>
              <span className="inline-flex items-center gap-2">
                <Globe size={15} /> {site.website}
              </span>
            </div>
          </div>

          <div>
            <p className={heading}>Quick Links</p>
            <ul className="mt-5 grid gap-3">
              {footerQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link className={linkClass} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>Careers</p>
            <ul className="mt-5 grid gap-3">
              <li>
                <Link className={linkClass} href={openRolesHref}>
                  View Open Roles
                </Link>
              </li>
              <li className="text-sm leading-6 text-white/70">
                Send your CV to
                <br />
                <a className="font-medium text-white underline-offset-4 hover:underline" href={`mailto:${site.emails.careers}`}>
                  {site.emails.careers}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className={heading}>Our Locations</p>
            <address className="mt-5 grid gap-5 text-sm not-italic leading-6 text-white/70">
              <p>
                <span className="block font-semibold text-violet-300">{australia.country}</span>
                {australia.address}
              </p>
              <p>
                <span className="block font-semibold text-violet-300">{sriLanka.country}</span>
                {sriLanka.address}
              </p>
            </address>
          </div>

          <div>
            <p className={heading}>Follow Us</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {site.social.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                return (
                  <a
                    key={social.label}
                    aria-label={social.label}
                    title={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:border-white/50 hover:bg-white/20 hover:text-white"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container-x relative flex flex-col gap-3 border-t border-white/12 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Voigue (Pvt) Ltd. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <Link className="transition hover:text-white" href="/privacy-policy">
              Privacy Policy
            </Link>
            <span aria-hidden>|</span>
            <Link className="transition hover:text-white" href="/terms">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
