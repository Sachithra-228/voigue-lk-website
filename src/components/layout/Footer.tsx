"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Facebook, Instagram, Linkedin, Mail, Music2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { navItems, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/voigue365?igsi=dDN4NGdtZm5semQ0",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/voigue/",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/14nRE1USJ8Q/?mibextid=wwXIfr",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@voigueptyltd?_r=1&_t=ZS-99TKd3EV1eB",
    icon: Music2,
  },
];

const marqueeItems = [
  "Managed Staffing",
  "BPO Solutions",
  "Voigue Tech",
  "Digital Marketing",
  "Australian-Led Delivery",
  "Sri Lanka Operations"
];

export function Footer() {
  const scrollToTop = () => {
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <div
      className="relative h-[92svh] w-full bg-brand-navy"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <footer className="fixed bottom-0 left-0 flex h-[92svh] w-full flex-col justify-between overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/20 blur-[90px] motion-safe:animate-footer-breathe" />
        <div className="pointer-events-none absolute -bottom-[4vh] left-1/2 -translate-x-1/2 select-none text-[25vw] font-black leading-none text-white/[0.035]">
          VOIGUE
        </div>

        <div className="absolute left-0 top-10 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-white/10 bg-white/8 py-4 shadow-2xl backdrop-blur-md">
          <div className="flex w-max motion-safe:animate-footer-marquee">
            {[0, 1].map((set) => (
              <div
                className="flex items-center gap-8 px-4 text-xs font-semibold uppercase text-white/58 sm:text-sm"
                key={set}
              >
                {marqueeItems.map((item) => (
                  <span className="flex items-center gap-8 whitespace-nowrap" key={`${set}-${item}`}>
                    {item}
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-copper" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="container-x relative z-10 flex flex-1 items-center pt-28">
          <motion.div
            className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.7fr_0.85fr]"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <div>
              <Link href="/" className="focus-ring relative flex h-20 w-24 items-center" aria-label="Voigue home">
                <Image
                  src="/images/logo_transparent.png"
                  alt="Voigue"
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </Link>
              <h2 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Ready to build your global team?
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-white/68">{site.description}</p>
              <div className="mt-8">
                <Button href="/contact" variant="secondary">Start a Conversation</Button>
              </div>
            </div>

            <div>
              <p className="font-semibold">Company</p>
              <div className="mt-5 grid gap-3">
                {navItems.map((item) => (
                  <Link className="text-white/68 transition hover:text-white" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold">Contact</p>
              <div className="mt-5 grid gap-3 text-white/68">
                <a className="inline-flex items-center gap-2 transition hover:text-white" href={`mailto:${site.email}`}>
                  <Mail size={16} /> {site.email}
                </a>
                <a className="inline-flex items-center gap-2 transition hover:text-white" href={`tel:${site.phone.replace(/\D/g, "")}`}>
                  <Phone size={16} /> {site.phone}
                </a>
              </div>
              <p className="mt-8 font-semibold">Social</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      aria-label={social.label}
                      className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/7 text-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] backdrop-blur-md transition hover:border-white/35 hover:bg-white/14 hover:text-white"
                      href={social.href}
                      rel="noreferrer"
                      target="_blank"
                      title={social.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container-x relative z-20 grid gap-6 border-t border-white/12 py-7 text-sm text-white/58 md:grid-cols-[1fr_auto_auto] md:items-center">
          <p>(c) 2026 Voigue PVT Ltd. Content and legal pages require final client review.</p>
          <div className="flex flex-wrap gap-5">
            <Link className="transition hover:text-white" href="/privacy-policy">Privacy Policy</Link>
            <Link className="transition hover:text-white" href="/terms">Terms</Link>
            <Link className="transition hover:text-white" href="/cookie-policy">Cookie Policy</Link>
          </div>
          <button
            aria-label="Back to top"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/7 text-white/70 backdrop-blur-md transition hover:border-white/35 hover:bg-white/14 hover:text-white"
            onClick={scrollToTop}
            type="button"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
